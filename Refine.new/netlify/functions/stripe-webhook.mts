import type { Context, Config } from "@netlify/functions";
import Stripe from 'stripe';

const stripe = new Stripe(Netlify.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-12-18.acacia',
});

const endpointSecret = Netlify.env.get('STRIPE_WEBHOOK_SECRET') || '';

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);
      
      // TODO: Store user subscription in database
      // You would typically:
      // 1. Get customer email from session.customer_details.email
      // 2. Get subscription ID from session.subscription
      // 3. Store in your database with usage tracking
      
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id);
      
      // TODO: Update user subscription status
      
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      console.log('Subscription deleted:', deletedSubscription.id);
      
      // TODO: Handle subscription cancellation
      
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment succeeded:', invoice.id);
      
      // TODO: Reset usage counters for the new billing period
      
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed:', failedInvoice.id);
      
      // TODO: Handle failed payment
      
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response('Webhook received', { status: 200 });
};

export const config: Config = {
  path: "/api/stripe-webhook"
};
