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

export async function createCategory(categoryData: Omit<CategoryData, '_id'>): Promise<CategoryData> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('categories');

    const result = await collection.insertOne(categoryData);
    return {
        ...categoryData,
        _id: result.insertedId.toString()
    };
}

export async function deleteCategory(categoryId: number): Promise<void> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('categories');

    await collection.deleteOne({ id: categoryId });
}

export async function getCategoryById(categoryId: number): Promise<CategoryData | null> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('categories');

    const category = await collection.findOne({ id: categoryId });
    if (!category) {
        return null;
    }

    return {
        ...category,
        _id: category._id.toString()
    } as CategoryData;
}
