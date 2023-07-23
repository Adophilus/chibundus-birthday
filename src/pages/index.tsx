import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { api } from "~/utils/api"
import DiscordIcon from "~/utils/icons/discord"
import { Check, TwitterIcon, XOctagon } from "lucide-react"
import { FunctionComponent, ReactNode, forwardRef } from "react"
import MaticIcon from "~/utils/icons/matic"
import * as Accordion from '@radix-ui/react-accordion';

const Navbar: FunctionComponent = () => {
  const { data: sessionData } = useSession()
  console.log(sessionData)

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
          <span className="flex bg-[#7289da] w-14 h-14 items-center justify-center">
            <DiscordIcon className="w-12 h-12 fill-white stroke-white stroke-[0.5]" />
          </span>
          <span className="text-white font-semibold text-lg">
            Verify Discord
          </span>
        </span>
        <span className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400">
          {sessionData?.user ? <Check className="w-6 h-6 stroke-[3]" /> : "+10"}
        </span>
      </button>
    </div>
  )
}

const DiscordChannelTaskTab: FunctionComponent = () => {
  const { data: sessionData } = useSession()

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
          <span className="flex bg-[#7289da] w-14 h-14 items-center justify-center">
            <DiscordIcon className="w-12 h-12 fill-white stroke-white stroke-[0.5]" />
          </span>
          <span className="text-white font-semibold text-lg">
            Join our Discord channel
          </span>
        </span>
        <button
          type="button"
          onClick={() => window.open("https://discord.gg/qqRHSzD7")}
          className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400"
        >
          {sessionData?.user ? <Check className="w-6 h-6 stroke-[3]" /> : "+10"}
        </button>
      </button>
    </div>
  )
}

const AccordionTrigger = forwardRef<ReactNode, {children: ReactNode, className?: string }>(({ children, className }, forwardedRef) => (
  <Accordion.Header>
    <Accordion.Trigger
      ref={forwardedRef}
      className={className}
    >
      {children}
    </Accordion.Trigger>
  </Accordion.Header>
))

const PolygonWalletAddressTaskTab: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  return (
    <div className="flex flex-col w-full border-y-white border-y">
      <Accordion.Root>
        <Accordion.Item value="item-1">
          <AccordionTrigger className="flex w-full">
            <div
              className="flex w-full justify-between items-center" >
              <span className="flex gap-x-2 items-center">
                <span className="flex bg-[#6F41D8] items-center justify-center w-14 h-14">
                  <MaticIcon className="w-8 h-8 fill-white stroke-white" />
                </span>
                <span className="text-white font-semibold text-lg">
                  Enter in polygon wallet address
                </span>
              </span>
              <span
                className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400"
              >
                +10
              </span>
            </div>
          </AccordionTrigger>
          <Accordion.Content>
            <div className="p-4 border-t-2 border-white">
              <form className="relative flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Polygon wallet address"
                  className="grow rounded-l-md px-2 py-1 text-white font-robotoMono bg-transparent border-2 border-white border-r-0"
                />
                <button
                  type="button"
                  className="flex rounded-r-md text-white text-lg items-center justify-center px-2 hover:bg-white hover:text-black transition duration-300 ease-in-out border-2 border-white border-l-0"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                </button>
              </form>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

const TasksTabs: FunctionComponent = () => {
  const { data: sessionData } = useSession()

  // if (!sessionData?.user) return null

  return (
    <>
      <DiscordTaskTab />
      <DiscordChannelTaskTab />
      <PolygonWalletAddressTaskTab />
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

  // if (sessionData?.user)
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
  // const req = api.transfer.hello.useQuery()

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
