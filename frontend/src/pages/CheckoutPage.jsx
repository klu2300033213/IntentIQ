import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, CheckCircle2, ChevronRight, ArrowLeft, Home, Briefcase, Truck, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const SAVED_ADDRESSES = [
  {
    id: 'addr1',
    tag: 'Home',
    name: 'Aarav Sharma',
    phone: '9876543210',
    line: '42, Shivaji Nagar, Near Café Coffee Day',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
  },
  {
    id: 'addr2',
    tag: 'Office',
    name: 'Aarav Sharma',
    phone: '9876543210',
    line: 'Prestige Technostar, 2nd Floor, Varthur Hobli',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
  },
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartMrp, cartDiscount, cartCount, user } = useShop();
  const [selectedAddr, setSelectedAddr] = useState('addr1');
  const [addingNew, setAddingNew] = useState(false);
  const [deliveryType, setDeliveryType] = useState('standard');
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '', phone: '', line: '', landmark: '',
    city: '', state: 'Maharashtra', pincode: '',
  });
  const [savedList, setSavedList] = useState(SAVED_ADDRESSES);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const update = (field) => (e) => setNewAddr(a => ({ ...a, [field]: e.target.value }));

  const saveNewAddress = () => {
    if (!newAddr.name || !newAddr.phone || !newAddr.line || !newAddr.city || !newAddr.pincode) {
      alert('Please fill all required fields.'); return;
    }
    const id = 'addr' + Date.now();
    const addr = { ...newAddr, id, tag: 'Home' };
    setSavedList(l => [...l, addr]);
    setSelectedAddr(id);
    setAddingNew(false);
  };

  const getSelectedAddress = () => savedList.find(a => a.id === selectedAddr) || savedList[0];

  const deliveryCharge = deliveryType === 'express' ? 99 : (cartTotal >= 499 ? 0 : 49);
  const finalTotal = cartTotal + deliveryCharge + 20;

  const handleContinue = () => {
    const address = getSelectedAddress();
    navigate('/payment', {
      state: { address, deliveryType, deliveryCharge, finalTotal }
    });
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#878787', marginBottom: 24 }}>
        <button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', color: '#424553', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
          <ArrowLeft size={14} /> Cart
        </button>
        <ChevronRight size={13} color="#C0C0C0" />
        <span style={{ color: '#2874F0', fontWeight: 700 }}>Delivery Address</span>
        <ChevronRight size={13} color="#C0C0C0" />
        <span>Payment</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* ── Left: Address ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={22} color="#2874F0" />
            Select Delivery Address
          </h1>

          {/* Saved addresses */}
          {savedList.map((addr) => (
            <div
              key={addr.id}
              onClick={() => { setSelectedAddr(addr.id); setAddingNew(false); }}
              style={{
                background: '#FFFFFF', borderRadius: 12, padding: 20, cursor: 'pointer',
                border: selectedAddr === addr.id ? '2px solid #2874F0' : '1px solid #E8E8E8',
                boxShadow: selectedAddr === addr.id ? '0 4px 16px rgba(40,116,240,0.1)' : '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', border: selectedAddr === addr.id ? '2px solid #2874F0' : '2px solid #C0C0C0',
                  background: selectedAddr === addr.id ? '#2874F0' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0,
                }}>
                  {selectedAddr === addr.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E' }}>{addr.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 4, background: '#EEF4FF', color: '#2874F0', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {addr.tag === 'Home' ? <Home size={10} /> : <Briefcase size={10} />}
                      {addr.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#424553', margin: 0, lineHeight: 1.5 }}>
                    {addr.line}, {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p style={{ fontSize: 12, color: '#878787', marginTop: 4, margin: 0 }}>Mobile: {addr.phone}</p>
                </div>
              </div>

              {selectedAddr === addr.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F0F0F0' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Delivery Options</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { id: 'standard', icon: Truck, label: 'Standard Delivery', sub: '3–5 business days', price: cartTotal >= 499 ? 'FREE' : '₹49' },
                      { id: 'express',  icon: Zap,   label: 'Express Delivery',  sub: 'Delivered tomorrow',  price: '₹99' },
                    ].map(({ id, icon: Icon, label, sub, price }) => (
                      <div
                        key={id}
                        onClick={(e) => { e.stopPropagation(); setDeliveryType(id); }}
                        style={{
                          borderRadius: 10, padding: 14, cursor: 'pointer',
                          border: deliveryType === id ? '2px solid #2874F0' : '1px solid #E8E8E8',
                          background: deliveryType === id ? '#EEF4FF' : '#FFFFFF',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon size={16} color={deliveryType === id ? '#2874F0' : '#878787'} />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>{label}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: price === 'FREE' ? '#388E3C' : '#1A1A2E' }}>{price}</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#878787', margin: 0, paddingLeft: 22 }}>{sub}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleContinue}
                    style={{
                      width: '100%', marginTop: 16, padding: '13px', background: '#2874F0',
                      color: 'white', border: 'none', borderRadius: 8, fontSize: 14,
                      fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 6,
                    }}
                  >
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add new address */}
          {!addingNew ? (
            <button
              onClick={() => { setAddingNew(true); setSelectedAddr(null); }}
              style={{
                width: '100%', background: '#FFFFFF', borderRadius: 12, padding: 20,
                border: '2px dashed #C7D8FA', cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: 12, textAlign: 'left',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="#2874F0" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>Add a new address</p>
                <p style={{ fontSize: 12, color: '#878787', margin: 0 }}>Home, office or any location</p>
              </div>
            </button>
          ) : (
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 20, border: '1.5px solid #2874F0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={16} color="#2874F0" /> New Delivery Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Full Name *', field: 'name', placeholder: 'Aarav Sharma' },
                  { label: 'Phone Number *', field: 'phone', placeholder: '10-digit mobile number' },
                  { label: 'Pincode *', field: 'pincode', placeholder: '400001' },
                  { label: 'City *', field: 'city', placeholder: 'Mumbai' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>{label}</label>
                    <input
                      value={newAddr[field]}
                      onChange={update(field)}
                      placeholder={placeholder}
                      style={{ width: '100%', height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, outline: 'none' }}
                    />
                  </div>
                ))}

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>State *</label>
                  <select
                    value={newAddr.state}
                    onChange={update('state')}
                    style={{ width: '100%', height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, outline: 'none' }}
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>Address Line *</label>
                  <input
                    value={newAddr.line}
                    onChange={update('line')}
                    placeholder="House No., Street, Area, Colony"
                    style={{ width: '100%', height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => setAddingNew(false)} style={{ flex: 1, padding: 12, background: '#F5F7FA', border: '1px solid #E8E8E8', borderRadius: 6, fontSize: 13, fontWeight: 700, color: '#424553', cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveNewAddress} style={{ flex: 1, padding: 12, background: '#2874F0', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} /> Save & Deliver Here
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ── */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 20, border: '1px solid #E8E8E8', position: 'sticky', top: 90 }}>
            <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#878787', margin: '0 0 16px' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 240, overflowY: 'auto' }}>
              {cart.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#F8F9FA', flexShrink: 0 }}>
                    <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A2E', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
                    <p style={{ fontSize: 11, color: '#878787', margin: '2px 0 0' }}>Qty: {quantity}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', margin: 0, flexShrink: 0 }}>₹{(product.price * quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}>
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartMrp.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#388E3C', fontWeight: 600 }}>
                <span>Discount</span>
                <span>− ₹{cartDiscount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}>
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? <span style={{ color: '#388E3C', fontWeight: 700 }}>FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}>
                <span>Platform Fee</span>
                <span>₹20</span>
              </div>
              <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: '#1A1A2E' }}>
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
