import { Client } from "twitter-api-sdk";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const transferRouter = createTRPCRouter({
  hello: publicProcedure
    .query(async ({ ctx }) => {
      try {
        // console.log(ctx.session);
        return { message: "success" };
      }
      catch (err) {
        console.log(err)
        return { error: "something bad happened" }
      }
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
