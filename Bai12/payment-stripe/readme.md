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