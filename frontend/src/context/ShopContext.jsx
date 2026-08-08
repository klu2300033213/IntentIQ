import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

const ShopContext = createContext();

function loadUser() {
  try { return JSON.parse(localStorage.getItem('nexora-user')) || null; } catch { return null; }
}
function loadOrders() {
  try { return JSON.parse(localStorage.getItem('nexora-orders')) || []; } catch { return []; }
}
function loadCart() {
  try { return JSON.parse(localStorage.getItem('nexora-cart')) || []; } catch { return []; }
}
function loadWishlist() {
  try { return JSON.parse(localStorage.getItem('nexora-wishlist')) || []; } catch { return []; }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [wishlist, setWishlist] = useState(loadWishlist);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [orders, setOrders] = useState(loadOrders);
  const [user, setUser] = useState(loadUser);
  const [authModal, setAuthModal] = useState(null);

  useEffect(() => {
    let sid = localStorage.getItem('nexora-session-id');
    if (!sid) {
      sid = 'sess-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('nexora-session-id', sid);
    }
  }, []);

  // Persist cart & wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nexora-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nexora-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);


  // ── Auth ──
  const login = useCallback((userData) => {
    const u = { ...userData, loggedIn: true, avatar: userData.name?.charAt(0).toUpperCase() };
    setUser(u);
    localStorage.setItem('nexora-user', JSON.stringify(u));
    setAuthModal(null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('nexora-user');
  }, []);

  const openLogin = useCallback(() => setAuthModal('login'), []);
  const openRegister = useCallback(() => setAuthModal('register'), []);
  const closeAuth = useCallback(() => setAuthModal(null), []);

  // ── Cart ──
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    apiService.trackEvent('ADD_TO_CART', product.id, product.category).catch(() => {});
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) =>
      prev.map((item) => item.product.id === productId ? { ...item, quantity } : item)
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Wishlist ──
  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      apiService.trackEvent('WISHLIST', product.id, product.category).catch(() => {});
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((productId) => wishlist.some((p) => p.id === productId), [wishlist]);

  // ── Recently Viewed ──
  const addRecentlyViewed = useCallback((product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 12);
    });
    apiService.trackEvent('VIEW', product.id, product.category).catch(() => {});
  }, []);

  // ── Orders ──
  const placeOrder = useCallback(({ address, paymentMethod, paymentDetails }) => {
    const orderId = 'NX' + Date.now().toString().slice(-8).toUpperCase();
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + (Math.random() > 0.5 ? 3 : 5));

    const newOrder = {
      id: orderId,
      items: cart.map(item => ({ ...item })),
      address,
      paymentMethod,
      paymentDetails,
      total: cartTotal,
      discount: cartMrp - cartTotal,
      deliveryDate: delivery.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
      placedAt: new Date().toISOString(),
      status: 'ORDERED',
      statusHistory: [
        { status: 'ORDERED', label: 'Order Placed', date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), done: true },
        { status: 'PACKED',  label: 'Packed',       date: null, done: false },
        { status: 'SHIPPED', label: 'Shipped',       date: null, done: false },
        { status: 'DELIVERED',label: 'Delivered',    date: delivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), done: false },
      ],
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('nexora-orders', JSON.stringify(updatedOrders));
    clearCart();
    return newOrder;
  }, [cart, orders, clearCart]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartMrp   = cart.reduce((acc, item) => acc + (item.product.oldPrice || item.product.price) * item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = cartMrp - cartTotal;

  return (
    <ShopContext.Provider value={{
      cart, wishlist, recentlyViewed, orders,
      user, authModal,
      login, logout, openLogin, openRegister, closeAuth,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleWishlist, isInWishlist,
      addRecentlyViewed,
      placeOrder,
      cartCount, cartMrp, cartTotal, cartDiscount,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
