import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        cardNum: z.string(),
        expiryDate: z.string(),
        cardCVC: z.string(),
        cardHoldName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          phone: input.phone,
          cardNum: input.cardNum,
          expiryDate: input.expiryDate,
          cardCVC: input.cardCVC,
          cardHoldName: input.cardHoldName,
        },
      });

      return user;
    }),
});
