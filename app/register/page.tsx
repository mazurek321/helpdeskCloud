"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleRegister() {

    setError("")
    setLoading(true)

    try {

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Wystąpił błąd")
        return
      }

      router.push("/login")

    } catch (err) {

      setError("Wystąpił błąd serwera")

    } finally {

      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-700 via-zinc-500 to-zinc-700 text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-zinc-950/80 backdrop-blur border border-zinc-800 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">

        <div className="w-full flex items-center justify-center pt-10">
          <img
            src="/welcome.gif"
            alt="welcome"
            className="w-44 drop-shadow-2xl"
          />
        </div>

        <div className="px-10 py-10 flex flex-col items-center text-center">

          <h1 className="text-4xl font-bold tracking-tight">
            Utwórz konto ✨
          </h1>

          <p className="text-zinc-400 mt-3 text-sm max-w-md">
            Załóż konto i uzyskaj dostęp do panelu systemu.
          </p>

          {error && (
            <div className="w-full mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="w-full mt-8 flex flex-col gap-4">

            <input
              type="text"
              placeholder="Nazwa użytkownika"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              className="
                w-full
                px-5
                py-4
                rounded-2xl
                bg-zinc-800/80
                border
                border-zinc-700
                outline-none
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/20
                transition
              "
            />

            <input
              type="email"
              placeholder="Adres email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              className="
                w-full
                px-5
                py-4
                rounded-2xl
                bg-zinc-800/80
                border
                border-zinc-700
                outline-none
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/20
                transition
              "
            />

            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              className="
                w-full
                px-5
                py-4
                rounded-2xl
                bg-zinc-800/80
                border
                border-zinc-700
                outline-none
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/20
                transition
              "
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="
                w-full
                py-4
                rounded-2xl
                bg-blue-600
                hover:bg-blue-500
                disabled:opacity-50
                active:scale-[0.99]
                transition
                font-semibold
                shadow-lg
                shadow-blue-600/20
                cursor-pointer
              "
            >
              {loading ? "Tworzenie konta..." : "Zarejestruj się"}
            </button>

          </div>

          <p className="mt-8 text-zinc-400 text-sm">
            Masz już konto?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Zaloguj się
            </Link>
          </p>

        </div>

      </div>

    </main>
  )
}