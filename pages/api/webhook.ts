import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";

import { prisma } from "../../utils/prisma.util";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  if (!sig)
    return res.status(400).json({ message: "Invalid webhook signature" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err}`);
  }
  switch (event.type) {
    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await prisma.order.update({
          where: { paymentIntentId: charge.payment_intent as string },
          data: { status: "success" },
        });
      }
      break;
    default:
      return res.status(400).send(`Event type not supported: ${event.type}`);
  }

  res.json({ received: true });
}
