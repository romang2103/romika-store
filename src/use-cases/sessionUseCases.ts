'use server';

import { getSession, createSession } from "../data-access/sessionRepository";
import { v4 as uuidv4 } from "uuid";
import { cookies } from 'next/headers';
import { createCart } from "@/data-access/cartRepository";
import { SessionData } from "@/interfaces/interfaces";

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

        return session;
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
