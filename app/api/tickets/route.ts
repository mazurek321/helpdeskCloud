import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      title: body.title,
      description: body.description,
      status: "open",
      created_by: body.created_by,
      assigned_to: null,
      created_at: new Date().toISOString()
    })
    .select()

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json(data)
}

export async function PATCH(req: Request) {
  const body = await req.json()

  if (!body.id || !body.user_email || !body.action) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  if (body.action === "close") {
    const { data, error } = await supabase
      .from("tickets")
      .update({ status: "closed" })
      .eq("id", body.id)
      .eq("created_by", body.user_email)
      .select()

    if (error) return Response.json({ error }, { status: 500 })
    return Response.json(data)
  }

  if (body.action === "take") {
    const { data, error } = await supabase
      .from("tickets")
      .update({
        status: "pending",
        assigned_to: body.user_email
      })
      .eq("id", body.id)
      .is("assigned_to", null)
      .select()

    if (error) return Response.json({ error }, { status: 500 })
    return Response.json(data)
  }

  if (body.action === "force_close_helpdesk") {
    const { data, error } = await supabase
      .from("tickets")
      .update({ status: "closed" })
      .eq("id", body.id)
      .eq("assigned_to", body.user_email)
      .select()

    if (error) return Response.json({ error }, { status: 500 })
    return Response.json(data)
  }

  return Response.json({ error: "Invalid action" }, { status: 400 })
}