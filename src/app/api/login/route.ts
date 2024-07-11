// import { NextResponse } from 'next/server';
// import clientPromise from '../../../lib/mongodb';
// import { compare } from 'bcryptjs';

// export async function POST(request: Request) {
//     const { email, password } = await request.json();
//     console.log(email, password);

//     try {
//         const client = await clientPromise;
//         const db = client.db('romika-db');
//         const collection = db.collection('users');

//         const user = await collection.findOne({ email });

//         if (!user) {
//             return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
//         }

//         const isValid = await compare(password, user.password);

//         if (!isValid) {
//             return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
//         }

//         return NextResponse.json({ user, message: 'Login successful', status: 200 });
//     } catch (error) {
//         return NextResponse.json({ message: 'Error logging in' }, { status: 500 });
//     }
// }
