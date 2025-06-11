'use server';

import clientPromise from "@/lib/mongodb";
import { SessionData } from "@/interfaces/interfaces";

export async function createSession(sessionId: string, userId?: string): Promise<SessionData> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('sessions');
    const newSession: SessionData = userId ? { sessionId, userId } : { sessionId };
    await collection.insertOne(newSession);
    console.log('Session created');
    return newSession;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('sessions');
    const session = await collection.findOne({ sessionId }) as SessionData | null;
    if (session) {
        // Apply your filter logic here
        // For example, if you want to filter out certain properties from the session object
        const filteredSession = {
            sessionId: session.sessionId,
            userId: session.userId,
        };
        return filteredSession;
    }
    return null;
}

export async function updateSessionUser(sessionId: string, userId: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('sessions');
    await collection.updateOne({ sessionId }, { $set: { userId } });
}

// export async function updateSessionCart(sessionId: string, cart: any[]): Promise<void> {
//     const client = await clientPromise;
//     const db = client.db('romika-db');
//     const collection = db.collection('sessions');
//     await collection.updateOne({ sessionId }, { $set: { cart } });
// }
