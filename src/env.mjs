import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_BEARER_TOKEN: z.string(),
    DISCORD_SERVER_ID: z.string(),
    DISCORD_SERVER_WEBHOOK_URL: z.string(),
    TWITTER_CLIENT_ID: z.string(),
    TWITTER_CLIENT_SECRET: z.string(),
    TWITTER_BEARER_TOKEN: z.string(),
    POLYGON_MAINNET_RPC_URL: z.string().url(),
    POLYGON_TRANSACTION_THRESHOLD: z.coerce.number(),
    POLYGON_TESTNET_RPC_URL: z.string().url(),
    POLYGON_WALLET_PRIVATE_KEY: z.string(),
    POLYGON_MAINNET_GIFT_MATIC_AMOUNT: z.coerce.number()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_DISCORD_SERVER_URL: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
    DISCORD_BEARER_TOKEN: process.env.DISCORD_BEARER_TOKEN,
    DISCORD_SERVER_WEBHOOK_URL: process.env.DISCORD_SERVER_WEBHOOK_URL,
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
    NEXT_PUBLIC_DISCORD_SERVER_URL: process.env.NEXT_PUBLIC_DISCORD_SERVER_URL,
    POLYGON_MAINNET_RPC_URL: process.env.POLYGON_MAINNET_RPC_URL,
    POLYGON_TESTNET_RPC_URL: process.env.POLYGON_TESTNET_RPC_URL,
    POLYGON_WALLET_PRIVATE_KEY: process.env.POLYGON_WALLET_PRIVATE_KEY,
    POLYGON_MAINNET_GIFT_MATIC_AMOUNT:
      process.env.POLYGON_MAINNET_GIFT_MATIC_AMOUNT,
    POLYGON_TRANSACTION_THRESHOLD: process.env.POLYGON_TRANSACTION_THRESHOLD
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION
})
