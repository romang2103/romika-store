"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";
import { CartItemData } from "@/interfaces/interfaces";
import CartItem from "@/components/CartModal/CartItem/page";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { placeOrderUseCase } from "@/use-cases/orderUseCases";
import { LoadingSpinner } from "@/components/ui/spinner";
import { clear } from "console";
import { clearCart } from "@/data-access/cartRepository";

const CheckoutPage = () => {
  const { CartItems, CartTotal, updateItemInCartQuantity, loadCart, clearCart} = useCartStore();
  const router = useRouter();

  // State variables for delivery method and costs
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'courier'>("pickup");
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(CartTotal);
  const [loading, setLoading] = useState(true);

  // State variables for form inputs
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postcode, setPostcode] = useState("");
  
  // State variables for comments
  const [pickupComment, setPickupComment] = useState("");
  const [courierComment, setCourierComment] = useState("");

  // State variables for submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to load the cart data on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      loadCart();
      setLoading(false);
    };

    fetchCartData();
  }, []);

  // Effect to update the total when CartTotal or shippingCost changes
  useEffect(() => {
    setTotal(CartTotal + shippingCost);
  }, [CartTotal, shippingCost]);

  const handleDeliveryMethodChange = (value: 'pickup' | 'courier') => {
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
  
  // // Debounced submission handler to prevent rapid multiple submissions
  // const debouncedHandlePlaceOrder = useCallback(
  //   debounce(() => {
  //     handlePlaceOrder();
  //   }, 500), // 500ms debounce interval
  //   [handlePlaceOrder]
  // );

  // Inside your CheckoutPage component
  useEffect(() => {
    console.log("Submitting state changed to:", submitting);
  }, [submitting]);

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (deliveryMethod === "courier") {
      if (!street || !city || !region || !postcode) {
        setError("Please fill out all address fields for courier delivery.");
        return;
      }
    }

    // Prevent submission if already submitting
    if (submitting) {
      return;
    }

    // Prepare order data
    const orderData = {
      name,
      deliveryMethod,
      shippingCost,
      total,
      cartItems: CartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        name: item.name,
        description: item.description,
      })),
      contactInfo: {
        phoneNumber,
        email,
      },
      comments: deliveryMethod === "pickup" ? pickupComment : courierComment,
      address: deliveryMethod === "courier" ? {
        street,
        city,
        region,
        postcode,
      } : null,
    };
    setSubmitting(true);
    setError(null);


    try {
      const order = await placeOrderUseCase(orderData);
      router.push(`/pages/order-confirmation?orderId=${order._id}`);
      clearCart();
    } catch (error) {
      setError("An error occurred while placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedCartTotal = CartTotal.toFixed(2);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Оформлению заказа</h1>
      {loading ? (
        <LoadingSpinner/>
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
              {/* Delivery Method */}
              <div className="grid gap-2">
                <Label htmlFor="delivery-method">Метод доставки</Label>
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

              {/* Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Contact Information */}
              <div className="grid gap-2">
                <Label htmlFor="phone-number">Телефон:</Label>
                <Input
                  id="phone-number"
                  placeholder="+375 (__) ___-__-__"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Электронная почта</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Address Fields */}
              {deliveryMethod === "courier" && (
                <div className="grid gap-2">
                  <Label htmlFor="address">Адрес</Label>
                  <div className="grid gap-2">
                    <Input
                      id="street"
                      placeholder="Адрес улицы"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                    <div className="grid gap-2">
                      <Input
                        id="city"
                        placeholder="Город"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Input
                        id="region"
                        placeholder="Область"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Input
                        id="postcod"
                        placeholder="Почтовый индекс"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Comment Sections */}
              {deliveryMethod === "pickup" && (
                <div className="grid gap-2">
                  <Label htmlFor="pickup-comment">Комментарий (самовывоз)</Label>
                  <Textarea
                    id="pickup-comment"
                    placeholder="Add any comments for your pickup..."
                    value={pickupComment}
                    onChange={(e) => setPickupComment(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
              {deliveryMethod === "courier" && (
                <div className="grid gap-2">
                  <Label htmlFor="courier-comment">Комментарий (курьер)</Label>
                  <Textarea
                    id="courier-comment"
                    placeholder="Add any comments for your courier delivery..."
                    value={courierComment}
                    onChange={(e) => setCourierComment(e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {/* Order Summary */}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Промежуточную сумму</p>
                <p className="font-medium">{formattedCartTotal} руб</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Доставка</p>
                <p className="font-medium">{shippingCost.toFixed(2)} руб</p>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">К оплате</p>
                <p className="text-lg font-medium">{total.toFixed(2)} руб</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 text-red-700 bg-red-100 rounded">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-2">
              <Button variant="outline" onClick={() => { router.push('/') }}>Продолжить покупки</Button>
              <Button onClick={handlePlaceOrder} disabled={submitting}>
                {submitting ? <LoadingSpinner/> : "Подтвердить заказ" }
              </Button>
            </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
