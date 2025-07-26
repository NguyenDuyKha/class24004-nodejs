const http = require("http");
const fs = require('fs');


const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if(req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/products' && req.method === "GET") {
        try {
            const data = await fs.promises.readFile("data.json", "utf8")
            res.writeHead(200, { "Content-type": "application/json" });
            res.end(data);
        } catch (error) {
            res.writeHead(500, { "Content-type": "application/json" });
            res.end(JSON.stringify({ message: "Loi server khi lay du lieu san pham" }));
        }
    }
    else if (req.url === '/products' && req.method === "POST") {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const newProduct = JSON.parse(body);

                const data = await fs.promises.readFile("data.json", "utf8");
                const products = JSON.parse(data);

                newProduct.id = products.length + 1;
                products.push(newProduct);

                await fs.promises.writeFile("data.json", JSON.stringify(products, null, 2));

                res.writeHead(201, { "Content-type": "application/json" });
                res.end(JSON.stringify(newProduct));

            } catch (error) {
                res.writeHead(400, { "Content-type": "application/json" });
                res.end(JSON.stringify({ message: "Du lieu khong hop le" }));
            }
        })

    }
    else if (req.url.startsWith('/products/') && req.method === "PUT") {
        const productId = parseInt(req.url.split("/")[2]);

        if (isNaN(productId)) {
            res.writeHead(400, { "Content-type": "application/json" });
            res.end(JSON.stringify({ message: "ID khong hop le" }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const updateProduct = JSON.parse(body);

                const data = await fs.promises.readFile("data.json", "utf8");
                const products = JSON.parse(data);

                const productIndex = products.findIndex(p => p.id === productId);
                if (productIndex === -1) {
                    res.writeHead(400, { "Content-type": "application/json" });
                    res.end(JSON.stringify({ message: "Khong tim thay theo ID" }));
                    return;
                }

                products[productIndex] = { ...products[productIndex], ...updateProduct };

                await fs.promises.writeFile("data.json", JSON.stringify(products, null, 2));

                res.writeHead(200, { "Content-type": "application/json" });
                res.end(JSON.stringify(products[productIndex]));

            } catch (error) {
                res.writeHead(400, { "Content-type": "application/json" });
                res.end(JSON.stringify({ message: "Du lieu khong hop le" }));
            }
        })

    }
    else if (req.url.startsWith('/products/') && req.method === "DELETE") {
        const productId = parseInt(req.url.split("/")[2]);

        if (isNaN(productId)) {
            res.writeHead(400, { "Content-type": "application/json" });
            res.end(JSON.stringify({ message: "ID khong hop le" }));
            return;
        }
        try {
            const data = await fs.promises.readFile("data.json", "utf8");
            const products = JSON.parse(data);

            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                res.writeHead(400, { "Content-type": "application/json" });
                res.end(JSON.stringify({ message: "Khong tim thay theo ID" }));
                return;
            }

            products.splice(productIndex, 1);

            await fs.promises.writeFile("data.json", JSON.stringify(products, null, 2));

            res.writeHead(204, { "Content-type": "No Content" });
            res.end();

        } catch (error) {
            res.writeHead(400, { "Content-type": "application/json" });
            res.end(JSON.stringify({ message: "Du lieu khong hop le" }));
        }

    }
    else {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Khong tim thay trang");
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log("Server dang lang nghe tai http://locahost:" + PORT);
})