import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePaginationStore = create(
  persist(
    (set) => ({
      page: 1,
      totalPages: 1,
      setPage: (newPage) => set({ page: newPage }),
      setTotalPages: (total) => set({ totalPages: total }),
    }),
    {
      name: "orders-pagination", // key in localStorage
      partialize: (state) => ({ page: state.page }), // only persist current page
    },
  ),
);
