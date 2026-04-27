import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],

  session: {
    strategy: "jwt" as const
  },

  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (!account) return false

      const provider = account.provider
      const provider_account_id = account.providerAccountId

      const { data: existingAccount } = await supabase
        .from("accounts")
        .select("*")
        .eq("provider", provider)
        .eq("provider_account_id", provider_account_id)
        .maybeSingle()

      if (existingAccount) return true

      const email = user?.email || profile?.email
      if (!email) return false

      let userId: string

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (existingUser) {
        userId = existingUser.id
      } else {
        const { data: newUser, error } = await supabase
          .from("users")
          .upsert(
            {
              email,
              name: user.name,
              image: user.image,
              role: "user"
            },
            { onConflict: "email" }
          )
          .select("id")
          .single()

        if (error || !newUser) return false

        userId = newUser.id
      }

      const { error: accError } = await supabase
        .from("accounts")
        .insert({
          user_id: userId,
          provider,
          provider_account_id,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at
        })

      if (accError) return false

      return true
    },

    async jwt({ token, account }: any) {
      if (account) {
        const { data: acc } = await supabase
          .from("accounts")
          .select("user_id")
          .eq("provider", account.provider)
          .eq("provider_account_id", account.providerAccountId)
          .maybeSingle()

        if (acc) token.userId = acc.user_id
      }

      if (token.userId) {
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("id", token.userId)
          .maybeSingle()

        if (user) {
          token.name = user.name
          token.email = user.email
          token.image = user.image
          token.role = user.role
        }
      }

      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.userId
        session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.image
        session.user.role = token.role
      }

      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }