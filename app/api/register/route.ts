import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Wypełnij wszystkie pola" },
        { status: 400 }
      )
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: "Użytkownik z tym emailem już istnieje." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        name,
        role: "user"
      })
      .select("id")
      .single()

    if (error || !newUser) {
      return NextResponse.json(
        { error: "Błąd przy tworzeniu użytkownika" },
        { status: 500 }
      )
    }

    await supabase.from("accounts").insert({
      user_id: newUser.id,
      provider: "credentials",
      provider_account_id: email
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    )
  }
}