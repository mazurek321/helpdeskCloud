import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("id", { ascending: true })

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json(data)
}

export async function PATCH(req: Request) {
  const body = await req.json()

  const { id, role } = body

  if (!id || !role) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", id)
    .select()

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json(data)
}