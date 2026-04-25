"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (session) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [session, status, router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 text-white">
      <p className="text-gray-400">Loading...</p>
    </main>
  )
}














// "use client"

// import { signIn, signOut, useSession } from "next-auth/react"

// export default function HomePage() {
//   const { data: session, status } = useSession()

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
//       <div className="w-full max-w-xl text-center space-y-6">

//         {/* HERO */}
//         <h1 className="text-4xl font-bold">
//           🚀 My SaaS App
//         </h1>

//         <p className="text-gray-400">
//           Next.js + Supabase + Prisma + GitHub Login
//         </p>

//         {/* STATUS */}
//         {status === "loading" && (
//           <p className="text-gray-500">Loading...</p>
//         )}

//         {/* LOGGED IN */}
//         {session ? (
//           <div className="space-y-4">
//             <p className="text-green-400">
//               Zalogowany jako: {session.user?.email}
//             </p>

//             <button
//               onClick={() => signOut()}
//               className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
//             >
//               Wyloguj
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <p className="text-gray-500">
//               Zaloguj się aby kontynuować
//             </p>

//             <button
//               onClick={() => signIn("github")}
//               className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
//             >
//               🔐 Login GitHub
//             </button>
//           </div>
//         )}

//         {/* FOOTER */}
//         <p className="text-xs text-gray-600 pt-10">
//           Built with Next.js + Vercel
//         </p>
//       </div>
//     </main>
//   )
// }