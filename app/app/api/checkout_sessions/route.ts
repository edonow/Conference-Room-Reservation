import { NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
  maxNetworkRetries: 3,
});

export async function POST(req: Request, res: NextApiResponse) {
  const text = await req.text();
  const price_id = text.split("=")[1];

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/top/?success=true`,
      cancel_url: `${req.headers.get("origin")}/top/?canceled=true`,
    });

    if (!session.url) {
      throw new Error("Failed to create session");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 303,
      headers: {
        Location: session.url,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const error = err as Stripe.StripeRawError;
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.statusCode || 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
