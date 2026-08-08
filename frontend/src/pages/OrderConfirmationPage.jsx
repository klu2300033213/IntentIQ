import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, MapPin, Clock, ShoppingBag } from 'lucide-react';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    navigate('/');
    return null;
  }

  const steps = order.statusHistory || [];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      {/* Success header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E8F5E9', border: '2px solid #A5D6A7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle2 size={44} color="#2E7D32" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1A1A2E', margin: '0 0 8px' }}>Order Placed Successfully! 🎉</h1>
        <p style={{ fontSize: 14, color: '#878787', maxWidth: 400, margin: '0 auto' }}>
          Your order has been confirmed and will be shipped soon.
        </p>
      </div>

      {/* Order details card */}
      <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8E8E8', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        {/* Order ID banner */}
        <div style={{ background: '#EEF4FF', borderBottom: '1px solid #C7D8FA', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#878787', margin: 0 }}>Order ID</p>
            <p style={{ fontSize: 18, fontWeight: 900, color: '#1A1A2E', fontFamily: 'monospace', margin: '2px 0 0' }}>{order.id}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#878787', margin: 0 }}>Expected Delivery</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#2E7D32', display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0 0' }}>
              <Truck size={16} /> {order.deliveryDate}
            </p>
          </div>
        </div>

        {/* Status timeline */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: '0 0 16px' }}>Order Status</p>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {steps.map((step, i) => (
              <div key={step.status} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${step.done ? '#388E3C' : '#E0E0E0'}`, background: step.done ? '#388E3C' : '#F8F9FA' }}>
                    {step.done ? <CheckCircle2 size={16} color="white" /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#BDBDBD' }} />}
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 700, marginTop: 6, margin: '6px 0 0', textAlign: 'center', color: step.done ? '#2E7D32' : '#9E9E9E' }}>
                    {step.label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, margin: '0 8px 16px', background: step.done ? '#388E3C' : '#E0E0E0' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: '0 0 16px' }}>Items Ordered</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {order.items?.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: '#F8F9FA', flexShrink: 0 }}>
                  <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{product.name}</p>
                  <p style={{ fontSize: 11, color: '#878787', marginTop: 2, margin: 0 }}>{product.brand} · Qty: {quantity}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E', margin: 0, flexShrink: 0 }}>₹{(product.price * quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address + Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #F0F0F0' }}>
          {order.address && (
            <div style={{ padding: '16px 24px', borderRight: '1px solid #F0F0F0' }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} color="#2874F0" /> Deliver to
              </p>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>{order.address.name}</p>
              <p style={{ fontSize: 12, color: '#878787', marginTop: 2, margin: 0, lineHeight: 1.5 }}>
                {order.address.line}, {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
            </div>
          )}
          <div style={{ padding: '16px 24px' }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} color="#2874F0" /> Payment
            </p>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', margin: 0, textTransform: 'uppercase' }}>{order.paymentMethod}</p>
            <p style={{ fontSize: 12, color: '#878787', marginTop: 2, margin: 0 }}>Total: ₹{order.total?.toLocaleString()}</p>
          </div>
        </div>

        {/* Total */}
        <div style={{ padding: '16px 24px', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#878787', margin: 0 }}>Order Total</p>
          <p style={{ fontSize: 20, fontWeight: 900, color: '#1A1A2E', margin: 0 }}>₹{order.total?.toLocaleString()}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Link
          to="/orders"
          style={{ flex: 1, padding: '14px', background: '#2874F0', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 800, fontSize: 14, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Package size={17} /> Track My Orders
        </Link>
        <Link
          to="/"
          style={{ flex: 1, padding: '14px', background: '#FFFFFF', border: '1px solid #E8E8E8', color: '#1A1A2E', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <ShoppingBag size={17} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
