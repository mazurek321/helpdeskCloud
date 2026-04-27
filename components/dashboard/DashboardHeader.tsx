import { signOut } from "next-auth/react"

export default function DashboardHeader({ onCreate }: any) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="flex gap-3">
        <button onClick={onCreate} className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded">
          Utwórz ticket
        </button>

        <button onClick={() => signOut()} className="bg-red-600 hover:bg-red-700 p-2 rounded">
          Wyloguj
        </button>
      </div>
    </div>
  )
}