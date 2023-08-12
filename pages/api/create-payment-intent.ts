import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

import { ICartItem } from "../../interfaces/ICartItem.interface";
import { IExtendedUser, IUser } from "../../interfaces/IUser.interface";
import { authOptions } from "./auth/[...nextauth]";

interface Body {
  cartItems: ICartItem[];
  paymentIntentId: string;
  totalPrice: number;
}

type IAuthUser = (IUser & IExtendedUser) | undefined;

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user)
    return res.status(403).json({ message: "Unauthenticated" });

  const authUser: IAuthUser = session.user;

  const { cartItems, paymentIntentId, totalPrice }: Body = req.body;

  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent)
      return res.status(400).json({ message: "Invalid payment intent id" });

    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      { amount: totalPrice }
    );
    await prisma.order.update({
      where: { paymentIntentId },
      data: {
        amount: totalPrice,
        records: {
          deleteMany: {},
          create: cartItems.map((item) => ({
            name: item.artist + "-" + item.album,
            unit_amount: item.unit_amount,
          })),
        },
      },
    });

    return res.status(200).json(updatedPaymentIntent);
  }

  const newPaymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
  });
  await prisma.order.create({
    data: {
      userId: authUser.id ? authUser.id : "",
      amount: totalPrice,
      currency: "eur",
      status: "pending",
      paymentIntentId: newPaymentIntent.id,
      records: {
        create: cartItems.map((item) => ({
          name: item.artist + "-" + item.album,
          unit_amount: item.unit_amount,
        })),
      },
    },
  });

  return res.status(200).json(newPaymentIntent);
}
