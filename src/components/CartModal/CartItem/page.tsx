import * as React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateItemInCartQuantityUseCase } from '@/use-cases/cartUseCases';

interface CartItemProps {
  cartItem: CartItemData;
  onQuantityChange: (productId: number, quantity: number) => void;
}

interface CartItemData {
    productId: number;
    price: number;
    quantity: number;
    image: string;
    name: string;
    description: string;
  }


const CartItem: React.FC<CartItemProps> = ({ cartItem, onQuantityChange }) => {
    const handleQuantityChange = async (change: number) => {
      const updatedCart = await updateItemInCartQuantityUseCase(cartItem.productId, change);
      onQuantityChange(cartItem.productId, change);
    };

    return (
        <div className="grid gap-4">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <img
                  src={cartItem.image}
                  alt="Product Image"
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="grid gap-1">
                  <h4 className="font-medium">{cartItem.name}</h4>
                  {/* <p className="text-sm text-muted-foreground">{cartItem.description}</p> */}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleQuantityChange(-1)}>
                    <MinusIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                  <span>{cartItem.quantity}</span>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleQuantityChange(1)}>
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
              </div>
        </div>
    );
}

export default CartItem;