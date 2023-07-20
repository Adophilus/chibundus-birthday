import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { api } from "~/utils/api"
import DiscordIcon from "~/utils/icons/discord"
import { Check, TwitterIcon, XOctagon } from "lucide-react"
import type { FunctionComponent } from "react"

const Navbar: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  if (sessionData?.user)
    return (
      <div className="border-b-2 border-white flex justify-end">
        <Button
          variant="ghost"
          className="text-white rounded-none"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    )

  return null
}

const DiscordTaskTab: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  if (!sessionData?.user) return null

  return (
    <div className="flex w-full border-y-white border-y">
      <button
        type="button"
        className="flex w-full justify-between items-center"
        onClick={() => {
          if (!sessionData?.user) signIn("discord")
        }}
      >
        <span className="flex gap-x-2 items-center">
          <span className="flex bg-[#7289da]">
            <DiscordIcon className="w-12 h-12 fill-white stroke-white stroke-[0.5]" />
          </span>
          <span className="text-white font-semibold text-lg">
            Verify on Discord
          </span>
        </span>
        <span className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400">
          {sessionData?.user ? <Check className="w-6 h-6 stroke-[3]" /> : "+10"}
        </span>
      </button>
    </div>
  )
}

const TwitterTaskTab: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  if (!sessionData?.user) return null

  return (
    <div className="flex flex-col w-full border-y-white border-y">
      <div>
        <button
          type="button"
          className="flex w-full justify-between items-center"
        >
          <span className="flex gap-x-2 items-center">
            <span className="flex bg-[#1DA1F2] p-2">
              <TwitterIcon className="w-8 h-8 fill-white stroke-white stroke-[0.5]" />
            </span>
            <span className="text-white font-semibold text-lg">
              Follow @adophilus on Twitter
            </span>
          </span>
          <button
            type="button"
            onClick={() => window.open("https://twitter.com/adophilus")}
            className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400"
          >
            +10
          </button>
        </button>
      </div>
      <div className="p-4 border-t-2 border-white">
        <form className="relative flex" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="twitter @username"
            className="grow rounded-l-md px-2 py-1 text-white font-monspace bg-transparent border-2 border-white border-r-0"
          />
          <button
            type="button"
            className="flex rounded-r-md text-white text-lg items-center justify-center px-2 hover:bg-white hover:text-black transition duration-300 ease-in-out border-2 border-white border-l-0"
          >
            <Check className="w-6 h-6 stroke-[3]" />
          </button>
        </form>
      </div>
    </div>
  )
}

const TasksTabs: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  if (!sessionData?.user) return null

  return (
    <>
      <DiscordTaskTab />
      <TwitterTaskTab />
    </>
  )
}

const Heading: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  if (sessionData?.user)
    return (
      <header className="flex justify-center">
        <h1 className="text-3xl text-white font-press-start whitespace-nowrap">
          Happy Birthday!!!
        </h1>
      </header>
    )

  return (
    <header className="flex flex-col items-center gap-2">
      <div>
        <XOctagon className="w-24 h-24 text-white" />
      </div>
      <h2 className="font-roboto text-white text-4xl">HALT!</h2>
    </header>
  )
}

const IntroText: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  if (sessionData?.user)
    return (
      <p className="px-4 text-white text-center text-lg">
        Complete the tasks to collect your reward
      </p>
    )

  return (
    <div className="px-4">
      <p>
        <Button
          variant="ghost"
          className="text-white border-white border-2 w-full"
          onClick={() => signIn("discord")}
        >
          Please Sign In First
        </Button>
      </p>
    </div>
  )
}

export default function Home() {
  return (
    <main className="h-full mx-auto overflow-hidden sm:w-10/12 lg:w-1/2 sm:border-x-white sm:border-x-2">
      <section>
        <Navbar />
      </section>
      <section className="py-10">
        <Heading />
      </section>
      <section className="py-4">
        <IntroText />
      </section>
      <section>
        <TasksTabs />
      </section>
    </main>
  )
}
