import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        type: z.string(),
        category: z.string(),
        cover_image: z.string(),
        images: z.string().array(),
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
        seatRows: z.number(),
        seatColumns: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.event.create({
        data: {
          createdUser: ctx.session.user.id,
          title: input.title,
          description: input.description,
          type: input.type,
          category: input.category,
          venue: input.venue,
          startTime: input.startTime,
          endTime: input.endTime,
          eventStatus: input.eventStatus,
          cover_image: input.cover_image,
          images: [...input.images],
          tickets: {
            createMany: {
              data: input.tickets.map((ticket) => ({
                ticketName: ticket.ticketName,
                ticketDescription: ticket.ticketDescription,
                price: ticket.price,
                capacity: ticket.quantity,
                remaining: ticket.quantity,
              })),
            },
          },
          seats: {
            createMany: {
              data: Array.from(
                { length: input.seatRows * input.seatColumns },
                (_, i) => ({
                  row: Math.floor(i / input.seatColumns) + 1,
                  col: (i % input.seatColumns) + 1,
                  status: "available",
                })
              ),
            },
          },
          seatRow: input.seatRows,
          seatColumn: input.seatColumns,
        },
      });
    }),
  publicFilterEvents: publicProcedure
    .input(
      z.object({
        Date: z.string(),
        Category: z.string(),
        Type: z.string(),
        isOnline: z.boolean(),
        onlyEventsFollowed: z.boolean(),
        sortKey: z.string(),
        userKey: z.string(),
        sortDirection: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      let events = await ctx.prisma.event.findMany({
        include: {
          tickets: {
            select: {
              price: true,
              remaining: true,
            },
          },
          orders: {
            select: {
              email: true,
            },
          },
        },
      });

      // compare date
      if (input.Date !== "none") {
        const date = new Date();
        if (input.Date === "Today") {
          events = events.filter((event) => {
            return (
              event.startTime.getDate() === date.getDate() &&
              event.startTime.getMonth() === date.getMonth() &&
              event.startTime.getFullYear() === date.getFullYear()
            );
          });
        } else if (input.Date === "Tomorrow") {
          date.setDate(date.getDate() + 1);
          events = events.filter((event) => {
            return (
              event.startTime.getDate() === date.getDate() &&
              event.startTime.getMonth() === date.getMonth() &&
              event.startTime.getFullYear() === date.getFullYear()
            );
          });
        } else if (input.Date === "This weekend") {
          events = events.filter((event) => {
            return (
              event.startTime.getDate() > date.getDate() &&
              event.startTime.getDate() - date.getDate() < 7 &&
              (event.startTime.getDay() === 0 || event.startTime.getDay() === 6)
            );
          });
        }
      }

      if (input.Category !== "none") {
        events = events.filter((event) => {
          return event.category === input.Category;
        });
      }

      if (input.Type !== "none") {
        events = events.filter((event) => {
          return event.type === input.Type;
        });
      }

      if (input.isOnline) {
        events = events.filter((event) => {
          return event.isOnline;
        });
      }

      type eventDataType = (typeof events)[0];

      function compareVenue(a: eventDataType, b: eventDataType) {
        return a.venue.localeCompare(b.venue);
      }

      function compareDate(a: eventDataType, b: eventDataType) {
        const firstSeconds = a.startTime.getTime();
        const secondSeconds = b.startTime.getTime();
        return firstSeconds - secondSeconds;
      }

      if (input.sortKey !== "0") {
        // sort by Date
        if (input.sortKey === "1") {
          events = events.sort(compareDate);
        }
        // sort by location
        else if (input.sortKey === "2") {
          events = events.sort(compareVenue);
        }
      }
      if (input.sortKey !== "0") {
        if (input.sortDirection !== "asc") {
          events = events.reverse();
        }
      }

      return events;
    }),
  protectedFilterEvents: protectedProcedure
    .input(
      z.object({
        Date: z.string(),
        Category: z.string(),
        Type: z.string(),
        isOnline: z.boolean(),
        onlyEventsFollowed: z.boolean(),
        sortKey: z.string(),
        userKey: z.string(),
        sortDirection: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      let events = await ctx.prisma.event.findMany({
        include: {
          tickets: {
            select: {
              price: true,
              remaining: true,
            },
          },
          userFavouriteEvents: {},
          orders: {
            select: {
              email: true,
            },
          },
        },
      });

      // compare date
      if (input.Date !== "none") {
        const date = new Date();
        if (input.Date === "Today") {
          events = events.filter((event) => {
            return (
              event.startTime.getDate() === date.getDate() &&
              event.startTime.getMonth() === date.getMonth() &&
              event.startTime.getFullYear() === date.getFullYear()
            );
          });
        } else if (input.Date === "Tomorrow") {
          date.setDate(date.getDate() + 1);
          events = events.filter((event) => {
            return (
              event.startTime.getDate() === date.getDate() &&
              event.startTime.getMonth() === date.getMonth() &&
              event.startTime.getFullYear() === date.getFullYear()
            );
          });
        } else if (input.Date === "This weekend") {
          events = events.filter((event) => {
            return (
              event.startTime.getDate() > date.getDate() &&
              event.startTime.getDate() - date.getDate() < 7 &&
              (event.startTime.getDay() === 0 || event.startTime.getDay() === 6)
            );
          });
        }
      }

      if (input.Category !== "none") {
        events = events.filter((event) => {
          return event.category === input.Category;
        });
      }

      if (input.Type !== "none") {
        events = events.filter((event) => {
          return event.type === input.Type;
        });
      }

      if (input.isOnline) {
        events = events.filter((event) => {
          return event.isOnline;
        });
      }

      if (input.onlyEventsFollowed) {
        const temp = [];
        for (const event of events) {
          let checkFavourite = false;
          const facouriteList = event ? event.userFavouriteEvents : [];
          for (const user of facouriteList) {
            if (user.userId === input.userKey) {
              checkFavourite = true;
            }
          }

          if (checkFavourite) {
            temp.push(event);
          }
        }

        if (temp.length) {
          events = temp;
        } else {
          events = [];
        }
      }

      type eventDataType = (typeof events)[0];

      function compareVenue(a: eventDataType, b: eventDataType) {
        return a.venue.localeCompare(b.venue);
      }

      function compareDate(a: eventDataType, b: eventDataType) {
        const firstSeconds = a.startTime.getTime();
        const secondSeconds = b.startTime.getTime();
        return firstSeconds - secondSeconds;
      }

      if (input.sortKey !== "0") {
        // sort by Date
        if (input.sortKey === "1") {
          events = events.sort(compareDate);
        }
        // sort by location
        else if (input.sortKey === "2") {
          events = events.sort(compareVenue);
        }
      }

      if (input.sortKey !== "0") {
        if (input.sortDirection !== "asc") {
          events = events.reverse();
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newEvents = events.map(({ userFavouriteEvents, ...rest }) => rest);
      return newEvents;
    }),
  getEventDetail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input,
        },
        include: {
          tickets: {
            select: {
              id: true,
              ticketName: true,
              ticketDescription: true,
              price: true,
              capacity: true,
              remaining: true,
            },
          },
          user: {},
          orders: {
            select: {
              email: true,
            },
          },
        },
      });
      return event;
    }),
  editEvent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        type: z.string(),
        category: z.string(),
        cover_image: z.string(),
        images: z.string().array(),
        venue: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        eventStatus: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          type: input.type,
          category: input.category,
          venue: input.venue,
          startTime: input.startTime,
          endTime: input.endTime,
          eventStatus: input.eventStatus,
          cover_image: input.cover_image,
          images: [...input.images],
        },
      });

      return event;
    }),
  publishEvent: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.update({
        where: { id: input },
        data: { isDraft: false }, // assuming 1 means published
      });
      // console.log('event-=-=-=-=-',event);
      return event;
    }),

  deleteEvent: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.deleteMany({
        where: {
          id: input,
        },
      });
      // console.log('event-=-=-=-=-',event);
      return event;
    }),
});
