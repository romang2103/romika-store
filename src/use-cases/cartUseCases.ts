import { clearCart, createCart, getCart, getItemInCart, updateCart } from "@/data-access/cartRepository";
import { getSessionUseCase } from "./sessionUseCases";
import { CartData, CartItem, ProductData, SessionData } from "@/interfaces/interfaces";

// Add item to cart
export async function addItemToCartUseCase(product: ProductData, quantity: number) {
    const session: SessionData | null = await getSessionUseCase();
    const sessionId = session?.sessionId || '';
    console.log('sessionId: ', sessionId);

    let existingCart = await getCart(sessionId);
    if (!existingCart) {
        await createCart(sessionId);
        existingCart = await getCart(sessionId);
    }

    const existingItem = await getItemInCart(sessionId, product.product_id) as CartItem | null;
    console.log('existingItem: ', existingItem);
    let updatedCart;

    if (existingItem) {
        updatedCart = {
            ...existingCart!,
            items: existingCart!.items?.map(item =>
                item.productId === product.product_id ? { ...item, quantity: item.quantity + quantity } : item
            ),
            total_price: existingCart!.total_price + product.price * quantity
        };
    } else {
        const cartItem: CartItem = {
            productId: product.product_id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: quantity,
            image: product.image_urls[0]
        };

        updatedCart = {
            ...existingCart!,
            items: [...existingCart!.items, cartItem],
            total_price: existingCart!.total_price + cartItem.price * cartItem.quantity
        };
    }
    console.log(updatedCart);

    await updateCart(sessionId, updatedCart);

    const updatedCartData = await getCart(sessionId);
    console.log('updatedCart: ', updatedCartData);
    return updatedCartData;
}

// Used to add and remove items inside the cart modal
export async function updateItemInCartQuantityUseCase(productId: number, quantity: number) {
    const session: SessionData | null = await getSessionUseCase();
    const sessionId = session?.sessionId || '';
    
    const existingCart = await getCart(sessionId);
    if (!existingCart) throw new Error("Cart not found");

    let updatedCart: CartData;

    const existingItem = existingCart.items.find(item => item.productId === productId);
    if (!existingItem) throw new Error("Item not found in cart");

    if (existingItem.quantity + quantity <= 0) {
        updatedCart = {
            ...existingCart,
            items: existingCart.items.filter(item => item.productId !== productId),
            total_price: existingCart.total_price - existingItem.price * existingItem.quantity
        };
    } else {
        updatedCart = {
            ...existingCart,
            items: existingCart.items.map(item =>
                item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
            ),
            total_price: existingCart.total_price + existingItem.price * quantity
        };
    }

    await updateCart(sessionId, updatedCart);

    const updatedCartData = await getCart(sessionId);
    console.log('updatedCart: ', updatedCartData);
    return updatedCartData;
}

// Clear cart
export async function clearCartUseCase() {
    const session: SessionData | null = await getSessionUseCase();
    const sessionId = session?.sessionId || '';
    await clearCart(sessionId);
}

// Get cart
export async function getCartUseCase() {
    const session: SessionData | null = await getSessionUseCase();
    const cart = await getCart(session?.sessionId || '');
    return cart;
}

// Get cart items
export async function getCartItemsUseCase() {
    const cart = await getCartUseCase();
    return cart ? cart.items : [];
}
