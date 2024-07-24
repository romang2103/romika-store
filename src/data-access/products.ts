'use server';

import clientPromise from "@/lib/mongodb";

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
    characteristics: any[]; // Update this type to match the actual type of characteristics
    image_urls: string[];
}

export async function fetchProducts(): Promise<ProductData[]> {
    try {
        const client = await clientPromise;
        const db = client.db('romika-db');
        const collection = db.collection('products');
        const products = await collection.find({}).toArray() as unknown as ProductData[];
        return products;
    } catch (error) {
        throw new Error('Error getting products from database');
    }
}

export async function getProductById(productId: number): Promise<ProductData> {
    try {
        const client = await clientPromise;
        const db = client.db('romika-db');
        const collection = db.collection('products');
        const product = await collection.findOne({ product_id: productId }) as ProductData;
        return product;
    } catch (error) {
        throw new Error('Error getting product from database');
    }
}