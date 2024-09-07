import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { NextAuthConfig } from "next-auth"
import clientPromise from "./lib/dbClient";
import Google from "next-auth/providers/google"

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        }
    )],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return url
        },
        async session({ session, user, token }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            token.id = user.id;
            return token
        }
    },
    adapter: MongoDBAdapter(clientPromise),
} satisfies NextAuthConfig