import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Profile from './pages/Profile';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  return (
    <ShopProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
        </Routes>
      </Router>
    </ShopProvider>
  );
}
