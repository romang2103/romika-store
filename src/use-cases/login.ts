import { findUserByEmail } from '@/data-access/users';
import { compare } from 'bcryptjs';

// Interface for userData
interface UserLoginData {
    email: string;
    password: string;
}

interface User extends UserLoginData {
    role: string;
}

export async function loginUseCase(userLoginData: UserLoginData): Promise<{ message: string, status: number, role?: string } | undefined> {
    try {
        const user = await findUserByEmail(userLoginData.email);

        if (!user) {
            return { message: 'Authentication failed', status: 401 }; // More generic message
        }

        const passwordMatch = await compare(userLoginData.password, user.password);

        if (!passwordMatch) {
            return { message: 'Authentication failed', status: 401 }; // Same message for security
        }

        switch (user.role) {
            case 'admin':
                return { message: 'Admin login successful', status: 200, role: 'admin' };
            case 'user':
                return { message: 'User login successful', status: 200, role: 'user' };
            default:
                return { message: 'Invalid role', status: 400 };
        }
    } catch (error) {
        // More specific error handling could be implemented here
        console.error('Error during login process:', error);
        return { message: 'An error occurred during the login process', status: 500 };
    }
}
