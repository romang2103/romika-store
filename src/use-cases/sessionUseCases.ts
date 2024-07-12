'use server';

import { getSession, createSession } from "../data-access/sessionRepository";
import { v4 as uuidv4 } from "uuid";
import { cookies } from 'next/headers';
import { createCart } from "@/data-access/cartRepository";

export interface SessionData {
    sessionId: string;
}

export async function getSessionUseCase() {
    try {
        const cookieStore = cookies();
        const sessionIdCookie = cookieStore.get('sessionId');
        if (!sessionIdCookie) {
            console.log('No active session')
            return null;
        }

        console.log('sessionIdCookie:', sessionIdCookie.value);
        const sessionId = sessionIdCookie.value;
        const session = await getSession(sessionId);

        if (!session) {
            console.log('Session not found');
            return null;
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
        // Create session id
        const sessionId = uuidv4();
        // Create session document in database
        const session = await createSession(sessionId);
        // Create cart document in database with sessionId
        await createCart(sessionId);
        console.log(session);
        // Set session id in cookie
        cookies().set('sessionId', session.sessionId, { httpOnly: true, path: '/' });
        return session;
    } catch (error) {
        console.error('Error in createSessionUseCase:', error);
        throw error;
    }
}
