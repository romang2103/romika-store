import * as React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  cartItem: CartItemData;
}

interface CartItemData {
    productId: number;
    price: number;
    quantity: number;
    image: string;
    name: string;
    description: string;
  }


const CartItem: React.FC<CartItemProps> = ({ cartItem }) => {
    console.log('cartItem: ', cartItem);
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
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MinusIcon className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                  <span>{cartItem.quantity}</span>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Add</span>
                  </Button>
                </div>
              </div>
        </div>
    );
}

export default CartItem;