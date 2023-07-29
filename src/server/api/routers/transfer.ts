import { TRPCError } from "@trpc/server"
import axios from "axios"
import { parseEther } from "ethers"
import { z } from "zod"
import { env } from "~/env.mjs"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { wallet } from "~/utils/web3"

const sendBirthdayMessage = async () => {
  try {
    await axios.post(
      env.DISCORD_SERVER_WEBHOOK_URL,
      {
        content: "Happy Birthday! 🎉 Wishing you joy, laughter, and success in the year ahead. You're a shining star in my life, and I'm grateful for our friendship. Blow out the candles and make those wishes come true! 🎂🎈"
      },
      {
        headers: {
          Authorization: `Bot ${env.DISCORD_BEARER_TOKEN}`
        },
      })
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response)
        throw new TRPCError({
          message: "Couldn't connect to Discord API",
          code: "INTERNAL_SERVER_ERROR"
        })

      console.log(JSON.stringify(err.response?.data))
    }
    throw new TRPCError({
      message: "An error occurred",
      code: "INTERNAL_SERVER_ERROR"
    })
  }

}

export const transferRouter = createTRPCRouter({
  sendMatic: publicProcedure
    .input(
      z.object({
        recipientAddress: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("Initiating transaction")
      const { recipientAddress } = input

      const previousTransactions = await ctx.prisma.transaction.findMany()
      if (previousTransactions.length !== 0) {
        console.log("Found previous transactions, quitting...")
        throw new TRPCError({ message: "Funds have already been sent!", code: "BAD_REQUEST" })
      }

      const amount = env.POLYGON_MAINNET_GIFT_MATIC_AMOUNT
      const name = "mainnet"

      try {
        console.log(`[${name}] Sending ${amount} MATIC to ${recipientAddress}...`)

        await wallet.sendTransaction({
          to: recipientAddress,
          value: parseEther(String(amount))
        })

        console.log(`[${name}] Sent ${amount} MATIC to ${recipientAddress}.`)

        console.log(
          `[DB][${name}][${amount}][${recipientAddress}] Adding tx to db`
        )

        await ctx.prisma.transaction.create({
          data: {
            recipientAddress,
            amount
          }
        })

        console.log(
          `[DB][${name}][${amount}][${recipientAddress}] Added tx to db`
        )
        try {
          await sendBirthdayMessage()
        } catch (err) { }
        return { status: true, message: "Check your wallet 😉" }
      } catch (error) {
        console.log(error)
        return { status: false, message: "Failed to transfer funds!" }
      }
    }),

  checkDiscord: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session)
      throw new TRPCError({ message: "User not logged in!", code: "UNAUTHORIZED" })

    const account = await ctx.prisma.account.findFirst({
      where: {
        userId: ctx.session.user.id
      }
    })
    if (!account)
      throw new TRPCError({ message: "Session not found!", code: "UNAUTHORIZED" })

    try {
      const res = await axios.get<{
        user: {
          id: string
        }
      }[]>(
        `https://discord.com/api/v10/guilds/${env.DISCORD_SERVER_ID}/members`,
        {
          params: {
            limit: 100
          },
          headers: {
            Authorization: `Bot ${env.DISCORD_BEARER_TOKEN}`
          }
        })
      if (!res.data.map(member => member.user.id).includes(account.providerAccountId)) {
        return false
      }
      else {
        return true
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response)
          throw new TRPCError({
            message: "Couldn't connect to Discord API",
            code: "INTERNAL_SERVER_ERROR"
          })

        console.log(JSON.stringify(err.response?.data))
      }
      throw new TRPCError({
        message: "An error occurred",
        code: "INTERNAL_SERVER_ERROR"
      })
    }
  })
})
