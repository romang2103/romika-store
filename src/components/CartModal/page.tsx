import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { XIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { getCartItemsUseCase } from "@/use-cases/cartUseCases";
import CartItem from "./CartItem/page";


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

const CartModal: React.FC<CartModalProps> = ({ isOpen, onOpenChange }) => {
    const [CartItems, setCartItems] = useState<CartItemData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      async function loadCartItems() {
        try {
          const data = await getCartItemsUseCase();
          setCartItems(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      };
      console.log('Set CartItems: ', CartItems);
      loadCartItems();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    console.log('SEt CartItems: ', CartItems);
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
          <CartItem key={cartItem.productId} cartItem={cartItem} />
        ))}
        </ScrollArea>
        <div className="border-t px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium">$79.98</span>
        </div>
        <Button className="w-full mt-4">Proceed to Checkout</Button>
        </div>
      </div>
        </SheetContent>
      </Sheet>
    );
};

export default CartModal;