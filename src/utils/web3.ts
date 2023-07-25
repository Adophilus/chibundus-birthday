"use server"

import { ethers } from "ethers"
import { env } from "~/env.mjs"

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

export { wallet }
