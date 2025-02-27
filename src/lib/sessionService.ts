import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSession } from '@/data-access/sessionRepository';
import { createCart } from '@/data-access/cartRepository';

export async function getOrCreateSession() {
  const cookieStore = cookies();
  const sessionIdCookie = cookieStore.get('sessionId');

  if (sessionIdCookie) {
    const session = await getSession(sessionIdCookie.value);
    if (session) {
      return session;
    }
  }

  // Create new session if none exists
  const sessionId = uuidv4();
  const session = await createSession(sessionId);
  await createCart(sessionId);
  
  // Set session cookie with proper security options
  cookies().set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  });

  return session;
} 