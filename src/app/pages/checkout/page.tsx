"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/oKHKpRduajN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";
import { CartItemData } from "@/interfaces/interfaces";
import CartItem from "@/components/CartModal/CartItem/page";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CheckoutPage = () => {
  const { CartItems, CartTotal, updateItemInCartQuantity, loadCart } = useCartStore();
  const router = useRouter();  
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(CartTotal);
  const [loading, setLoading] = useState(true);

  // Effect to load the cart data on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      await loadCart();
      setLoading(false);
    };

    fetchCartData();
  }, []);

  // Effect to update the total when CartTotal or shippingCost changes
  useEffect(() => {
    setTotal(CartTotal + shippingCost);
  }, [CartTotal, shippingCost]);

  const handleDeliveryMethodChange = (value: string) => {
    setDeliveryMethod(value);

    if (value === "pickup") {
      setShippingCost(0);
    } else if (value === "courier") {
      setShippingCost(5);
    }
  };

  const handleQuantityChange = async (productId: number, change: number) => {
    updateItemInCartQuantity(productId, change);
  };

  const formattedCartTotal = CartTotal.toFixed(2);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      {loading ? (
         <p>Loading...</p> ) : (
            <>
      {CartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <ShoppingBag size={72} strokeWidth={1} />
          <h2 className="text-2xl font-bold text-center">Your cart is empty</h2>
          <p className="text-muted-foreground text-center">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => { router.push('/') }}>Go to Shop</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {CartItems.map((cartItem: CartItemData) => (
              <CartItem
                key={cartItem.productId}
                cartItem={cartItem}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          <Separator className="my-8" />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="delivery-method">Delivery Method</Label>
              <RadioGroup
                id="delivery-method"
                value={deliveryMethod}
                onValueChange={handleDeliveryMethodChange}
              >
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="pickup"
                    className="flex items-center gap-2 font-medium"
                  >
                    <RadioGroupItem id="pickup" value="pickup" />
                    Самовывоз (бесплатно)
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Удобный, бесплатный и быстрый способ получения заказа
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="courier"
                    className="flex items-center gap-2 font-medium"
                  >
                    <RadioGroupItem id="courier" value="courier" />
                    Автокурьер (5.00 руб)
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Удобный, платный и быстрый способ получения заказа
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <div className="grid gap-2">
                <Input id="address" placeholder="Street Address" />
                <div className="grid sm:grid-cols-2 gap-2">
                  <Input id="city" placeholder="City" />
                  <Input id="state" placeholder="State/Region" />
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Input id="zip" placeholder="Zip/Postal Code" />
                  <Input id="country" placeholder="Country" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="font-medium">{formattedCartTotal} руб</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Shipping</p>
              <p className="font-medium">{shippingCost.toFixed(2)} руб</p> {/* Include currency symbol */}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">Total</p>
              <p className="text-lg font-medium">{total.toFixed(2)} руб</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-2">
            <Button variant="outline" onClick={() => {router.push('/')}}>Continue Shopping</Button>
            <Button>Place Order</Button>
          </div>
        </>
      )}
      </>
        )}
    </div>
  );
};

export default CheckoutPage;
