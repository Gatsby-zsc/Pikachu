import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { createEventRouter } from "@/server/api/routers/create-event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  createEvent: createEventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
