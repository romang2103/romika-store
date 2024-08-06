import { ObjectId } from "mongodb";

export interface CartItemData {
    productId: number;
    price: number;
    quantity: number;
    image: string;
    name: string;
    description: string;
}

export interface CartData {
    sessionId: string;
    items: CartItemData[];
    total_price: number;
}

export interface ProductData {
    _id: string;
    product_id: number;
    description: string;
    price: number;
    name: string;
    quantity: number;
    minimum_order_quantity: number | null;
    wholesale_price: number | null;
    search_tags: string[];
    characteristics: any[];
    image_urls: string[];
    inStock: boolean;
}

export interface SessionData {
    _id?: ObjectId;
    sessionId: string;
}

export interface FilterOptionData {
    _id: ObjectId;
    name: string;
}