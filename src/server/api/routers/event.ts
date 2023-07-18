import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    // input/output validation, to be done later
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        type: z.string(),
        venue: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        eventStatus: z.number(),
        tickets: z
          .object({
            ticketName: z.string(),
            ticketDescription: z.string(),
            price: z.number(),
            quantity: z.number(),
          })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.create({
        data: {
          createdUser: ctx.session.user.id,
          title: input.title,
          description: input.description,
          type: input.type,
          venue: input.venue,
          startTime: input.startTime,
          endTime: input.endTime,
          eventStatus: input.eventStatus,
          tickets: {
            createMany: {
              data: input.tickets.map((ticket) => ({
                ticketName: ticket.ticketName,
                ticketDescription: ticket.ticketDescription,
                price: ticket.price,
                numberOfTickets: ticket.quantity,
              })),
            },
          },
        },
      });
      console.log(event);
    }),
});
