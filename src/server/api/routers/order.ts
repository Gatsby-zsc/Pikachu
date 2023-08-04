import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  getAllSeats: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const seats = await ctx.prisma.seat.findMany({
        where: {
          eventId: input,
        },
      });

      const maxRow = Math.max(...seats.map((seat) => seat.row));
      const maxCol = Math.max(...seats.map((seat) => seat.col));

      const reservedSeats = seats
        .filter((seat) => seat.status === "reserved")
        .map((seat) => ({ row: seat.row - 1, col: seat.col - 1 }));

      return {
        seats,
        maxRow,
        maxCol,
        reservedSeats,
      };
    }),
  getAllorders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            cover_image: true,
            venue: true,
            startTime: true,
          },
        },
        seats: {
          select: {
            row: true,
            col: true,
          },
        },
        orderTickets: {
          include: {
            ticket: true,
          },
        },
      },
      orderBy: {
        event: {
          startTime: "desc",
        },
      },
    });
    return orders;
  }),

  getUniqueOrder: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              cover_image: true,
              venue: true,
              startTime: true,
              description: true,
            },
          },
          seats: {
            select: {
              id: true,
              row: true,
              col: true,
            },
          },
          orderTickets: {
            include: {
              ticket: true,
            },
          },
        },
      });
      return order;
    }),

  createOrderAndUpdateTicket: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        emailAddress: z.string(),
        shippingAddress: z.string(),
        billingAddress: z.string(),
        cardNum: z.string(),
        expiryDate: z.string(),
        cardCVV: z.string(),
        eventId: z.string(),
        bills: z.number(),
        ticketInfo: z.record(z.number()),
        seatsInfo: z.array(
          z.object({
            row: z.number(),
            col: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Update seats

      const orderCreatePromise = await ctx.prisma.order.create({
        data: {
          name: input.name,
          phone: input.phone,
          email: input.emailAddress,
          shippingAddress: input.shippingAddress,
          billingAddress: input.billingAddress,
          cardNum: input.cardNum,
          expiryDate: input.expiryDate,
          cardCVV: input.cardCVV,
          eventId: input.eventId,
          userId: ctx.session.user.id,
          bill: input.bills,
          orderTickets: {
            createMany: {
              data: Object.entries(input.ticketInfo).map(
                ([ticketId, ticketNumbers]) => {
                  return {
                    ticketId: parseInt(ticketId),
                    ticketNumber: ticketNumbers,
                  };
                }
              ),
            },
          },
          bookDate: new Date(),
          bookStatus: true,
        },
      });

      const updatePromises = Object.entries(input.ticketInfo).map(
        ([ticketId, ticketNumbers]) => {
          return ctx.prisma.ticket.update({
            where: { id: parseInt(ticketId) },
            data: {
              remaining: {
                decrement: ticketNumbers,
              },
            },
          });
        }
      );

      const seatUpdatePromises = input.seatsInfo.map((seatInfo) => {
        return ctx.prisma.seat.update({
          where: {
            eventId_row_col: {
              eventId: input.eventId,
              row: seatInfo.row + 1,
              col: seatInfo.col + 1,
            },
          },
          data: {
            status: "reserved",
            orderId: orderCreatePromise.id,
          },
        });
      });

      await ctx.prisma.$transaction([...seatUpdatePromises, ...updatePromises]);
    }),
  cancelOrderAndUpdateTicket: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input },
        include: {
          seats: {
            select: {
              id: true,
            },
          },
          orderTickets: {
            include: {
              ticket: true,
            },
          },
        },
      });

      if (!order)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order not found",
        });

      const orderCancelPromise = ctx.prisma.order.update({
        where: { id: input },
        data: {
          bookStatus: false,
          cancellationDate: new Date(),
        },
      });

      const ticketUpdatePromises = order.orderTickets.map((orderTicket) => {
        return ctx.prisma.ticket.update({
          where: { id: orderTicket.ticketId },
          data: {
            remaining: {
              increment: orderTicket.ticketNumber,
            },
          },
        });
      });

      const seatUpdatePromises = order.seats.map((seat) => {
        return ctx.prisma.seat.update({
          where: { id: seat.id },
          data: {
            status: "available",
          },
        });
      });

      await ctx.prisma.$transaction([
        orderCancelPromise,
        ...ticketUpdatePromises,
        ...seatUpdatePromises,
      ]);
    }),
});
