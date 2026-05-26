import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

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
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single()

        if (!user?.password) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        }
      }
    })
  ],

  session: {
    strategy: "jwt" as const
  },

  callbacks: {
    async signIn({ user, account }: any) {
      if (!account) return false

      const provider = account.provider
      const provider_account_id = account.providerAccountId

      // 1. sprawdź czy konto OAuth istnieje
      const { data: existingAccount } = await supabase
        .from("accounts")
        .select("*")
        .eq("provider", provider)
        .eq("provider_account_id", provider_account_id)
        .maybeSingle()

      if (existingAccount) return true

      const email = user.email
      if (!email) return false

      // 2. znajdź lub utwórz usera
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      let userId: string

      if (existingUser) {
        userId = existingUser.id
      } else {
        const { data: newUser, error } = await supabase
          .from("users")
          .insert({
            email,
            name: user.name,
            image: user.image,
            role: "user"
          })
          .select("id")
          .single()

        if (error || !newUser) return false
        userId = newUser.id
      }

      // 3. zapisz account OAuth
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

    async jwt({ token, user, account }: any) {
      // przy pierwszym logowaniu
      if (account && user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single()

        if (dbUser) {
          token.userId = dbUser.id
          token.role = dbUser.role
        }
      }

      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.userId
        session.user.role = token.role
      }

      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }