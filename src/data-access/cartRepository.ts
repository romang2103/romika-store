'use server'

import clientPromise from "@/lib/mongodb";

interface CartData {
    session_id: string;
    items: any[];
    total_price: number;
}

export async function createCart(sessionId: string) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    const newCart = {
        session_id: sessionId,
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
    const cart = await collection.findOne({ session_id: sessionId }) as CartData | null;
    return cart;
}

export async function addItemToCart(sessionId: string, item: any) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    const cart = await collection.findOne({ session_id: sessionId }) as CartData | null;
    const updatedCart = {
        ...cart!,
        items: [...cart!.items, item],
        total_price: cart!.total_price + item.price,
    };
    await collection.updateOne({ session_id: sessionId }, { $set: updatedCart });

    console.log('Item added to cart');
}

export async function removeItemFromCart(sessionId: string, productId: number) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    const cart = await collection.findOne({ session_id: sessionId }) as CartData | null;
    const updatedItems = cart!.items.filter((item) => item.productId !== productId);
    const updatedCart = {
        ...cart!,
        items: updatedItems,
        total_price: cart!.total_price - updatedItems.find((item) => item.productId === productId)!.price,
    };
    await collection.updateOne({ session_id: sessionId }, { $set: updatedCart });
    console.log('Item removed from cart');
}

export async function getItemInCart(sessionId: string, productId: number) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    const cart = await collection.findOne({ session_id: sessionId }) as CartData | null;
    const item = cart?.items.find((item) => item.productId === productId);
    return item;
}

export async function updateItemInCartQuantity(sessionId: string, productId: number, quantity: number) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    const cart = await collection.findOne({ session_id: sessionId }) as CartData | null;
    const updatedItems = await Promise.all(cart!.items.map(async (item) => {
        if (item.productId === productId) {
            if (item.quantity + quantity > 0) {
                return { ...item, quantity: item.quantity + quantity };
            }
            await removeItemFromCart(sessionId, productId);
        }
        return item;
    }));
    const updatedCart = {
        ...cart!,
        items: updatedItems,
        total_price: cart!.total_price + quantity * updatedItems.find((item) => item.productId === productId)!.price,
    };
    await collection.updateOne({ session_id: sessionId }, { $set: updatedCart });
    console.log('Item quantity updated');
}

export async function clearCart(sessionId: string) {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('carts');
    await collection.updateOne({ session_id: sessionId }, { $set: { items: [], total_price: 0 } });
    console.log('Cart cleared');
}