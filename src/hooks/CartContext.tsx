import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types/product";
import {
  addItem,
  readCart,
  removeItem,
  saveCart,
  updateQuantity,
} from "../utils/cart";
interface CartContextValue {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  storageUnavailable: boolean;
}
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return readCart(window.localStorage);
    } catch {
      return [];
    }
  });
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    try {
      setStorageUnavailable(!saveCart(window.localStorage, items));
    } catch {
      setStorageUnavailable(true);
    }
  }, [items]);
  return (
    <CartContext.Provider
      value={{
        items,
        count: items.reduce((sum, item) => sum + item.quantity, 0),
        add: (item) => setItems((current) => addItem(current, item)),
        update: (key, quantity) =>
          setItems((current) => updateQuantity(current, key, quantity)),
        remove: (key) => setItems((current) => removeItem(current, key)),
        clear: () => setItems([]),
        storageUnavailable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("CartProvider required");
  return value;
}
