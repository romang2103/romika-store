import {
  addItemToCartUseCase,
  clearCartUseCase,
  getCartItemsUseCase,
  getCartUseCase,
  updateItemInCartQuantityUseCase,
} from "@/use-cases/cartUseCases";
import { getSessionUseCase } from "@/use-cases/sessionUseCases";
import { create } from "zustand";
import { CartItemData, ProductData } from "@/interfaces/interfaces";

interface CartState {
  CartItems: CartItemData[];
  CartTotal: number;
  isCartModalOpen: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
  addItemToCart: (item: ProductData) => void;
  updateItemInCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  CartItems: [],
  CartTotal: 0,
  isCartModalOpen: false,
  openCartModal: () => set(() => ({ isCartModalOpen: true })),
  closeCartModal: () => set(() => ({ isCartModalOpen: false })),
  addItemToCart: async (item) => {
    const existingItems = await getCartItemsUseCase();

    const itemExists = existingItems.some(
      (existingItem) => existingItem.productId === item.product_id,
    );

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
    set({ CartItems: updatedCart?.items ?? [], CartTotal: updatedCart?.total_price ?? 0 });
  },

  clearCart: async () => {
    await clearCartUseCase();

    set({ CartItems: [], CartTotal: 0 });
  },
  loadCart: async () => {
    const cart = await getCartUseCase();
    set({ CartItems: cart?.items ?? [], CartTotal: cart?.total_price ?? 0 });
  },
}));
