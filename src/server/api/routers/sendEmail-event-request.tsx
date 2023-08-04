import BookedEmail from "@/utils/book-email-page";
import EditEmail from "@/utils/Edit-email-page";
import DeleteEmail from "@/utils/delete-email-page";
import { resend } from "@/lib/resend";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { CancelEmail } from "@/utils/cancel-email-page";

export const sendEventEmailRouter = createTRPCRouter({
  sendBookedRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const eventData = await ctx.prisma.event.findFirst({
        where: {
          id: input,
        },
        select: {
          title: true,
          description: true,
          venue: true,
        },
      });
      if (!eventData) {
        return null;
      }
      const data = await resend.sendEmail({
        from: "noreply@pikapika.stimw.com",
        to: ctx.session.user.email ?? "",
        subject: "PikaPika~ You booked an event",
        react: <BookedEmail eventData={eventData} />,
      });
    }),
  sendDeleteRequest: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        title: z.string(),
        description: z.string(),
        type: z.string(),
        category: z.string(),
        venue: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        eventStatus: z.number(),
        tickets: z
          .object({
            id: z.number(),
            ticketName: z.string(),
            ticketDescription: z.string(),
            price: z.number(),
            capacity: z.number(),
            remaining: z.number(),
          })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await resend.sendEmail({
          from: "noreply@pikapika.stimw.com",
          to: input.email,
          subject: "PikaPika~ An event was canceled",
          react: <DeleteEmail eventData={input} />,
        });
        console.log("Email sent: ", data);
      } catch (err) {
        console.error(err);
      }
    }),

  sendEditRequest: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        title: z.string(),
        description: z.string(),
        type: z.string(),
        category: z.string(),
        venue: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        eventStatus: z.number(),
        tickets: z
          .object({
            id: z.number(),
            ticketName: z.string(),
            ticketDescription: z.string(),
            price: z.number(),
            capacity: z.number(),
            remaining: z.number(),
          })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const data = await resend.sendEmail({
          from: "noreply@pikapika.stimw.com",
          to: input.email,
          subject: "PikaPika~ An event you booked to has been modified",
          react: <EditEmail eventData={input} />,
        });
        console.log("Email sent: ", data);
      } catch (err) {
        console.error(err);
      }
    }),
  sendCancelRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const eventData = await ctx.prisma.event.findFirst({
        where: {
          id: input,
        },
        select: {
          title: true,
          description: true,
          venue: true,
        },
      });
      if (!eventData) {
        return null;
      }
      const data = await resend.sendEmail({
        from: "noreply@pikapika.stimw.com",
        to: ctx.session.user.email ?? "",
        subject: "PikaPika~ You canceled an event",
        react: <CancelEmail eventData={eventData} />,
      });
    }),
});
