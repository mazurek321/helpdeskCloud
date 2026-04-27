export type Ticket = {
  id: number
  title: string
  description: string
  status: string
  created_by: string
  assigned_to: string | null
  created_at: string
}