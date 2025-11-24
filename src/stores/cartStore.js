// src/stores/cartStore.js
import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((product) => product.id !== productId),
    })),
  updateQuantity: (productId, qty) =>
    set((state) => ({
      cart: state.cart.map((product) =>
        product.id === productId ? { ...product, qty } : product
      ),
    })),
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
