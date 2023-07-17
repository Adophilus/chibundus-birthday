import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Button } from "@/components/ui"

export default function Home() {
  return (
    <main className="h-full mx-auto sm:w-10/12 lg:w-1/2 sm:border-x-white sm:border-x-2">
      <section>
        <header className="flex justify-center">
          <h1 className="text-xl text-white font-press-start-2p">Chibundu's Birthday</h1>
        </header>
      </section>
      <section>
        <p>
          Happy birthday
        </p>
      </section>
      <section>
        <TasksTabs />
      </section>
    </main>
  );
}

function TasksTabs() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  if (!sessionData?.user)
    return (
      <>
        <div className="border-y-1 border-y-white">
          <p>
            <Button>
              Sign in
            </Button>
          </p>
        </div>
      </>
    )

  return (
    <>
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        type="button"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </>
  );
}
