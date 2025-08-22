require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/create-payment-intent', async (req, res) => {
    const { items, currency } = req.body;

    const calculateOrderAmount = (items) => {
        return 1099; // 1099 cents
    }

    try {
        const paymentIntent = await stripe.paymentIntent.create({
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