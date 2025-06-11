import { ObjectId } from "mongodb";

export interface CartItemData {
    productId: number;
    price: number;
    quantity: number;
    image: string;
    name: string;
    description: string[];
}

export interface CartData {
    sessionId: string;
    items: CartItemData[];
    total_price: number;
}

export interface ProductDocument {
    product_id: number;
    description: string[];
    price: number;
    name: string;
    quantity: number;
    minimum_order_quantity: number | null;
    wholesale_price: number | null;
    categories: string[];
    search_tags: string[];
    characteristics: any[];
    image_urls: string[];
    inStock: boolean;
}

export interface ProductData extends Omit<ProductDocument, "_id"> {
    _id: string;
}

export interface SessionData {
    _id?: string;
    sessionId: string;
    createdAt?: Date;
    expiresAt?: Date;
    lastActiveAt?: Date;
}

export interface FilterOptionData {
    _id: ObjectId | string;
    id: number;
    name: string;
}

export interface ContactInfo {
    phoneNumber: string;
    email: string;
}

export interface Address {
    street: string;
    city: string;
    region: string;
    postcode: string;
}

export interface OrderData {
    name: string;
    deliveryMethod: 'pickup' | 'courier';
    shippingCost: number;
    total: number;
    cartItems: CartItemData[];
    contactInfo: ContactInfo;
    comments?: string;
    address?: Address | null;
}

export interface OrderDetails extends OrderData {
    _id?: ObjectId | string;
    createdAt?: Date;
}
