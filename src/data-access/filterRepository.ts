'use server'

import clientPromise from "@/lib/mongodb";
import { FilterOptionData } from "@/interfaces/interfaces";

export async function getFilterOptions(): Promise<FilterOptionData[]> {
    const client = await clientPromise;
    const db = client.db('romika-db');
    const collection = db.collection('categories');

    const filterOptionsData = await collection.find({}).toArray() as FilterOptionData[];

    // Map over the filter options data and convert _id to string
    return filterOptionsData.map(option => ({
        ...option,
        _id: option._id.toString()  // Convert _id to a string
    }));
}
