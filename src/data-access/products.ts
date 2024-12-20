'use server';

import clientPromise from "@/lib/mongodb";
import { ProductData } from "@/interfaces/interfaces";

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
        const product = await collection.findOne({ product_id: productId }) as unknown as ProductData;
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch (error) {
        throw new Error('Error getting product from database');
    }
}