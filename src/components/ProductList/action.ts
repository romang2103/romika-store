'use server';

import { fetchProducts } from "@/data-access/products";

interface ProductData {
    _id: any;
    product_id: number;
    description: string;
    price: number;
    name: string;
    quantity: number;
    minimum_order_quantity: number | null;
    wholesale_price: number | null;
    search_tags: string[];
    characteristics: any[];
    image_urls: string[];
    inStock: boolean;
}

export async function getProductList(): Promise<ProductData[]> {
    try {
        const products = await fetchProducts();
        console.log("Products fetched successfully");
        const productList = products.map((product) => ({
            _id: product._id.toString(), // Convert _id to string
            product_id: product.product_id,
            description: product.description,
            price: product.price,
            name: product.name,
            quantity: product.quantity,
            minimum_order_quantity: product.minimum_order_quantity,
            wholesale_price: product.wholesale_price,
            search_tags: product.search_tags,
            characteristics: product.characteristics.map(({ name, value, unit }) => ({
                name,
                value,
                unit: isNaN(unit) ? "N/A" : unit, // Handle NaN for unit
            })),
            image_urls: product.image_urls,
            inStock: product.quantity > 0,
        }));
        return productList;
    } catch (error) {
        throw new Error('Error fetching products');
    }
}