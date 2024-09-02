import { findUserByEmail, createUser } from '@/data-access/users';
import { hash } from 'bcryptjs';

/**
 * @description Defines a set of properties that can be used to describe user data.
 * It consists of six fields, each representing a piece of information about a user:
 * `firstName`, `lastName`, `email`, `password`, and `phoneNumber`. Each field has a
 * specific data type as specified by the interface, ensuring that any object conforming
 * to this interface must have these properties with their respective types.
 */
interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

// Constant for salt rounds
const SALT_ROUNDS = 10;

/**
 * @description Creates a new user by hashing their password and checking for existing
 * email addresses in the database, returning a success or error message accordingly.
 *
 * @param {UserData} userData - Used to create a new user with given details.
 *
 * @returns {Promise<{ message: string, status: number } | undefined>} An object with
 * a 'message' property and a 'status' property if the user creation was successful
 * or failed, otherwise it returns undefined.
 */
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
