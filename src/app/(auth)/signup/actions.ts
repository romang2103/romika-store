'use server'

import { z } from 'zod';
import { createUserUseCase } from '../../../use-cases/signupUseCases';

const formSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    phoneNumber: z.string().min(9, { message: "Invalid phone number" }),
});

export async function createUserAction(formData: FormData) {

    const values = Object.fromEntries(formData.entries()) as Record<string, string>;

    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        const errorMessages = Object.entries(validatedFields.error.flatten().fieldErrors)
            .flatMap(([field, messages]) => messages.map(message => `${field}: ${message}`))
            .join(', '); // Join all error messages into a single string

        return { message: `Error: ${errorMessages}`, status: 400 };
    }

    const { firstName, lastName, email, password, phoneNumber } = validatedFields.data;

    try {

        const response = await createUserUseCase({ firstName, lastName, email, password, phoneNumber });
        return { message: response?.message ?? 'User created successfully', status: 201 };
    } catch (error) {
        return { message: 'Error creating user', status: 500 };
    }
}
