"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { XIcon, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import CartItem from "./CartItem/page";
import { useCartStore } from "@/store/useCartStore";
import { CartItemData } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import { isCartValidUseCase } from "@/use-cases/cartUseCases";

interface CartModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen }) => {
  const router = useRouter();
  const { CartItems, CartTotal, updateItemInCartQuantity, loadCart, isCartModalOpen, closeCartModal } =
    useCartStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen, loadCart]);

  const handleQuantityChange = async (productId: number, change: number) => {
    updateItemInCartQuantity(productId, change);
  };

  const handleCheckout = async () => {
    const isCartValid = await isCartValidUseCase();
    if (isCartValid) {
      router.push("/pages/checkout");
    } else {
      alert("Your cart is empty!");
    }
  };

  return (
    <Sheet open={isCartModalOpen} onOpenChange={closeCartModal}>
      <SheetContent side="right" className="sm:max-w-sm">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-medium">My Cart</h3>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          {CartItems.length === 0 ? (
            <div className="border-t px-6 py-16">
              <div className="flex flex-col items-center justify-center gap-6">
                <ShoppingBag size={36} />
                <h2 className="text-lg font-bold">Your cart is empty</h2>
                <h4 className="text-sm text-muted-foreground font-medium text-center">
                  Looks like you haven't added any items to your cart yet.
                </h4>
                <div className="flex gap-2">
                  <SheetClose asChild>
                    <Button>Continue Shopping</Button>
                  </SheetClose>
                </div>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6 py-4">
                {CartItems.map((cartItem: CartItemData) => (
                  <CartItem
                    key={cartItem.productId}
                    cartItem={cartItem}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </ScrollArea>
              <div className="border-t px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{CartTotal.toFixed(2)} руб</span>
                </div>
                <Button className="w-full mt-4" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
