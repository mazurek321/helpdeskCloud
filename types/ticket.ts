export type TicketStatus = "open" | "pending" | "closed"

export type Ticket = {
  id: string
  title: string
  description: string
  status: TicketStatus
  created_at: string

  created_by: string | null
  assigned_to: string | null
}