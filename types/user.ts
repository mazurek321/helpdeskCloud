export type User = {
  id: string
  email: string
  name: string | null
  image: string | null
  role: "user" | "helpdesk" | "admin"
  created_at?: string
}