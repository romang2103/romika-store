import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface CartModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onOpenChange }) => {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-sm">
                <div className="bg-white border-r p-4 md:p-8">
                    <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
                    <div className="space-y-3">
                        {[
                            { id: "category-4", label: "Item 3" },
                            { id: "category-5", label: "Item 2" },
                        ].map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox id={category.id} />
                                <Label htmlFor={category.id}>{category.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CartModal;