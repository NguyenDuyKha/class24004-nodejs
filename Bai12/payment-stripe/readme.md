# Installation
```sh
npm init -y
npm install --save-dev nodemon

Add `"dev": "nodemon server.js"` in scripts of package.js
npm run dev

npm install express stripe dotenv
```

# In .env
```sh
STRIPE_PUBLISHABLE_KEY=pk_test_51Ny7xyK3Pu
STRIPE_SECRET_KEY=sk_test_51Ny7xyK3P
```

# Docs
https://docs.stripe.com/payments/quickstart
https://dashboard.stripe.com/test/dashboard
https://docs.stripe.com/testing

# Install Stripe CLI
https://docs.stripe.com/stripe-cli

Terminal 1:
If not login then **Press Enter to open the browser**

```sh
stripe listen --forward-to localhost:3000/stripe-webhook
```
After run this command, Stripe return **Webhook Signing Secret**. You copy this key to .env file.

Terminal 2:
```sh
stripe trigger payment_intent.succeeded
```