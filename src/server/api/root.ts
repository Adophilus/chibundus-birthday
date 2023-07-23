import { transferRouter } from "~/server/api/routers/transfer";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transfer: transferRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
