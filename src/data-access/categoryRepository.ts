'use server'

import clientPromise from "@/lib/mongodb";
import { CategoryData } from "@/interfaces/interfaces";

export async function getCategories(): Promise<CategoryData[]> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('categories');

    const categoriesData = await collection.find({}).toArray() as CategoryData[];

    // Map over the categories data and convert _id to string
    return categoriesData.map(category => ({
        ...category,
        _id: category._id.toString()  // Convert _id to a string
    }));
}
