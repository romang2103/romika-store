import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
    const { firstName, lastName, email, password, phoneNumber } = await request.json();

    try {
        const client = await clientPromise;
        const db = client.db('romika-db');
        const collection = db.collection('users');

        // Check if email already exists
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await hash(password, 10);

        // Insert new user
        await collection.insertOne({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
        });

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
    }
}
