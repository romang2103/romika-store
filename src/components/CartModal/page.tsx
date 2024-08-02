import React, { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { XIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import CartItem from "./CartItem/page";
import { useCartStore } from "@/store/useCartStore";
import { CartItemData } from "@/interfaces/interfaces";

interface CartModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onOpenChange }) => {
  const { CartItems, CartTotal, updateItemInCartQuantity, loadCart } = useCartStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen, loadCart]);

  const handleQuantityChange = async (productId: number, change: number) => {
    updateItemInCartQuantity(productId, change);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-sm">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Your Cart</h3>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
          <ScrollArea className="flex-1 px-6 py-4">
            {CartItems.map((cartItem: CartItemData) => (
            <CartItem key={cartItem.productId} cartItem={cartItem} onQuantityChange={handleQuantityChange}/>))}
          </ScrollArea>
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">${CartTotal}</span>
            </div>
            <Button className="w-full mt-4">Proceed to Checkout</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
