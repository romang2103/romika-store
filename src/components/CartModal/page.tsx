import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { XIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface CartModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onOpenChange }) => {
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
            <div className="grid gap-4">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <img
                  src="/placeholder.svg"
                  alt="Product Image"
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="grid gap-1">
                  <h4 className="font-medium">Cozy Blanket</h4>
                  <p className="text-sm text-muted-foreground">Warm and Soft for Chilly Nights</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MinusIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                  <span>1</span>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <img
                  src="/placeholder.svg"
                  alt="Product Image"
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="grid gap-1">
                  <h4 className="font-medium">Autumn Mug</h4>
                  <p className="text-sm text-muted-foreground">Enjoy Your Hot Beverages in Style</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MinusIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                  <span>1</span>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
              </div>
            </div>
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