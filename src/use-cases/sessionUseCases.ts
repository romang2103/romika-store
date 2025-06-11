'use server';

import { getSession, createSession, deleteSession, extendSession } from "../data-access/sessionRepository";
import { v4 as uuidv4 } from "uuid";
import { cookies } from 'next/headers';
import { createCart } from "@/data-access/cartRepository";
import { SessionData } from "@/interfaces/interfaces";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function setSessionCookie(sessionId: string) {
    cookies().set("sessionId", sessionId, {
        httpOnly: true,
        path: "/",
        maxAge: SESSION_DURATION_MS / 1000,
    });
}

/**
 * @description Retrieves a session from storage based on an active session ID cookie,
 * logging and handling cases where no session or error is encountered, returning the
 * session object if found successfully.
 *
 * @returns {object|null} A session object if it exists and was retrieved successfully,
 * otherwise null indicating an error occurred such as no active session or session
 * not found.
 */
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

        const now = new Date();
        if (session.expiresAt && session.expiresAt < now) {
            console.log("Session expired");
            await deleteSession(sessionId);
            return null;
        }

        // Sliding expiration logic:
        const newExpiry = new Date(now.getTime() + SESSION_DURATION_MS);
        await extendSession(sessionId, newExpiry, now);
        setSessionCookie(sessionId); // Refresh the browser cookie

        return { ...session, expiresAt: newExpiry, lastActiveAt: now };
    } catch (error) {
        console.error('Error in getSessionUseCase:', error);
        throw error;
    }
}

/**
 * @description Creates a new user session by generating a unique ID, creating a
 * session document and a cart document in the database, logging the session details,
 * setting the session ID in a cookie, and returning the created session data.
 *
 * @returns {object} The `session` created by calling the `createSession` function.
 * The structure and properties of this object are determined by the implementation
 * of `createSession`.
 */

export async function createSessionUseCase() {
    try {
        const sessionId = uuidv4();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

        const newSession: SessionData = {
            sessionId,
            createdAt: now,
            expiresAt,
            lastActiveAt: now,
        };

        const session = await createSession(newSession);
        await createCart(sessionId);

        setSessionCookie(sessionId);

        return session;
    } catch (error) {
        console.error('Error in createSessionUseCase:', error);
        throw error;
    }
}

// Retrieve the current session or create a new one if none exists
export async function getOrCreateSessionUseCase(): Promise<SessionData> {
    const session = await getSessionUseCase();
    if (session) {
        return session;
    }
    return await createSessionUseCase();
}