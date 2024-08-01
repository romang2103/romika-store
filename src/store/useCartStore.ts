import { addItemToCartUseCase, clearCartUseCase, getCartItemsUseCase, getCartUseCase, updateItemInCartQuantityUseCase } from '@/use-cases/cartUseCases';
import { getSessionUseCase } from '@/use-cases/sessionUseCases';
import { create } from 'zustand';
import { CartItem, ProductData } from '@/interfaces/interfaces';

interface CartState {
  CartItems: CartItem[];
  CartTotal: number;
  addItemToCart: (item: ProductData) => void;
  updateItemInCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  CartItems: [],
  CartTotal: 0,
  addItemToCart: async (item) => {
    const existingItems = await getCartItemsUseCase();

    const itemExists = existingItems.some((existingItem) => existingItem.productId === item.product_id);

    if (itemExists) {
      await updateItemInCartQuantityUseCase(item.product_id, 1);
    } else {
      await addItemToCartUseCase(item, 1);
    }

    const updatedCart = await getCartUseCase();
    set({ CartItems: updatedCart?.items, CartTotal: updatedCart?.total_price });
  },

  updateItemInCartQuantity: async (productId, quantity) => {
    await updateItemInCartQuantityUseCase(productId, quantity);

    const updatedCart = await getCartUseCase();
    set({ CartItems: updatedCart?.items, CartTotal: updatedCart?.total_price });
  },

  clearCart: async () => {
    await clearCartUseCase();

    set({ CartItems: [], CartTotal: 0 });
  },
  loadCart: async () => {
    const cart = await getCartUseCase();
    set({ CartItems: cart?.items, CartTotal: cart?.total_price });
  },
}));
