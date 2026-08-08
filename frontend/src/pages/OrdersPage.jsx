import { Link } from 'react-router-dom';
import { Package, ChevronRight, CheckCircle2, Truck, Clock, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getProductImage } from '../data/products';

const STATUS_COLORS = {
  ORDERED:   { bg: '#EEF4FF', border: '#C7D8FA', text: '#2874F0', dot: '#2874F0' },
  PACKED:    { bg: '#FFF8E1', border: '#FFE082', text: '#F57C00', dot: '#F57C00' },
  SHIPPED:   { bg: '#F3E5F5', border: '#CE93D8', text: '#7B1FA2', dot: '#7B1FA2' },
  DELIVERED: { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32', dot: '#2E7D32' },
};

export default function OrdersPage() {
  const { orders } = useShop();

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF4FF', border: '1px solid #C7D8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Package size={40} color="#2874F0" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>No orders yet</h2>
        <p style={{ fontSize: 14, color: '#878787', marginBottom: 24 }}>Looks like you haven't placed any orders. Start shopping with our AI Discovery Engine!</p>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#2874F0', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          <Sparkles size={16} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={26} color="#2874F0" />
            My Orders
          </h1>
          <p style={{ fontSize: 13, color: '#878787', marginTop: 4 }}>{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
        </div>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#FFFFFF', border: '1.5px solid #2874F0', color: '#2874F0', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
          <ShoppingBag size={15} /> Shop More
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {orders.map((order) => {
          const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.ORDERED;
          const itemCount = order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

          return (
            <article key={order.id} style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E8E8E8', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {/* Header */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#878787', margin: 0 }}>Order ID</p>
                  <p style={{ fontSize: 15, fontWeight: 900, color: '#1A1A2E', fontFamily: 'monospace', margin: '2px 0 0' }}>{order.id}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.text }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusStyle.dot }} />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items preview */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  {order.items?.slice(0, 4).map(({ product }, i) => (
                    <div key={i} style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: '#F8F9FA', border: '1px solid #E8E8E8', flexShrink: 0 }}>
                      <img
                        src={product.image}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getProductImage(product);
                        }}
                      />
                    </div>
                  ))}
                  {(order.items?.length || 0) > 4 && (
                    <div style={{ width: 56, height: 56, borderRadius: 8, background: '#F5F7FA', border: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#878787' }}>
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* First item name */}
                {order.items?.[0] && (
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{order.items[0].product.name}</p>
                    {order.items.length > 1 && (
                      <p style={{ fontSize: 12, color: '#878787', marginTop: 2, margin: 0 }}>& {order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Status timeline */}
              <div style={{ padding: '0 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {(order.statusHistory || []).map((step, i, arr) => (
                    <div key={step.status} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${step.done ? '#388E3C' : '#E0E0E0'}`, background: step.done ? '#388E3C' : '#F8F9FA' }}>
                          {step.done ? <CheckCircle2 size={14} color="white" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#BDBDBD' }} />}
                        </div>
                        <p style={{ fontSize: 10, fontWeight: 700, marginTop: 4, margin: '4px 0 0', textAlign: 'center', color: step.done ? '#2E7D32' : '#9E9E9E' }}>
                          {step.label}
                        </p>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ flex: 1, height: 2, margin: '0 8px 16px', background: step.done && arr[i + 1]?.done ? '#388E3C' : '#E0E0E0' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '12px 20px', background: '#F8F9FA', borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#878787' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} color="#878787" />
                    {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Truck size={13} color="#388E3C" />
                    By {order.deliveryDate}
                  </span>
                  <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#1A1A2E' }}>₹{order.total?.toLocaleString()}</span>
                  <Link
                    to="/order-confirmation"
                    state={{ order }}
                    style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 13, fontWeight: 700, color: '#2874F0', textDecoration: 'none' }}
                  >
                    Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
