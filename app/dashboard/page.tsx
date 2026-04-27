"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Ticket } from "@/types/ticket"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import UserCard from "@/components/dashboard/UserCard"
import TicketsTable from "@/components/dashboard/TicketsTable"
import TicketModal from "@/components/dashboard/TicketModal"
import CreateTicketModal from "@/components/dashboard/CreateTicketModal"
import Tabs from "@/components/dashboard/Tabs"

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

  const isHelpdesk = (session?.user as any)?.role === "helpdesk"

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

  const filteredTickets = tickets.filter((t) => {
    if (!isHelpdesk) return t.created_by === session?.user?.email

    if (tab === "new") return !t.assigned_to && t.status !== "closed"
    if (tab === "accepted") return !!t.assigned_to && t.status !== "closed"
    if (tab === "closed") return t.status === "closed"
    return true
  })

  if (status === "loading") return <div>Loading...</div>
  if (!session?.user) return null

  return (
    <main className="min-h-screen bg-zinc-800 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <DashboardHeader onCreate={() => setIsCreateOpen(true)} />

        <UserCard user={session.user} isHelpdesk={isHelpdesk} />

        {isHelpdesk && <Tabs tab={tab} setTab={setTab} />}

        <TicketsTable
          tickets={filteredTickets}
          isHelpdesk={isHelpdesk}
          session={session}
          onSelect={setSelectedTicket}
          onUpdate={updateTicket}
        />
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