import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const ticketRouter = createTRPCRouter({
  prices: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          eventId: input.eventId,
        },
        select: {
          price: true,
        },
      });
    }),

  availability: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input, ctx }) => {
      const totalTickets = await ctx.prisma.ticket.findMany({
        where: {
          eventId: input.eventId,
        },
        select: {
          id: true,
          capacity: true,
          remaining: true,
        },
      });
      return totalTickets;
    }),
});
