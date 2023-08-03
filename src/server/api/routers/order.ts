import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const orderRouter = createTRPCRouter({
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
        ticketInfo: z.record(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create the order first
      const order = await ctx.prisma.order.create({
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
          ticketInfo: input.ticketInfo,
          userId: ctx.session.user.id,
          bill: 0,
          bookDate: new Date(),
          bookStatus: true,
        },
      });

      // Calculate total bill
      let totalBill = 0;

      // Update ticket counts
      for (const ticketIdStr in input.ticketInfo) {
        const ticketId = parseInt(ticketIdStr);
        const numberOftickets = input.ticketInfo[ticketIdStr];

        if (numberOftickets === undefined) {
          throw new Error(
            `Ticket count not found for ticket id ${ticketIdStr}`
          );
        }

        const ticket = await ctx.prisma.ticket.findUnique({
          where: { id: ticketId },
        });

        if (!ticket || ticket.remaining < numberOftickets) {
          throw new Error("Insufficient tickets");
        }

        await ctx.prisma.ticket.update({
          where: { id: ticketId },
          data: { remaining: ticket.remaining - numberOftickets },
        });

        totalBill += ticket.price * numberOftickets;
      }

      // Update order with total bill
      await ctx.prisma.order.update({
        where: { id: order.id },
        data: { bill: totalBill },
      });
    }),
  getOrders: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const orders = await ctx.prisma.order.findMany({
        where: { userId: input },
        include: {
          orderTickets: { include: { ticket: true } },
          event: true,
        },
      });

      if (!orders || orders.length === 0) {
        throw new Error("No orders found for this user");
      }

      return orders;
    }),
  cancelOrder: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      const ticketInfo = order.ticketInfo;

      if (
        typeof ticketInfo === "object" &&
        ticketInfo !== null &&
        !Array.isArray(ticketInfo)
      ) {
        for (const ticketIdStr in ticketInfo) {
          const ticketId = parseInt(ticketIdStr);
          const numberOfTickets = (ticketInfo as Record<string, number>)[
            ticketIdStr
          ];

          if (typeof numberOfTickets === "number") {
            await ctx.prisma.ticket.update({
              where: { id: ticketId },
              data: { remaining: { increment: numberOfTickets } },
            });
          }
        }
      } else {
        throw new Error("ticketInfo should be an object");
      }

      await ctx.prisma.order.update({
        where: { id: input },
        data: { bookStatus: false, cancellationDate: new Date() },
      });

      return { message: "Order cancelled and tickets released" };
    }),

  deleteOrder: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      const ticketInfo = order.ticketInfo;

      if (
        typeof ticketInfo === "object" &&
        ticketInfo !== null &&
        !Array.isArray(ticketInfo)
      ) {
        for (const ticketIdStr in ticketInfo) {
          const ticketId = parseInt(ticketIdStr);
          const numberOfTickets = (ticketInfo as Record<string, number>)[
            ticketIdStr
          ];

          if (typeof numberOfTickets === "number") {
            await ctx.prisma.ticket.update({
              where: { id: ticketId },
              data: { remaining: { increment: numberOfTickets } },
            });
          }
        }
      } else {
        throw new Error("ticketInfo should be an object");
      }

      await ctx.prisma.order.delete({ where: { id: input } });

      return { message: "Order deleted and tickets released" };
    }),
});
