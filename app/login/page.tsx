"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white p-6">
      <div className="text-center space-y-6 max-w-md w-full mt-[-100px]">

        <img 
          src="/welcome.gif" 
          alt="penguin"
          className="w-32 mx-auto"
        />

        <h1 className="text-4xl font-bold">
          Witamy w systemie
        </h1>

        <p className="text-gray-400">
          Zaloguj się przez GitHub, aby uzyskać pomoc
        </p>

        <button
          onClick={() => signIn("github")}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition cursor-pointer"
        >
          <img
            src="/gh.png"
            alt="GitHub"
            className="w-5 h-5"
          />

          Zaloguj się z GitHub
        </button>

      </div>
    </main>
  )
}