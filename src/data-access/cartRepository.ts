'use server';

import clientPromise from "@/lib/mongodb";
import { CartData } from "@/interfaces/interfaces";

export async function createCart(sessionId: string) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    const newCart: CartData = {
        sessionId: sessionId,
        items: [],
        total_price: 0,
    };
    await collection.insertOne(newCart);
    console.log('Cart created');
}

export async function getCart(sessionId: string) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    const cart = await collection.findOne({ sessionId: sessionId }) as CartData | null;
    console.log('Cart fetched: ', cart);
    return cart;
}

export async function updateCart(sessionId: string, updatedCart: CartData) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    await collection.updateOne({ sessionId: sessionId }, { $set: { items: updatedCart.items, total_price: updatedCart.total_price } });
}

export async function clearCart(sessionId: string) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    await collection.updateOne({ sessionId: sessionId }, { $set: { items: [], total_price: 0 } });
    console.log('Cart cleared');
}

export async function getItemInCart(sessionId: string, productId: number) {
    const cart = await getCart(sessionId);
    if (!cart) return null;
    const item = cart.items.find(item => item.productId === productId);
    return item || null;
}
