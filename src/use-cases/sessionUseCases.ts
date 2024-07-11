'use server';

import { getSession, createSession } from "../data-access/sessionRepository";
import { v4 as uuidv4 } from "uuid";
import { cookies } from 'next/headers';
import { ObjectId } from "mongodb";

export interface SessionData {
    sessionId: string;
    cart: any[];
}

export async function getSessionUseCase() {
    try {
        const cookieStore = cookies();
        const sessionIdCookie = cookieStore.get('sessionId');
        if (!sessionIdCookie) {
            return { message: "No active session" };
        }

        const sessionId = sessionIdCookie.value;
        const session = await getSession(sessionId);

        if (!session) {
            return { message: "Session not found" };
        }

        return session;
    } catch (error) {
        console.error('Error in getSessionUseCase:', error);
        throw error;
    }
}

export async function createSessionUseCase() {
    try {
        console.log('Creating session...');
        const sessionId = uuidv4();
        const session = await createSession(sessionId);
        console.log(session);
        cookies().set('sessionId', session.sessionId, { httpOnly: true, path: '/' });
        return session;
    } catch (error) {
        console.error('Error in createSessionUseCase:', error);
        throw error;
    }
}
