// import { create } from "zustand";

// const useCartStore = create((set) => ({
//   cart: [],

//   // Add item to the cart
//   addToCart: (product) =>
//     set((state) => ({
//       cart: [...state.cart, product],
//     })),

//   // Remove item from the cart
//   removeFromCart: (productId) =>
//     set((state) => ({
//       cart: state.cart.filter((product) => product.id !== productId),
//     })),

//   // Update the quantity of a cart item
//   updateQuantity: (productId, qty) =>
//     set((state) => ({
//       cart: state.cart.map((product) =>
//         product.id === productId ? { ...product, qty } : product
//       ),
//     })),

//   // Update the price of a specific cart item
//   updateCartItemPrice: (index, updatedItem) =>
//     set((state) => {
//       const newCart = [...state.cart];
//       newCart[index] = updatedItem; // Update the item at the specific index
//       return { cart: newCart };
//     }),

//   // Update the entire cart with a new array of items
//   updateCart: (newCart) =>
//     set(() => ({
//       cart: newCart, // Replace the current cart with the new one
//     })),

//   // Clear all items from the cart
//   clearCart: () => set({ cart: [] }),
// }));

// export default useCartStore;

import { create } from "zustand";

const generateId = () => Math.random().toString(36).slice(2);

const useCartStore = create((set) => ({
  cart: [],

  // Add item to the cart (each entry gets unique cartId)
  addToCart: (product) =>
    set((state) => ({
      cart: [
        ...state.cart,
        {
          ...product,
          cartId: generateId(), // unique ID per cart item
        },
      ],
    })),

  // Remove a single specific item from the cart
  removeFromCart: (cartId) =>
    set((state) => {
      console.log(state);
      console.log(cartId);
      return {
        cart: state.cart.filter((item) => item.cartId !== cartId),
      };
    }),

  // Update quantity of a specific cart item
  updateQuantity: (cartId, qty) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartId === cartId ? { ...item, qty } : item
      ),
    })),

  // Update price of a specific cart item using index (still allowed)
  updateCartItemPrice: (index, updatedItem) =>
    set((state) => {
      const newCart = [...state.cart];
      newCart[index] = updatedItem;
      return { cart: newCart };
    }),

  // Replace entire cart
  updateCart: (newCart) =>
    set(() => ({
      cart: newCart,
    })),

  // Clear all cart items
  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
