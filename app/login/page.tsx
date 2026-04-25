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
      <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-800 text-white p-6">

      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl py-16 px-10 flex flex-col items-center text-center space-y-8">

        <img
          src="/welcome.gif"
          alt="penguin"
          className="w-36"
        />

        <h1 className="text-4xl font-bold">
          Witamy w systemie
        </h1>

        <p className="text-gray-400 text-base">
          Zaloguj się przez GitHub, aby uzyskać dostęp do panelu
        </p>

        <button
          onClick={() => signIn("github")}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition cursor-pointer font-medium"
        >
          <img src="/gh.png" alt="GitHub" className="w-5 h-5" />
          Zaloguj się z GitHub
        </button>

      </div>

    </main>
  )
}