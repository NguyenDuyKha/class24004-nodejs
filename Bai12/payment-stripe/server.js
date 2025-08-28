require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();

app.post("/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (error) {
        console.log(`Webhook signature verification failed: ${error.message}`);
        return res.sendStatus(400);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log("paymentIntentSucceeded:", paymentIntentSucceeded);
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            console.log("paymentIntentFailed:", paymentIntentFailed);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
})

app.use(express.json());
app.use(express.static('public'));

app.post('/create-payment-intent', async (req, res) => {
    const { items, currency } = req.body;

    const calculateOrderAmount = (items) => {
        return 1099; // 1099 cents
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: currency || 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        })

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ message: "Error creating payment intent"})
    }
})

app.get('/', (req, res) => {
    res.send("Welcome to the Stripe Demo!");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})