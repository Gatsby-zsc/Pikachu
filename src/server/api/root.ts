import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { eventRouter } from "@/server/api/routers/event";
import { sendEventEmailRouter } from "@/server/api/routers/sendEmail-event-request";
import { ticketRouter } from "@/server/api/routers/ticket";
import { favouriteRouterRouter } from "@/server/api/routers/favourite-events";
import { userRouter } from "@/server/api/routers/user";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  eventRouter: eventRouter,
  sendEventEmailRouter: sendEventEmailRouter,
  ticketRouter: ticketRouter,
  favouriteRouter: favouriteRouterRouter,
  userRouter: userRouter,
  orderRouter: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
