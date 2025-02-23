"use server"; // Ensures this runs only on the server

import nodemailer from "nodemailer";
import { OrderDetails } from "@/interfaces/interfaces";

// Email sender function
export async function sendEmail(order: OrderDetails): Promise<void> {
    try {
        console.log("📧 Sending email...");
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: false, // True for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_APP_PASS,
            },
        });

        const cartItemsText = order.cartItems.map(item => `${item.quantity} x ${item.name}`).join(", ");
        const mailOptions = {
            from: `"Romika" <${process.env.SMTP_USER}>`,
            to: order.contactInfo.email,
            subject: "Подтверждение заказа",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
                    <h2 style="color: #0073e6;">Спасибо за ваш заказ, ${order.name}!</h2>
                    <p>Ваш номер заказа: <strong>${order._id}</strong></p>
                    
                    <h3 style="color: #0073e6;">Детали заказа:</h3>
                    <ul style="list-style-type: none; padding: 0;">
                        ${order.cartItems.map(item => `
                            <li style="margin-bottom: 10px;">
                                <img src="${item.image}" alt="${item.name}" width="50" height="50" style="vertical-align: middle; margin-right: 10px;">
                                <strong>${item.quantity} x ${item.name}</strong>
                            </li>
                        `).join("")}
                    </ul>
                    
                    <p><strong>Итого: ${order.total.toFixed(2)} руб</strong></p>
                    <p>Метод доставки: <strong>${order.deliveryMethod === "pickup" ? "Самовывоз" : "Курьер"}</strong></p>
                    
                    <p>Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                    
                    <p><strong>Спасибо, что выбрали нас!</strong></p>
                    
                    <p style="margin-top: 20px;">Если у вас возникнут вопросы, свяжитесь с нами:</p>
                    <p>Телефон: <strong>+375 (29) 621-03-22</strong></p>
                    <p>Электронная почта: <strong><a href="mailto:romika.shop.by@gmail.com" style="color: #0073e6;">romika.shop.by@gmail.com</a></strong></p>
                    <p>Адрес: <strong>Г. Заславль, ул. Привокзальная 2/strong></p>
                    
                    <br>
                    <footer style="text-align: center; font-size: 12px; color: #888; margin-top: 30px;">
                        <p>&copy; 2025 Romika. Все права защищены.</p>
                    </footer>
                </div>
            `,
        };


        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}
