'use server'

import { z } from 'zod';
import { loginUseCase } from '@/use-cases/login';

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export async function loginAction(formData: FormData): Promise<{ message: string, status: number, role?: string }> {

    const values = Object.fromEntries(formData.entries()) as Record<string, string>;

    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        const errorMessages = Object.entries(validatedFields.error.flatten().fieldErrors)
            .flatMap(([field, messages]) => messages.map(message => `${field}: ${message}`))
            .join(', '); // Join all error messages into a single string

        return { message: `Error: ${errorMessages}`, status: 400 };
    }

    const { email, password } = validatedFields.data;

    try {

        const response = await loginUseCase({ email, password });

        if (response?.role) {
            return { message: response?.message ?? 'Login Successfull', status: 201, role: response?.role };
        }
        return { message: response?.message ?? 'Invlaid role', status: 400 };
    } catch (error) {
        return { message: `Login error: ${error}`, status: 500 };
    }
}
