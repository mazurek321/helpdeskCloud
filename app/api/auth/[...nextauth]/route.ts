import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    })
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, profile }) {
        
      const p = profile as any

      const email =
          user?.email ||
          (profile as any)?.email ||
          (profile as any)?.email_address
      const github_login = p?.login
      const name = p?.name || p?.login
      const image = p?.avatar_url

      if (!email) return false

      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (error) {
        console.log("DB CHECK ERROR:", error)
      }

      if (!data) {
        await supabase.from("users").insert({
          email,
          github_login,
          name,
          image,
          role: "user",
        })
      } else {
        await supabase
          .from("users")
          .update({
            github_login,
            name,
            image,
          })
          .eq("email", email)
      }

      return true
    },

    async jwt({ token }) {
      const email = token.email as string

      if (email) {
        const { data } = await supabase
          .from("users")
          .select("email, name, image, role, github_login")
          .eq("email", email)
          .maybeSingle()

        if (data) {
          token.email = data.email
          token.name = data.name
          token.image = data.image
          token.role = data.role
          token.github_login = data.github_login
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        ;(session.user as any).role = token.role
        ;(session.user as any).github_login = token.github_login
      }

      return session
    },
  },
})

export { handler as GET, handler as POST }