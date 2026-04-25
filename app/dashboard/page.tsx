"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Ticket = {
  id: number
  title: string
  description: string
  status: string
  created_by: string
  assigned_to: string | null
  created_at: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [tab, setTab] = useState<"all" | "new" | "accepted" | "closed">("all")

  const [form, setForm] = useState({
    title: "",
    description: ""
  })

  async function loadTickets() {
    const res = await fetch("/api/tickets")
    const data = await res.json()
    setTickets(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.replace("/login")
    else loadTickets()
  }, [session, status])

  async function createTicket() {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        created_by: session?.user?.email
      })
    })

    const data = await res.json()
    if (!res.ok) return

    setForm({ title: "", description: "" })
    setIsCreateOpen(false)
    loadTickets()
  }

  async function updateTicket(id: number, action: string) {
    await fetch("/api/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        user_email: session?.user?.email,
        action
      })
    })

    setSelectedTicket(null)
    loadTickets()
  }

  const isHelpdesk = (session?.user as any)?.role === "helpdesk"

  const filteredTickets = tickets.filter((t) => {
    if (!isHelpdesk) return t.created_by === session?.user?.email

    if (tab === "new") return !t.assigned_to && t.status !== "closed"
    if (tab === "accepted") return !!t.assigned_to && t.status !== "closed"
    if (tab === "closed") return t.status === "closed"
    return true
  })

  if (status === "loading") return <div className="text-white p-10">Loading...</div>
  if (!session?.user) return null

  const canCloseHelpdesk = (t: Ticket) =>
    t.assigned_to === session.user.email && t.status !== "closed"

  const canCloseUser = (t: Ticket) =>
    t.created_by === session.user.email && t.status !== "closed"

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8 relative">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded cursor-pointer"
            >
              Utwórz ticket
            </button>

            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded cursor-pointer"
            >
              Wyloguj
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{session.user.name}</p>
            <p className="text-sm text-gray-400">{session.user.email}</p>

            {isHelpdesk && (
              <span className="text-xs text-cyan-400 font-semibold">
                Helpdesk
              </span>
            )}
          </div>

          <img
            src={session.user.image || "/avatar.png"}
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>

        {isHelpdesk && (
          <div className="flex gap-2 flex-wrap">
            {[
              ["all", "Wszystkie"],
              ["new", "Nowe"],
              ["accepted", "Zaakceptowane"],
              ["closed", "Zamknięte"]
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key as any)}
                className={`px-3 py-1 rounded cursor-pointer ${
                  tab === key ? "bg-indigo-600" : "bg-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="bg-gray-700 rounded-xl overflow-hidden">
          <table className="w-full table-fixed text-center">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3">Tytuł</th>
                <th className="p-3">Status</th>
                <th className="p-3">Akcje</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="border-t border-gray-600 hover:bg-gray-600 cursor-pointer"
                >
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3 space-x-2">
                    {isHelpdesk &&
                      !t.assigned_to &&
                      t.status !== "closed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateTicket(t.id, "take")
                          }}
                          className="px-2 py-1 bg-green-600 rounded cursor-pointer"
                        >
                          Przyjmij
                        </button>
                      )}

                    {isHelpdesk && canCloseHelpdesk(t) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          updateTicket(t.id, "force_close_helpdesk")
                        }}
                        className="px-2 py-1 bg-indigo-600 rounded cursor-pointer"
                      >
                        Zamknij
                      </button>
                    )}

                    {!isHelpdesk && canCloseUser(t) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          updateTicket(t.id, "close")
                        }}
                        className="px-2 py-1 bg-indigo-600 rounded cursor-pointer"
                      >
                        Zamknij
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">{selectedTicket.title}</h2>

            <p className="text-gray-300">{selectedTicket.description}</p>

            <div className="pt-6 space-y-1">
              <p className="text-sm text-gray-400">
                Status: {selectedTicket.status}
              </p>

              <p className="text-sm text-gray-400">
                Wystawił: {selectedTicket.created_by}
              </p>

              {selectedTicket.assigned_to ? (
                <p className="text-sm text-cyan-400">
                  Obsługuje: {selectedTicket.assigned_to}
                </p>
              ) : (
                selectedTicket.status !== "open" && (
                  <p className="text-sm text-gray-500">
                    Brak przypisanego helpdesku
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">Nowy ticket</h2>

            <input
              className="w-full p-2 bg-gray-700 rounded"
              placeholder="Tytuł"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              className="w-full h-32 p-2 bg-gray-700 rounded resize-none"
              placeholder="Opis"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded cursor-pointer"
              >
                Anuluj
              </button>

              <button
                onClick={createTicket}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded cursor-pointer"
              >
                Dodaj
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}