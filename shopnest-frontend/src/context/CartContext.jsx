import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    if (!user) {
      setCart({ items: [] }); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    let cancelled = false;
      setLoading(true);
    apiFetch('/cart')
      .then((data) => {
        if (!cancelled) setCart(data);
      })
      .catch(() => {
        if (!cancelled) setCart({ items: [] });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const prev = cartRef.current;
    const existing = prev.items.find(
      (item) => (item.product?._id || item.product) === productId
    );
    if (existing) {
      setCart({
        ...prev,
        items: prev.items.map((item) =>
          (item.product?._id || item.product) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      setCart({
        ...prev,
        items: [...prev.items, { product: { _id: productId }, quantity }],
      });
    }
    try {
      const data = await apiFetch('/cart', {
        method: 'POST',
        body: { productId, quantity },
      });
      setCart(data);
      return data;
    } catch (err) {
      setCart(prev);
      throw err;
    }
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const prev = cartRef.current;
    setCart({
      ...prev,
      items: prev.items.map((item) =>
        (item.product?._id || item.product) === productId
          ? { ...item, quantity }
          : item
      ),
    });
    try {
      const data = await apiFetch(`/cart/${productId}`, {
        method: 'PUT',
        body: { quantity },
      });
      setCart(data);
      return data;
    } catch (err) {
      setCart(prev);
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const prev = cartRef.current;
    setCart({
      ...prev,
      items: prev.items.filter(
        (item) => (item.product?._id || item.product) !== productId
      ),
    });
    try {
      const data = await apiFetch(`/cart/${productId}`, {
        method: 'DELETE',
      });
      setCart(data);
      return data;
    } catch (err) {
      setCart(prev);
      throw err;
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart({ items: [] });
  }, []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return { cart: { items: [] }, addToCart: async () => {}, updateQuantity: async () => {}, removeFromCart: async () => {}, clearCart: () => {}, itemCount: 0, loading: false };
  }
  return context;
}
