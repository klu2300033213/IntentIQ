import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, addToCart } = useShop();

  if (wishlist.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF0F0', border: '1px solid #FFCDD2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Heart size={40} color="#E53935" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Your wishlist is empty</h2>
        <p style={{ fontSize: 14, color: '#878787', marginBottom: 24 }}>Save items you love by tapping the heart icon on any product.</p>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#2874F0', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          <Sparkles size={16} /> Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={24} color="#E53935" fill="#E53935" />
            My Wishlist
          </h1>
          <p style={{ fontSize: 13, color: '#878787', marginTop: 4 }}>{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => wishlist.forEach(p => addToCart(p))}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#2874F0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
        >
          <ShoppingBag size={16} /> Add All to Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
