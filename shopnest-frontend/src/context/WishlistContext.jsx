import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setItems([]); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiFetch('/wishlist')
      .then((data) => {
        if (!cancelled) setItems(data.products || []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const toggleWishlist = useCallback(async (productId) => {
    const isInWishlist = items.some((p) => p._id === productId);
    const prev = items;
    if (isInWishlist) {
      setItems(items.filter((p) => p._id !== productId));
    } else {
      setItems([...items, { _id: productId }]);
    }
    try {
      if (isInWishlist) {
        const data = await apiFetch(`/wishlist/${productId}`, { method: 'DELETE' });
        setItems(data.products || []);
      } else {
        const data = await apiFetch('/wishlist', {
          method: 'POST',
          body: { productId },
        });
        setItems(data.products || []);
      }
    } catch {
      setItems(prev);
    }
  }, [items]);

  const itemCount = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, itemCount, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return { items: [], toggleWishlist: async () => {}, itemCount: 0, loading: false };
  }
  return context;
}
