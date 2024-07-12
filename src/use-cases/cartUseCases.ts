import { addItemToCart, getCart, getItemInCart, updateItemInCartQuantity } from "@/data-access/cartRepository";
import { getSessionUseCase } from "./sessionUseCases";

interface ProductData {
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

interface CartItem {
    productId: number;
    price: number;
    quantity: number;
}

interface CartData {
    sessionId: string;
    items: CartItem[];
    totalPrice: number;
}

interface SessionData {
    sessionId: string;
}

// Add item to cart
export async function addItemToCartUseCase(product: ProductData, quantity: number) {
    // Get sessionId
    const session: SessionData | null = await getSessionUseCase();
    const sessionId = session?.sessionId || '';
    // Construct cart item
    const cartItem = { productId: product.product_id, price: product.price, quantity: quantity };
    // Check if cart already contains item
    const existingItem = await getItemInCart(sessionId, product.product_id);
    if (existingItem) {
        // Update quantity by 1
        await updateItemInCartQuantity(sessionId, product.product_id, 1);
    } else {
        // Add item to cart
        await addItemToCart(sessionId, cartItem);
    }
    // Return updated cart
    const updatedCart = getCart(sessionId);
    console.log('updatedCart: ', updatedCart);
    return updatedCart;
}

export async function updateItemInCartQuantityUseCase(product: ProductData, quantity: number) {
}



// Remove item from cart
export async function removeItemFromCartUseCase() {
    // Get user session using cookies
    // Get cart from session
    // Remove item from cart
    // Save cart to session
    // Return updated cart
}

// Clear cart
export async function clearCartUseCase() {
    // Get user session using cookies
    // Clear cart in session
    // Return empty cart
    // Save cart to session
    // Return updated cart
}

// Get cart
export async function getCartUseCase() {
    // Get user session using cookies
    const session: SessionData | null = await getSessionUseCase();
    // Get cart from session
    const cart = await getCart(session?.sessionId || '');
    return { cart: cart, sessionId: session?.sessionId };
}