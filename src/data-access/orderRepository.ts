'use server';

import clientPromise from "@/lib/mongodb";
import { OrderData, OrderDetails } from "@/interfaces/interfaces";
import { ObjectId } from "mongodb";

/**
 * Create a new order in the database.
 * @param orderData - The order data to be inserted.
 * @returns The inserted order with its unique identifier.
 */
export async function createOrder(orderData: OrderData): Promise<OrderDetails> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection<OrderDetails>('orders');

    const result = await collection.insertOne({
        ...orderData,
        createdAt: new Date(),
    });

    console.log('Order created with ID:', result.insertedId);

    return {
        _id: result.insertedId.toString(),
        ...orderData,
        createdAt: new Date(),
    };
}

/**
 * Retrieve an order by its ID.
 * @param orderId - The unique identifier of the order.
 * @returns The order document or null if not found.
 */
export async function getOrderById(orderId: string): Promise<OrderDetails | null> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection<OrderDetails>('orders');

    const order = await collection.findOne({ _id: new ObjectId(orderId) });

    if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
    }
    console.log('Order fetched:', order);

    return {
        ...order,
        _id: order._id.toString(),
    };
}

/**
 * Add more functions like updateOrder, deleteOrder later.
 */
