import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartItem } from "./interfaces/ICartItem.interface";

interface ICurrentRecord {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  unit_amount: number | null;
  description: string | null;
  trackArr: string[];
}

interface ICartStore {
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  totalRecords: number;
  currentRecord: ICurrentRecord | null;
  cartItems: ICartItem[];
  totalPrice: number;
  paymentIntentId: string;

  setCurrentRecord: (record: ICurrentRecord) => void;
  toggleCartView: () => void;
  toggleCheckoutView: (val: boolean) => void;
  setPaymentIntentId: (id: string) => void;
  addRecord: (record: ICartItem) => void;
  removeRecord: (itemId: string, price: number) => void;
  clearCart: () => void;
}

const useCartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      isCartOpen: false,
      isCheckoutOpen: false,
      currentRecord: null,
      cartItems: [],
      totalRecords: 0,
      totalPrice: 0,
      paymentIntentId: "",

      setCurrentRecord: (record) => set(() => ({ currentRecord: record })),
      toggleCartView: () => set((store) => ({ isCartOpen: !store.isCartOpen })),
      toggleCheckoutView: (val) => set(() => ({ isCheckoutOpen: val })),
      setPaymentIntentId: (id) => set(() => ({ paymentIntentId: id })),
      addRecord: (record) =>
        set((store) => ({
          cartItems: [...store.cartItems, record],
          totalRecords: store.totalRecords + 1,
          totalPrice: store.totalPrice + record.unit_amount,
        })),
      removeRecord: (itemId, price) =>
        set((store) => ({
          cartItems: store.cartItems.filter((item) => item.id !== itemId),
          totalRecords: store.totalRecords - 1,
          totalPrice: store.totalPrice - price,
        })),
      clearCart: () =>
        set(() => ({ cartItems: [], totalRecords: 0, totalPrice: 0 })),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
