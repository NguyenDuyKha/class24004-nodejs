# Installation
```sh
npm install sequelize mysql2
npm install dotenv
```

# In .env
```sh
DB_DIALECT=mysql
DB_DATABASE=sequelize_demo_dev
DB_USERNAME=root
DB_PASSWORD=root
DB_HOST=127.0.0.1
DB_PORT=3306

JWT_SECRET=your_super_secret_and_long_random_string_here
JWT_EXPIRES_IN=1h
```


# cURL
## Step 1: Login to get token
```sh
curl --location 'http://localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data '{
    "emailOrUsername": "ndkha",
    "password": "1234"
}'
```

## Step 2: Add token in Header Request
### Example 1:
```sh
curl --location 'http://localhost:3000/api/products' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NTE0MjgxOCwiZXhwIjoxNzU1MTQ2NDE4fQ.xxW5kWLIFeewLxyB3VY-63H0A8ZW7bZBjjaBVOGoUAU1' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Laptop Dell",
    "description": "Laptop hiệu năng cao",
    "price": "1200.00",
    "categoryId": 1
}'
```

### Example 2:
```sh
curl --location 'http://localhost:3000/api/auth/me' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NTE0MjgxOCwiZXhwIjoxNzU1MTQ2NDE4fQ.xxW5kWLIFeewLxyB3VY-63H0A8ZW7bZBjjaBVOGoUAU'
```


