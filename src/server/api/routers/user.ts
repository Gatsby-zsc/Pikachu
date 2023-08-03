import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        billingAddress: z.string(),
        shippingAddress: z.string(),
        billingPostcode: z.string(),
        shippingPostcode: z.string(),
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
          billingAddress: input.billingAddress,
          shippingAddress: input.shippingAddress,
          billingPostcode: input.billingPostcode,
          shippingPostcode: input.billingPostcode,
          cardNum: input.cardNum,
          expiryDate: input.expiryDate,
          cardCVC: input.cardCVC,
          cardHoldName: input.cardHoldName,
        },
      });

      return user;
    }),
  getUserDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    return user;
  }),
});
