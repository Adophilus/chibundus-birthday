import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import DiscordIcon from "~/utils/icons/discord";
import { Check, TwitterIcon } from "lucide-react";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <main className="h-full mx-auto sm:w-10/12 lg:w-1/2 sm:border-x-white sm:border-x-2">
      <section className="py-10">
        <header className="flex justify-center">
          <h1 className="text-4xl text-white font-press-start">
            Happy Birthday!!!
          </h1>
        </header>
      </section>
      <section className="py-4">
        <p className="px-4 text-white text-lg">
          Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
        </p>
      </section>
      {sessionData?.user ? (
        <section className="py-4 flex justify-center">
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => signOut()}>
            Sign Out
          </Button>
        </section>
      ) : null}
      <section>
        <TasksTabs />
      </section>
    </main>
  );
}

function TasksTabs() {
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="flex w-full border-y-white border-y">
        <button
          type="button"
          className="flex w-full justify-between items-center"
          onClick={() => {
            if (!sessionData?.user)
              signIn('discord')
          }}>
          <span className="flex gap-x-2 items-center">
            <span className="flex bg-[#7289da]">
              <DiscordIcon className="w-12 h-12 fill-white stroke-white stroke-[0.5]" />
            </span>
            <span className="text-white font-semibold text-lg">Verify on Discord</span>
          </span>
          <span className="flex text-white font-semibold text-lg self-stretch items-center px-4 bg-teal-400">
            {sessionData?.user ? (
              <Check className="w-6 h-6 stroke-[3]" />
            ) : (
              "+10"
            )}
          </span>
        </button>
      </div>
      <div className="flex w-full border-y-white border-y">
        <button
          type="button"
          className="flex w-full justify-between items-center"
          onClick={() => {
            if (!sessionData?.user)
              signIn('twitter')
          }}>
          <span className="flex gap-x-2 items-center">
            <span className="flex bg-[#1DA1F2] p-2">
              <TwitterIcon className="w-8 h-8 fill-white stroke-white stroke-[0.5]" />
            </span>
            <span className="text-white font-semibold text-lg">Verify on Twitter</span>
          </span>
          <span className="flex text-white font-semibold text-lg self-stretch items-center px-4 bg-teal-400">
            {sessionData?.user ? (
              <Check className="w-6 h-6 stroke-[3]" />
            ) : (
              "+10"
            )}
          </span>
        </button>
      </div>
    </>
  )
}
