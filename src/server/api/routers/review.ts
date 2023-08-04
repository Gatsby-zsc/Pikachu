import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        reviewContent: z.string(),
        rating: z.number(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const review = await ctx.prisma.review.create({
        data: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
          reviewContent: input.reviewContent,
          rating: input.rating,
          reviewDate: new Date(),
        },
      });

      return review;
    }),
  checkReviewVaild: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.session) {
        return false;
      }

      const order = await ctx.prisma.order.findMany({
        where: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
        },
      });
      return order;
    }),
  getReviews: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const review = await ctx.prisma.review.findMany({
        where: {
          eventId: input,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      return review;
    }),
  checkReplyValid: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return false;

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input,
          createdUser: ctx.session.user.id,
        },
      });

      const isvaild = !!event;
      return isvaild;
    }),
  updateHostResponse: publicProcedure
    .input(
      z.object({
        id: z.string(),
        hostResponse: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const review = await ctx.prisma.review.update({
        where: {
          id: input.id,
        },
        data: {
          hostResponse: input.hostResponse,
        },
      });

      return review;
    }),
});
