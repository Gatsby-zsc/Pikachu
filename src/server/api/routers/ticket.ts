import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

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
});
