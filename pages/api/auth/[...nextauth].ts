import NextAuth, { AuthOptions } from "next-auth";
import Stripe from "stripe";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../utils/prisma.util";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET!,
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
        where: { id: user.id.toString() },
        data: { stripeCustomerId: stripeUser.id },
      });
    },
  },
  callbacks: {
    session({ session, user }) {
      return { ...session, user: { ...user } };
    },
  },
};

export default NextAuth(authOptions);
