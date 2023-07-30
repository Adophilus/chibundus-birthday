import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { api } from "~/utils/api"
import DiscordIcon from "~/utils/icons/discord"
import { Check, Lock, LogOut, XOctagon } from "lucide-react"
import type { FunctionComponent } from "react"
import { useState } from "react"
import { useEffect, useRef } from "react"
import MaticIcon from "~/utils/icons/matic"
import { Disclosure, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { env } from "~/env.mjs"
import useAppStore from "~/utils/store"
import Head from "next/head"
import LoadingSpinner from "~/utils/icons/loading-spinner"

const Navbar: FunctionComponent = () => {
  const { data: sessionData } = useSession()
  const store = useAppStore((store) => store)

  if (sessionData?.user) {
    return (
      <div className="border-b-2 border-white flex justify-end">
        <Button
          variant="ghost"
          className="text-white rounded-none"
          onClick={async () => {
            store.updateHasJoinedDiscord(false)
            store.updateHasSentFunds(false)
            await signOut()
          }}
        >
          <LogOut className="w-6 h-6 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

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
          if (!sessionData?.user) {
            signIn("discord").catch((err) => console.warn("[signin]", err))
          }
        }}
      >
        <span className="flex gap-x-2 items-center">
          <span className="flex bg-[#7289da] w-14 h-14 items-center justify-center">
            <DiscordIcon className="w-12 h-12 fill-white stroke-white stroke-[0.5]" />
          </span>
          <span className="text-white font-semibold text-sm sm:text-lg">
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

const DiscordServerTaskTab: FunctionComponent = () => {
  const { data: sessionData } = useSession()
  const isLoggedIn = sessionData?.user

  const store = useAppStore((store) => store)

  const { data } = api.transfer.checkDiscord.useQuery()
  const updateHasJoinedDiscord = () => {
    if (data) store.updateHasJoinedDiscord(true)
  }
  useEffect(updateHasJoinedDiscord, [data, store])

  return (
    <div className="flex w-full border-y-white border-y">
      <button
        type="button"
        className="flex w-full justify-between items-center"
        onClick={() => {
          if (!store.hasJoinedDiscord) {
            window.open(env.NEXT_PUBLIC_DISCORD_SERVER_URL)
          }
        }}
      >
        <span className="flex gap-x-2 items-center">
          <span className="flex bg-[#7289da] w-14 h-14 items-center justify-center">
            <DiscordIcon className="w-12 h-12 fill-white stroke-white stroke-[0.5]" />
          </span>
          <span className="text-white font-semibold text-sm sm:text-lg">
            Join our Discord server
          </span>
        </span>
        <span className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400">
          {isLoggedIn ? (
            store.hasJoinedDiscord ? (
              <Check className="w-6 h-6 stroke-[3]" />
            ) : (
              "+10"
            )
          ) : (
            <Lock className="w-6 h-6 stroke-[3]" />
          )}
        </span>
      </button>
    </div>
  )
}

const PolygonWalletAddressTaskTab: FunctionComponent = () => {
  const { data: sessionData } = useSession()
  const isLoggedIn = sessionData?.user
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canInput, setCanInput] = useState(true)

  const walletAddress = useRef<HTMLInputElement>(null)
  const store = useAppStore((store) => store)

  const {
    data: hasSentFundsData,
    isLoading: hasSentFundsIsLoading,
    error: hasSentFundsError
  } = api.transfer.checkHasSentFunds.useQuery()
  useEffect(() => {
    if (!hasSentFundsIsLoading && !hasSentFundsError) {
      if (hasSentFundsData) {
        setCanInput(false)
      } else {
        setCanInput(true)
      }
    }
  }, [hasSentFundsData, hasSentFundsIsLoading, hasSentFundsError])

  const { mutate: sendMaticMutation } = api.transfer.sendMatic.useMutation()
  const sendMatic = (recipientAddress: string) => {
    setIsSubmitting(true)
    sendMaticMutation(
      { recipientAddress },
      {
        onError(err) {
          console.warn(err)
          toast.error(err.message)
          setIsSubmitting(false)
        },
        onSuccess(res) {
          console.log(res)
          if (res.status) {
            store.updateHasSentFunds(true)
            toast.success(res.message)
            setIsSubmitting(false)
          } else {
            toast.error(res.message)
            setIsSubmitting(false)
          }
        }
      }
    )
  }

  if (!canInput) return null

  if (store.hasSentFunds) {
    return (
      <div className="flex w-full justify-between items-center border-y border-y-white">
        <span className="flex gap-x-2 items-center">
          <span className="flex bg-[#6F41D8] items-center justify-center w-14 h-14 self-stretch">
            <MaticIcon className="w-8 h-8 fill-white stroke-white stroke-[0.5]" />
          </span>
          <span className="text-white font-semibold text-sm sm:text-lg">
            Check your wallet 🌠
          </span>
        </span>
        <span className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400">
          <Check className="w-6 h-6 stroke-[3]" />
        </span>
      </div>
    )
  }

  if (!isLoggedIn || !store.hasJoinedDiscord) return null

  return (
    <div className="flex flex-col w-full border-y-white border-y">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full">
              <div className="flex w-full justify-between items-center">
                <span className="flex gap-x-2 items-center">
                  <span className="flex bg-[#6F41D8] items-center justify-center w-14 h-14 self-stretch">
                    <MaticIcon className="w-8 h-8 fill-white stroke-white stroke-[0.5]" />
                  </span>
                  <span className="text-white font-semibold text-sm sm:text-lg">
                    Enter in polygon wallet address
                  </span>
                </span>
                <span className="flex w-16 text-white font-semibold text-lg self-stretch items-center justify-center bg-teal-400">
                  {isLoggedIn ? (
                    store.hasSentFunds ? (
                      <Check className="w-6 h-6 stroke-[3]" />
                    ) : (
                      "+10"
                    )
                  ) : (
                    <Lock className="w-6 h-6 stroke-[3]" />
                  )}
                </span>
              </div>
            </Disclosure.Button>
            {!store.hasSentFunds ? (
              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel>
                  <div className="p-4 border-t-2 border-white">
                    <form
                      className="relative flex"
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (walletAddress.current) {
                          sendMatic(walletAddress.current.value)
                        }
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Polygon wallet address"
                        ref={walletAddress}
                        disabled={isSubmitting}
                        className="grow rounded-l-md px-2 py-1 text-white font-robotoMono bg-transparent border-2 border-white border-r-0"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex rounded-r-md text-white text-lg items-center justify-center px-2 ${isSubmitting ? "" : "hover:bg-white hover:text-black"
                          } transition duration-300 ease-in-out border-2 border-white border-l-0`}
                      >
                        {isSubmitting ? (
                          <LoadingSpinner size="small" className="fill-white" />
                        ) : (
                          <Check className="w-6 h-6 stroke-[3]" />
                        )}
                      </button>
                    </form>
                  </div>
                </Disclosure.Panel>
              </Transition>
            ) : null}
          </>
        )}
      </Disclosure>
    </div>
  )
}

const TasksTabs: FunctionComponent = () => {
  return (
    <>
      <DiscordTaskTab />
      <DiscordServerTaskTab />
      <PolygonWalletAddressTaskTab />
    </>
  )
}

const Heading: FunctionComponent = () => {
  const { data: sessionData } = useSession()
  const store = useAppStore((store) => store)

  if (sessionData?.user) {
    return (
      <header className="flex justify-center">
        <h1 className="text-3xl text-white font-press-start whitespace-nowrap">
          NovaRetro
        </h1>
      </header>
    )
  }

  return (
    <>
      <header className="flex justify-center">
        <h1 className="text-3xl text-white font-press-start whitespace-nowrap">
          NovaRetro
        </h1>
      </header>
      <header className="flex flex-col items-center gap-2 mt-10">
        <div>
          <XOctagon className="w-24 h-24 text-white" />
        </div>
        <h2 className="font-roboto text-white text-4xl">
          Verification Required!
        </h2>
      </header>
    </>
  )
}

const IntroText: FunctionComponent = () => {
  const { data: sessionData } = useSession()
  const isLoggedIn = sessionData?.user

  if (!isLoggedIn) {
    return (
      <div className="px-4">
        <p>
          <Button
            variant="ghost"
            className="text-white border-white border-2 w-full"
            onClick={() => {
              signIn("discord").catch((err) => console.warn("[signin]", err))
            }}
          >
            Please Sign In First
          </Button>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="px-4 text-white text-center sm:text-lg">
        Welcome, crypto enthusiasts!
      </p>
      <p className="px-4 text-white text-center sm:text-lg">
        Participate in our exciting airdrop tasks to earn free tokens! Follow
        the simple steps below to claim your rewards:
      </p>
    </div>
  )
}

export default function Home() {
  const { data: sessionData } = useSession()
  const isLoggedIn = sessionData?.user

  return (
    <>
      <Head>
        <title>NovaRetro</title>
        <meta name="description" content="Chibundu's birthday" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full mx-auto overflow-hidden sm:w-10/12 lg:w-1/2 sm:border-x-white sm:border-x-2">
        <section>
          <Navbar />
        </section>
        <section className="pt-10 pb-3">
          <Heading />
        </section>
        <section className="py-4">
          <IntroText />
        </section>
        {isLoggedIn ? (
          <section>
            <TasksTabs />
          </section>
        ) : null}
      </main>
    </>
  )
}
