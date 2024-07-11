import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface SessionData {
    _id?: ObjectId;
    sessionId: string;
    cart: any[];
}

export async function createSession(sessionId: string): Promise<SessionData> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('sessions');
    const newSession = { sessionId, cart: [] };
    await collection.insertOne(newSession);
    return newSession;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('sessions');
    const session = await collection.findOne({ sessionId }) as SessionData | null;
    return session;
}

// export async function updateSessionCart(sessionId: string, cart: any[]): Promise<void> {
//     const client = await clientPromise;
//     const db = client.db('romika-db');
//     const collection = db.collection('sessions');
//     await collection.updateOne({ sessionId }, { $set: { cart } });
// }
