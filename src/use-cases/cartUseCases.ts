import { addItemToCart, clearCart, getCart, getItemInCart, updateItemInCartQuantity } from "@/data-access/cartRepository";
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
    image: string;
    name: string;
    description: string;
}

interface CartData {
    sessionId: string;
    items: CartItem[];
    total_price: number;
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
    const cartItem = { productId: product.product_id, name: product.name, description: product.description, price: product.price, quantity: quantity, image: product.image_urls[0] };
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
    const updatedCart = await getCart(sessionId);
    console.log('updatedCart: ', updatedCart);
    return updatedCart;
}

// Used to add and remove items inside the cart modal
export async function updateItemInCartQuantityUseCase(productId: number, quantity: number) {
    // Get user session using cookies
    console.log("Updating item quantity...");
    const session: SessionData | null = await getSessionUseCase();
    // Get cart from session
    const sessionId = session?.sessionId || '';
    // Update item in cart
    await updateItemInCartQuantity(sessionId, productId, quantity);
    // Return updated cart
    const updatedCart = await getCart(sessionId);
    console.log('updatedCart: ', updatedCart);
    return updatedCart;
}

// Clear cart
export async function clearCartUseCase() {
    // Get user session using cookies
    const session: SessionData | null = await getSessionUseCase();
    // Get cart from session
    const sessionId = session?.sessionId || '';
    // Clear cart in session
    await clearCart(sessionId);
    // Return updated cart ?? Do I need to do this?
    // const updatedCart = await getCart(sessionId);
    // return updatedCart
}

// Get cart
export async function getCartUseCase() {
    // Get user session using cookies
    const session: SessionData | null = await getSessionUseCase();
    // Get cart from session
    const cart = await getCart(session?.sessionId || '');
    // return { cart: cart, sessionId: session?.sessionId };
    return cart;
}

export async function getCartItemsUseCase() {
    // Get user session using cookies
    const session: SessionData | null = await getSessionUseCase();
    // Get cart from session
    const cart  = await getCartUseCase();
    // Return cart items if cart is not null
    return cart ? cart?.items : [];
}