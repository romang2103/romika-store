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

export async function loginUseCase(userLoginData: UserLoginData): Promise<{ message: string, status: number, role?: string }> {
    try {
        const user = await findUserByEmail(userLoginData.email);

        if (!user) {
            return { message: 'Invalid credentials', status: 401 };
        }

        const passwordMatch = await compare(userLoginData.password, user.password);

        if (!passwordMatch) {
            return { message: 'Invalid credentials', status: 401 };
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
        console.error('Error during login process:', error);
        return { message: 'An error occurred during login', status: 500 };
    }
}
