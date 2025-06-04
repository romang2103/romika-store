'use server';

import clientPromise from "@/lib/mongodb";
import { ProductData, ProductDocument } from "@/interfaces/interfaces";

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

export async function createProduct(productDocument: ProductDocument): Promise<ProductDocument> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('products');
    
    await collection.insertOne(productDocument);
    return productDocument;
}

export async function updateProduct(productId: number, productData: Partial<ProductData>): Promise<ProductData> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('products');
    await collection.updateOne({ product_id: productId }, { $set: productData });
    return { ...productData, product_id: productId } as ProductData;
}

export async function deleteProduct(productId: number): Promise<void> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('products');
    await collection.deleteOne({ product_id: productId });
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