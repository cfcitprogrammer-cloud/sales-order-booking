import { create } from "zustand";

const useCustomerStore = create((set) => ({
  customerInfo: {
    storeName: "",
    location: "",
    customerName: "",
    contactPerson: "",
    deliveryDate: "",
    remarks: "",
  },

  setCustomerInfo: (key, value) =>
    set((state) => ({
      customerInfo: {
        ...state.customerInfo,
        [key]: value,
      },
    })),

  // Add a function to clear/reset customer info
  clearCustomerInfo: () =>
    set({
      customerInfo: {
        storeName: "",
        location: "",
        customerName: "",
        contactPerson: "",
        deliveryDate: "",
        remarks: "",
      },
    }),
}));

export default useCustomerStore;
