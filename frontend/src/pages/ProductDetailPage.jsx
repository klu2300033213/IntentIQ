import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart, ShoppingCart, Sparkles, Star, Truck, ShieldCheck,
  ArrowLeft, BadgeCheck, Plus, Minus, Lock, CheckCircle2,
  Share2, Eye
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { apiService } from '../services/apiService';
import { getProductImage } from '../data/products';
import ProductCard from '../components/ProductCard';

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [xai, setXai] = useState(null);
  const [added, setAdded] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useShop();

  useEffect(() => {
    setLoading(true);
    setSelectedImg(0);
    setAdded(false);

    apiService.getProductById(id).then((p) => {
      if (p) {
        setProduct(p);
        addRecentlyViewed(p);
        apiService.getExplainableMatch(p.id).then(setXai);
        apiService.getProducts({ category: p.category }).then((list) => {
          if (list) setRelated(list.filter(i => i.id !== p.id).slice(0, 8));
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div style={{ height: 400, background: '#E0E0E0', borderRadius: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ height: 24, width: '30%', background: '#E0E0E0', borderRadius: 6 }} />
            <div style={{ height: 40, width: '80%', background: '#E0E0E0', borderRadius: 6 }} />
            <div style={{ height: 60, width: '100%', background: '#E0E0E0', borderRadius: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Sparkles size={36} color="#2874F0" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E' }}>Product Not Found</h2>
        <p style={{ fontSize: 14, color: '#878787', marginTop: 8 }}>This product doesn't exist in our AI catalog database.</p>
        <button onClick={() => navigate('/products')} style={{ marginTop: 24, padding: '12px 24px', background: '#2874F0', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    );
  }

  const img = product.image || getProductImage(product);
  const imgList = (product.images && product.images.length > 0) ? product.images : [img, img, img, img];
  const isWish = isInWishlist(product.id);
  const reasons = xai?.matchReasons || [
    'Matches active browsing intent in your current session',
    'High affinity via Two-Tower Neural Embedding similarity',
    'Frequently co-purchased by users with matching taste profile',
    `Vector similarity score: ${((product.aiScore || 96) / 100).toFixed(3)} — Top 2% of catalog`,
  ];

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#424553', cursor: 'pointer', marginBottom: 20 }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>
        {/* Gallery */}
        <div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 16, overflow: 'hidden', aspectRatio: '1/1', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <img
              src={imgList[selectedImg] || img}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = img; }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
            {imgList.slice(0, 4).map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i)}
                style={{
                  aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden',
                  border: selectedImg === i ? '2px solid #2874F0' : '1px solid #E8E8E8',
                  background: '#FFFFFF', cursor: 'pointer', padding: 0,
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = img; }} />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Brand + actions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2874F0', margin: 0 }}>{product.brand}</p>
              <p style={{ fontSize: 12, color: '#878787', marginTop: 2, margin: 0 }}>{product.category}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied!');
                }}
                style={{ width: 38, height: 38, borderRadius: 8, background: '#FFFFFF', border: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#424553' }}
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: 38, height: 38, borderRadius: 8,
                  background: isWish ? '#FFF0F0' : '#FFFFFF',
                  border: isWish ? '1px solid #FFCDD2' : '1px solid #E8E8E8',
                  color: isWish ? '#E53935' : '#424553',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <Heart size={16} fill={isWish ? '#E53935' : 'none'} />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1A1A2E', margin: 0, lineHeight: 1.3 }}>{product.name}</h1>
          <p style={{ fontSize: 13, color: '#878787', margin: 0, lineHeight: 1.6 }}>{product.description}</p>

          {/* Rating + stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 8, padding: '4px 10px' }}>
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#F57C00' }}>{Number(product.rating || 4.8).toFixed(1)}</span>
              <span style={{ fontSize: 11, color: '#878787' }}>({(product.reviews || 1240).toLocaleString()} reviews)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 8, padding: '4px 10px' }}>
              <CheckCircle2 size={13} color="#2E7D32" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32' }}>{product.stock || 'In Stock'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#EEF4FF', border: '1px solid #C7D8FA', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#2874F0' }}>
              <Eye size={12} color="#2874F0" />
              <span>142 viewing now</span>
            </div>
          </div>

          {/* Price box */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: '#1A1A2E' }}>₹{(product.price || 1999).toLocaleString()}</span>
              {product.oldPrice && (
                <span style={{ fontSize: 16, color: '#878787', textDecoration: 'line-through' }}>₹{product.oldPrice.toLocaleString()}</span>
              )}
              <span style={{ background: '#388E3C', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                {product.discount || 18}% OFF
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#878787', marginTop: 8 }}>
              <Truck size={14} color="#2874F0" />
              <span style={{ color: '#1A1A2E', fontWeight: 600 }}>{product.delivery || 'Free Express Delivery'}</span>
              · 30-day returns & replacement
            </div>
          </div>

          {/* Quantity + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 8, padding: 2 }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ width: 34, height: 34, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#424553' }}
              >
                <Minus size={14} />
              </button>
              <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 800, color: '#1A1A2E' }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{ width: 34, height: 34, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#424553' }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                flex: 1, minWidth: 160, padding: '12px 24px', borderRadius: 8,
                background: added ? '#388E3C' : '#2874F0', color: 'white',
                border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s',
              }}
            >
              <ShoppingCart size={17} />
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
          </div>

          {/* XAI Card */}
          <div style={{ background: '#EEF4FF', border: '1px solid #C7D8FA', borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 800, color: '#2874F0' }}>
                <Sparkles size={16} /> Explainable AI Match
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: '#2E7D32', background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '2px 8px', borderRadius: 12 }}>
                <Lock size={10} /> DPDP Certified
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reasons.map((r, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#424553', lineHeight: 1.5 }}>
                  <BadgeCheck size={15} color="#2874F0" style={{ flexShrink: 0, marginTop: 2 }} />
                  {r}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #C7D8FA', paddingTop: 10 }}>
              <span style={{ fontSize: 11, color: '#878787', fontWeight: 600 }}>Two-Tower × NCF AI Affinity Score</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 6, borderRadius: 99, background: '#E0E0E0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: '#2874F0', width: `${product.aiScore || 96}%` }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#2874F0' }}>{product.aiScore || 96}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1A1A2E', marginBottom: 4 }}>More in {product.category}</h2>
          <p style={{ fontSize: 13, color: '#878787', marginTop: 0, marginBottom: 16 }}>AI-matched products from same category</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
