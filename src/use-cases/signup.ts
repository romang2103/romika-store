import { findUserByEmail, createUser } from '@/data-access/users';
import { hash } from 'bcryptjs';

// Interface for userData
interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

// Constant for salt rounds
const SALT_ROUNDS = 10;

export async function createUserUseCase(userData: UserData): Promise<{ message: string, status: number } | undefined> {
    try {
        const existingUser = await findUserByEmail(userData.email);

        // Check if email already exists
        if (existingUser) {
            return { message: 'Email already in use', status: 400 };
        }

        // Hash password using the SALT_ROUNDS constant
        const hashedPassword = await hash(userData.password, SALT_ROUNDS);

        // Create new user with hashed password
        const newUser = {
            ...userData,
            password: hashedPassword,
        };

        // Update the database with new user
        await createUser(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return { message: 'Error creating user', status: 500 };
    }
}
