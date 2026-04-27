"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Ticket } from "@/types/ticket"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import UserCard from "@/components/dashboard/UserCard"
import TicketsTable from "@/components/dashboard/TicketsTable"
import TicketModal from "@/components/dashboard/TicketModal"
import CreateTicketModal from "@/components/dashboard/CreateTicketModal"
import Tabs from "@/components/dashboard/Tabs"
import UsersTable from "@/components/dashboard/UsersTable"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState({ title: "", description: "" })

  const [tab, setTab] = useState<
    "all" | "new" | "accepted" | "closed" | "users"
  >("all")

  const [onlyMine, setOnlyMine] = useState(false)

  const role = (session?.user as any)?.role
  const isHelpdesk = role === "helpdesk"
  const isAdmin = role === "admin"

  async function loadTickets() {
    const res = await fetch("/api/tickets")
    const data = await res.json()
    setTickets(Array.isArray(data) ? data : [])
  }

  async function loadUsers() {
    const res = await fetch("/api/users")
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.replace("/login")

    loadTickets()
    if (isAdmin) loadUsers()
  }, [session, status])

  async function createTicket() {
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        created_by: session?.user?.email
      })
    })

    setIsCreateOpen(false)
    setForm({ title: "", description: "" })
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

  const userEmail = session?.user?.email

  const filteredTickets = tickets
    .filter((t) => {
      if (isAdmin || isHelpdesk) {
        if (tab === "new") return !t.assigned_to && t.status !== "closed"
        if (tab === "accepted") return !!t.assigned_to && t.status !== "closed"
        if (tab === "closed") return t.status === "closed"
        return true
      }

      return t.created_by === userEmail
    })
    .filter((t) => {
      if (!onlyMine) return true
      return t.assigned_to === userEmail || t.created_by === userEmail
    })

  if (status === "loading") return <div>Loading...</div>
  if (!session?.user) return null

  return (
    <main className="min-h-screen bg-zinc-800 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <DashboardHeader
          onCreate={() => {
            setForm({ title: "", description: "" })
            setIsCreateOpen(true)
          }}
        />

        <UserCard user={session.user} role={role} />

        {(isHelpdesk || isAdmin) && (
          <div className="flex items-center justify-between gap-3 flex-wrap">

            <Tabs role={role} tab={tab} setTab={setTab} />

            <button
              onClick={() => setOnlyMine((prev) => !prev)}
              className={`px-3 py-1 rounded border transition ${
                onlyMine
                  ? "bg-indigo-600 border-indigo-400 text-white"
                  : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Tylko moje
            </button>

          </div>
        )}

        {isAdmin && tab === "users" ? (
          <UsersTable users={users} onReload={loadUsers} />
        ) : (
          <TicketsTable
            tickets={filteredTickets}
            isHelpdesk={isHelpdesk || isAdmin}
            session={session}
            onSelect={setSelectedTicket}
            onUpdate={updateTicket}
          />
        )}

      </div>

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {isCreateOpen && (
        <CreateTicketModal
          form={form}
          setForm={setForm}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={createTicket}
        />
      )}
    </main>
  )
}