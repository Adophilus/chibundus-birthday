"use server"

import { ethers, parseEther } from "ethers"
import { env } from "~/env.mjs"
import { prisma } from "~/server/db"

const transactions = {
  mainnet: {
    rpcUrl: env.POLYGON_MAINNET_RPC_URL,
    privateKey: env.POLYGON_WALLET_PRIVATE_KEY,
    amount: 3
  },
  testnet: {
    name: "testnet",
    rpcUrl: env.POLYGON_TESTNET_RPC_URL,
    privateKey: env.POLYGON_WALLET_PRIVATE_KEY,
    amount: 1
  }
}

const provider = new ethers.JsonRpcProvider(transactions.mainnet.rpcUrl)
const wallet = new ethers.Wallet(transactions.mainnet.privateKey, provider)

export async function sendMatic({
  recipientAddress
}: { recipientAddress: string }) {
  console.log("Initiating transaction")

  const previousTransactions = await prisma.transaction.findMany()
  if (previousTransactions.length !== 0) {
    console.log("Found previous transactions, quitting...")
    return { status: false, message: "Transfer already in progress" }
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

    await prisma.transaction.create({
      data: {
        recipientAddress,
        amount
      }
    })

    console.log(
      `[DB][${name}][${amount}][${recipientAddress}] Added tx to db`
    )
    return { status: true, message: "Check your wallet 😉" }
  } catch (error) {
    console.log(error)
    return { status: false, message: "Failed to transfer funds!" }
  }
}
