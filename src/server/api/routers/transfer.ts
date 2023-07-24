import { TRPCError } from "@trpc/server"
import axios from "axios"
import { z } from "zod"
import { env } from "~/env.mjs"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { sendMatic } from "~/utils/web3"

export const transferRouter = createTRPCRouter({
  sendMatic: publicProcedure
    .input(
      z.object({
        recipientAddress: z.string()
      })
    )
    .query(async ({ input }) => {
      return await sendMatic({ recipientAddress: input.recipientAddress })
    }),

  checkDiscord: publicProcedure.query(async () => {
    try {
      const res = await axios.get(
        "https://discord.com/api/v10/users/@me/guilds",
        {
          params: {
            limit: 10
          },
          headers: {
            Authorization: `Bot ${env.DISCORD_BEARER_TOKEN}`
          }
        }
      )
      console.log(res.data)
      return res.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response)
          throw new TRPCError({
            message: "Couldn't connect to Discord API",
            code: "INTERNAL_SERVER_ERROR"
          })

        console.log(err.response?.data)
      }
      throw new TRPCError({
        message: "An error occurred",
        code: "INTERNAL_SERVER_ERROR"
      })
    }
  })
})
