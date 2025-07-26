
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const products = await response.json();
        console.log(products);
    } catch (error) {
        console.error("Error fetching products !!!");
    }
}

fetchProducts();