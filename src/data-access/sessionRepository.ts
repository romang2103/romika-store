'use server';

import clientPromise from "@/lib/mongodb";
import { SessionData } from "@/interfaces/interfaces";
import { Session } from "inspector";

export async function createSession(sessionData: SessionData): Promise<SessionData> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('sessions');
    const { _id, ...newSessionData } = sessionData; // Exclude _id
    const result = await collection.insertOne({ ...newSessionData });
    console.log('Session created');
    return { _id: result.insertedId.toHexString(), ...newSessionData };
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
        };
        return filteredSession;
    }
    return null;
}

export async function extendSession(sessionId: string, newExpiry: Date, lastActive: Date): Promise<void> {
    const client = await clientPromise;
    const db = client.db("romika-db");
    const collection = db.collection("sessions");

    await collection.updateOne(
        { sessionId },
        { $set: { expiresAt: newExpiry, lastActiveAt: lastActive } }
    );
}

export async function deleteSession(sessionId: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db("romika-db");
    const collection = db.collection("sessions");
    await collection.deleteOne({ sessionId });
}
