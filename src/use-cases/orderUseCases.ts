import { createOrder, getOrderById } from "@/data-access/orderRepository";
import { OrderData, OrderDetails } from "@/interfaces/interfaces";
import { sendEmail } from "@/lib/sendEmail";

/**
 * Place a new order.
 * This function handles all business logic before and after creating an order.
 * @param orderData - The data for the new order.
 * @returns The created order document.
 */
export async function placeOrderUseCase(orderData: OrderData): Promise<OrderDetails> {
    // Here you can add additional business logic, such as:
    // - Checking inventory
    // - Applying discounts
    // - Calculating taxes

    // For simplicity, we'll directly create the order
    console.log("🛒 Placing order...");
    const newOrder = await createOrder(orderData);
    console.log("✅ Order placed successfully!");
    // Post-processing logic can be added here, such as sending confirmation emails
    console.log("📧 Sending email...1");
    const email = await sendEmail(newOrder);

    return newOrder;
}

/**
 * Retrieve an order by its ID.
 * @param orderId - The unique identifier of the order.
 * @returns The order document or null if not found.
 */
export async function getOrderUseCase(orderId: string): Promise<OrderDetails | null> {
    const order = await getOrderById(orderId);
    return order;
}