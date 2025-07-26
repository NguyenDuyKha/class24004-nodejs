const express = require('express');
const router = express.Router();

const fs = require('fs');

router.get('/products', async (req, res, next) => {
    try {
        const data = await fs.promises.readFile('data.json', 'utf8');
        const products = JSON.parse(data);
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.get('/products/:id', async (req, res, next) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        return res.status(400).send("ID san pham khong hop le");
    }
    try {
        const data = await fs.promises.readFile('data.json', 'utf8');
        const products = JSON.parse(data);
        const product = products.find(p => p.id === productId);
        if(!product) {
            return res.status(404).send("Khong tim thay san pham");
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
});

router.post('/products', async (req, res, next) => {
    try {
        const newProduct = req.body;

        const data = await fs.promises.readFile('data.json', 'utf8');
        const products = JSON.parse(data);

        newProduct.id = products.length + 1;
        products.push(newProduct);

        await fs.promises.writeFile('data.json', JSON.stringify(products, null, 2));

        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
})

router.put('/products/:id', async (req, res, next) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        return res.status(400).send("ID san pham khong hop le");
    }
    try {
        const updateProduct = req.body;

        const data = await fs.promises.readFile('data.json', 'utf8');
        const products = JSON.parse(data);

        const productIndex = products.findIndex(p => p.id === productId);
        if(productIndex === -1) {
            return res.status(404).send("Khong tim thay san pham");
        }

        products[productIndex] = { ...products[productIndex], ...updateProduct };

        await fs.promises.writeFile('data.json', JSON.stringify(products, null, 2));

        res.json(products[productIndex]);
    } catch (error) {
        next(error);
    }
});

router.delete('/products/:id', async (req, res, next) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        return res.status(400).send("ID san pham khong hop le");
    }
    try {
        const data = await fs.promises.readFile('data.json', 'utf8');
        const products = JSON.parse(data);

        const productIndex = products.findIndex(p => p.id === productId);
        if(productIndex === -1) {
            return res.status(404).send("Khong tim thay san pham");
        }

        products.splice(productIndex, 1);

        await fs.promises.writeFile('data.json', JSON.stringify(products, null, 2));

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;