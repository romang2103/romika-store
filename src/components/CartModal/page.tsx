import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { XIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { getCartItemsUseCase, getCartUseCase, updateItemInCartQuantityUseCase } from "@/use-cases/cartUseCases";
import CartItem from "./CartItem/page";
import { on } from "events";

interface CartModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface CartItemData {
  productId: number;
  price: number;
  quantity: number;
  image: string;
  name: string;
  description: string;
}

interface CartData {
  sessionId: string;
  items: CartItemData[];
  total_price: number;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onOpenChange }) => {
  const [CartItems, setCartItems] = useState<CartItemData[]>([]);
  const [CartTotal, setCartTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadCartItems() {
      try {
        console.log("Loading cart items...");
        const data = await getCartItemsUseCase();
        setCartItems(data);
        const cart = await getCartUseCase() as CartData | null;
        console.log("Cart: ", cart);
        if (cart) {
          console.log('Cart: ', cart);
          setCartTotal(cart.total_price);
        }

      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    }
    console.log("Set CartItems: ", CartItems);
    loadCartItems();
  }, []);

  const handleQuantityChange = async (productId: number, change: number) => {
    try {
      const updatedCart = await updateItemInCartQuantityUseCase(productId, change) as CartData | null;
      if (updatedCart) {
        console.log("Updated Cart Modal: ", updatedCart);
        setCartItems(updatedCart.items);
        setCartTotal(updatedCart.total_price);
        console.log("Cart updated: ", CartTotal);
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
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
