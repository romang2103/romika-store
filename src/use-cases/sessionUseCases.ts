import { getSession, createSession } from '../data-access/sessionRepository';
import { v4 as uuidv4 } from 'uuid';

export async function getSessionUseCase(req, res) {
    const cookies = req.headers.cookie || '';
    const sessionId = cookies.split(';').find((c: string) => c.trim().startsWith('sessionId='));
    if (!sessionId) {
        return { message: "No active session" };
    }

    const sessionIdValue = sessionId.split('=')[1];
    const session = await getSession(sessionIdValue);

    if (!session) {
        return { message: "Session not found" };
    }

    return session;
}

export async function createSessionUseCase(req, res) {
    const sessionId = uuidv4();
    const session = await createSession(sessionId);
    res.setHeader('Set-Cookie', `sessionId=${session._id}; HttpOnly; Path=/`);
    return session;
}
