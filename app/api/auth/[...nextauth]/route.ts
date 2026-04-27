import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { scope: "read:user user:email" }
      }
    })
  ],

  session: { strategy: "jwt" as const},

  callbacks: {
    async signIn({ user, profile }: any) {
      const p = profile as any

      const email =
        user?.email ||
        p?.email ||
        p?.email_address

      const github_login = p?.login
      const name = p?.name || p?.login
      const image = p?.avatar_url

      if (!email) return false

      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (!data) {
        await supabase.from("users").insert({
          email,
          github_login,
          name,
          image,
          role: "user"
        })
      } else {
        await supabase
          .from("users")
          .update({ github_login, name, image })
          .eq("email", email)
      }

      return true
    },

    async jwt({ token }: any) {
      const email = token.email as string

      if (email) {
        const { data } = await supabase
          .from("users")
          .select("email,name,image,role,github_login")
          .eq("email", email)
          .maybeSingle()

        if (data) {
          token.email = data.email
          token.name = data.name
          token.image = data.image
          token.role = data.role ?? "user"
          token.github_login = data.github_login
        } else {
          token.role = "user"
        }
      }

      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.image
        session.user.role = token.role ?? "user"
        session.user.github_login = token.github_login
      }

      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }