'use server'

import clientPromise from "@/lib/mongodb";

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export async function findUserByEmail(email: string) {
    try {
        const client = await clientPromise;
        const db = client.db('romika-db');
        const collection = db.collection('users');
        const user = await collection.findOne({ email });
        return user;
    } catch (error) {
        throw new Error('Error checking if user exists in database');
    }
}

export async function createUser(userData: UserData) {
    try {
        const client = await clientPromise;
        const db = client.db('romika-db');
        const collection = db.collection('users');
        const newUser = await collection.insertOne(userData);
        return newUser;
    } catch (error) {
        throw new Error('Error creating user');
    }
}

