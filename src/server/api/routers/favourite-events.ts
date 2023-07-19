import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const favouriteRouterRouter = createTRPCRouter({
  check: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.userFavouriteEvent.findFirst({
        where: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
        },
      });
    }),
  add: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.userFavouriteEvent.create({
        data: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.userFavouriteEvent.delete({
        where: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
        },
      });
    }),
});
