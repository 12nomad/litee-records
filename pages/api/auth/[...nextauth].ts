import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Stripe from "stripe";

import { prisma } from "../../../utils/prisma.util";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      const stripeUser = await stripe.customers.create({
        name: user.name,
        email: user.email,
      } as Stripe.RequestOptions);
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: stripeUser.id },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
