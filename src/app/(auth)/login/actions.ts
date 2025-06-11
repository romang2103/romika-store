'use server'

import { z } from 'zod';
import { loginUseCase } from '@/use-cases/login';
import { cookies } from 'next/headers';
import { getOrCreateSession } from '@/lib/sessionService';

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export async function loginAction(formData: FormData): Promise<{ message: string, status: number, role?: string, userId?: string }> {
    const values = Object.fromEntries(formData.entries()) as Record<string, string>;
    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        const errorMessages = Object.entries(validatedFields.error.flatten().fieldErrors)
            .flatMap(([field, messages]) => messages.map(message => `${field}: ${message}`))
            .join(', ');

        return { message: `Error: ${errorMessages}`, status: 400 };
    }

    const { email, password } = validatedFields.data;

    try {
        const response = await loginUseCase({ email, password });

        if (response?.role) {
            // Get or create session and associate it with the user
            await getOrCreateSession(response.userId);
            
            // Set authentication cookies with proper security options
            cookies().set('role', response.role, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/'
            });

            cookies().set('authenticated', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/'
            });

            return { 
                message: response?.message ?? 'Login Successful', 
                status: 200, 
                role: response?.role 
            };
        }
        return { message: response?.message ?? 'Invalid role', status: 400 };
    } catch (error) {
        return { message: `Login error: ${error}`, status: 500 };
    }
}

export async function logoutAction() {
  // Clear all auth-related cookies
  cookies().delete('authenticated');
  cookies().delete('role');
  cookies().delete('sessionId');
  
  return { message: 'Logged out successfully', status: 200 };
}
