import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getProductImage } from '../data/products';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartMrp, cartTotal, cartDiscount, cartCount } = useShop();
  const navigate = useNavigate();

  const delivery = cartTotal > 499 ? 0 : 49;
  const platformFee = 20;
  const finalTotal = cartTotal + delivery + platformFee;
  const totalSavings = cartDiscount + (delivery === 0 ? 49 : 0);

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF4FF', border: '1px solid #C7D8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <ShoppingBag size={40} color="#2874F0" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ fontSize: 14, color: '#878787', marginBottom: 24 }}>Looks like you haven't added anything yet. Explore our AI-curated catalog and find your next favourite.</p>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#2874F0', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          <Sparkles size={16} /> Shop with AI Discovery
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1A1A2E', margin: '0 0 4px' }}>My Cart</h1>
      <p style={{ fontSize: 13, color: '#878787', margin: '0 0 24px' }}>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* ── Cart Items ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Delivery Banner */}
          {cartTotal < 499 && (
            <div style={{ borderRadius: 10, background: '#EEF4FF', border: '1px solid #C7D8FA', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#2874F0' }}>
              <Truck size={18} color="#2874F0" style={{ flexShrink: 0 }} />
              <div>
                Add <strong>₹{(499 - cartTotal).toFixed(0)}</strong> more for <strong>FREE delivery</strong>
              </div>
            </div>
          )}

          {cart.map(({ product, quantity }) => (
            <article key={product.id} style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E8E8E8', padding: 16, display: 'flex', gap: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              {/* Image */}
              <Link to={`/product/${product.id}`} style={{ flexShrink: 0 }}>
                <div style={{ width: 100, height: 100, borderRadius: 8, overflow: 'hidden', background: '#F8F9FA' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getProductImage(product);
                    }}
                  />
                </div>
              </Link>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#878787', margin: 0 }}>{product.brand}</p>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', margin: '2px 0 0', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
                    </Link>
                    <p style={{ fontSize: 11, color: '#878787', marginTop: 2, margin: 0 }}>{product.category}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    style={{ padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#878787' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  {/* Qty */}
                  <div style={{ display: 'flex', alignItems: 'center', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, padding: 2 }}>
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{ width: 28, height: 28, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#424553' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#1A1A2E' }}>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      style={{ width: 28, height: 28, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#424553' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 900, color: '#1A1A2E', margin: 0 }}>₹{(product.price * quantity).toLocaleString()}</p>
                    {product.oldPrice && (
                      <p style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through', margin: 0 }}>₹{(product.oldPrice * quantity).toLocaleString()}</p>
                    )}
                    {product.discount > 0 && (
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#388E3C', margin: 0 }}>{product.discount}% off</p>
                    )}
                  </div>
                </div>

                {/* Delivery info */}
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#388E3C', fontWeight: 600 }}>
                  <Truck size={12} color="#388E3C" />
                  {product.delivery || 'Free delivery by tomorrow'}
                </div>
              </div>
            </article>
          ))}

          {/* Promo Banner */}
          <div style={{ borderRadius: 10, background: '#FFF8E1', border: '1px solid #FFE082', padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tag size={18} color="#F57C00" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#F57C00', margin: 0 }}>Apply a promo code at payment step</p>
              <p style={{ fontSize: 11, color: '#878787', margin: '2px 0 0' }}>Try INTENT10 for 10% off, FIRST for ₹200 off first order</p>
            </div>
          </div>
        </div>

        {/* ── Price Summary ── */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 20, border: '1px solid #E8E8E8', position: 'sticky', top: 90, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#878787', margin: '0 0 16px' }}>Price Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}>
                <span>Price ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                <span>₹{cartMrp.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#388E3C', fontWeight: 600 }}>
                <span>Discount</span>
                <span>− ₹{cartDiscount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}>
                <span>Delivery Charges</span>
                {delivery === 0
                  ? <span style={{ color: '#388E3C', fontWeight: 700 }}>FREE</span>
                  : <span>₹{delivery}</span>
                }
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}>
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>

              <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: '#1A1A2E' }}>
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {totalSavings > 0 && (
              <div style={{ marginTop: 16, borderRadius: 8, background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '10px 14px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#2E7D32', textAlign: 'center', margin: 0 }}>
                  🎉 You save ₹{totalSavings.toLocaleString()} on this order!
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              style={{
                width: '100%', marginTop: 20, padding: '14px', background: '#2874F0',
                color: 'white', border: 'none', borderRadius: 8, fontSize: 14,
                fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
              }}
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>

            {/* Trust badges */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: ShieldCheck, text: 'Safe & Secure Payments' },
                { icon: RotateCcw, text: 'Easy 30-day returns & exchange' },
                { icon: Truck, text: 'Free delivery on orders above ₹499' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#878787' }}>
                  <Icon size={14} color="#2874F0" style={{ flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
