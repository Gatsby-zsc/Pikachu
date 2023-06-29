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
        capacity: z.number(),
        price: z.number(),
        eventStatus: z.boolean(),
        seatType: z.string(),
      })
    )
    // .output(z.object())
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.create({
        data: {
          createdUser: ctx.session.user.id,
          title: input.title,
          discription: input.description,
          type: input.type,
          venue: input.venue,
          startTime: input.startTime,
          endTime: input.endTime,
          capacity: input.capacity,
          price: input.price,
          eventStatus: input.eventStatus,
          tickets: {
            create: {
              seatType: input.seatType,
              price: input.price,
              numberOfTickets: input.capacity,
            },
          },
        },
      });
      console.log(event);
    }),
});
