interface ProductData {
    _id: any;
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

export async function addItemToCartUseCase(product: ProductData) {
    // Add item to cart
    // Get user session using cookies
    // Get cart from session
    // Add item to cart
    // Save cart to session
    // Return updated cart
}

export async function removeItemFromCartUseCase() {
    // Remove item from cart
    // Get user session using cookies
    // Get cart from session
    // Remove item from cart
    // Save cart to session
    // Return updated cart
}

export async function clearCartUseCase() {
    // Clear cart
    // Get user session using cookies
    // Clear cart in session
    // Return empty cart
    // Save cart to session
    // Return updated cart
}

export async function getCartUseCase() {
    // Get cart
    // Get user session using cookies
    // Get cart from session
}