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
  avability: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ input, ctx }) => {
      const totalTcikets = await ctx.prisma.ticket.findMany({
        where: {
          eventId: input.eventId,
        },
        select: {
          id: true,
          numberOfTickets: true,
          orderTickets: true,
        },
      });
      return totalTcikets;
    }),
});
