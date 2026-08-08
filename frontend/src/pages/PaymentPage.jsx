import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard, Smartphone, Building2, Banknote, Tag, ShieldCheck,
  ChevronRight, ArrowLeft, CheckCircle2, Lock, Eye, EyeOff
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const UPI_APPS = [
  { id: 'gpay',    name: 'Google Pay',  icon: '🇬' },
  { id: 'phonepe', name: 'PhonePe',     icon: '📱' },
  { id: 'paytm',   name: 'Paytm',       icon: '💳' },
  { id: 'bhim',    name: 'BHIM UPI',    icon: '🏦' },
];

const BANKS = ['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Punjab National Bank','Bank of Baroda','Canara Bank','Union Bank of India'];

const PROMO_CODES = {
  INTENT10: { type: 'percent', value: 10, max: 500 },
  FIRST:    { type: 'flat',    value: 200 },
  SAVE50:   { type: 'flat',    value: 50 },
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, cartDiscount, placeOrder } = useShop();
  const { address, deliveryType, deliveryCharge = 0, finalTotal = cartTotal + 20 } = location.state || {};

  const [method, setMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [showCvv, setShowCvv] = useState(false);
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [placing, setPlacing] = useState(false);

  if (!cart.length) { navigate('/cart'); return null; }

  const promoDiscount = promoApplied
    ? promoApplied.type === 'percent'
      ? Math.min(Math.round(finalTotal * promoApplied.value / 100), promoApplied.max || Infinity)
      : promoApplied.value
    : 0;

  const grandTotal = finalTotal - promoDiscount;

  const applyPromo = () => {
    const code = PROMO_CODES[promoCode.toUpperCase()];
    if (code) { setPromoApplied(code); setPromoError(''); }
    else { setPromoError('Invalid promo code'); setPromoApplied(null); }
  };

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  const formatExpiry = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));

    const order = placeOrder({
      address,
      paymentMethod: method,
      paymentDetails: method === 'upi' ? { app: upiApp, upiId } : method === 'card' ? { last4: card.number.replace(/\s/g, '').slice(-4) } : { bank: selectedBank },
    });

    navigate('/order-confirmation', { state: { order } });
  };

  const methods = [
    { id: 'upi',        label: 'UPI',           icon: Smartphone },
    { id: 'card',       label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'netbanking', label: 'Net Banking',    icon: Building2 },
    { id: 'cod',        label: 'Cash on Delivery', icon: Banknote },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#878787', marginBottom: 24 }}>
        <button onClick={() => navigate('/checkout')} style={{ background: 'none', border: 'none', color: '#424553', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
          <ArrowLeft size={14} /> Address
        </button>
        <ChevronRight size={13} color="#C0C0C0" />
        <span style={{ color: '#2874F0', fontWeight: 700 }}>Payment</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* ── Left: Payment Methods ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={22} color="#2874F0" />
            Secure Payment
          </h1>

          {/* Method selector */}
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E8E8E8', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #E8E8E8' }}>
              {methods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '14px 8px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: method === id ? '#EEF4FF' : '#FFFFFF',
                    border: 'none', borderBottom: method === id ? '3px solid #2874F0' : '3px solid transparent',
                    color: method === id ? '#2874F0' : '#878787', transition: 'all 0.15s',
                  }}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            <div style={{ padding: 24 }}>
              {/* UPI */}
              {method === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: 0 }}>Choose UPI App</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {UPI_APPS.map(({ id, name, icon }) => (
                      <button
                        key={id}
                        onClick={() => setUpiApp(id)}
                        style={{
                          borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                          border: upiApp === id ? '2px solid #2874F0' : '1px solid #E8E8E8',
                          background: upiApp === id ? '#EEF4FF' : '#FFFFFF', cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A2E' }}>{name}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>Or enter UPI ID</label>
                    <input
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      style={{ width: '100%', height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Card */}
              {method === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Card visual */}
                  <div style={{ background: 'linear-gradient(135deg, #1565C0 0%, #2874F0 50%, #1976D2 100%)', borderRadius: 12, padding: 20, color: 'white', boxShadow: '0 4px 16px rgba(40,116,240,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', opacity: 0.7, margin: 0 }}>INTENTIQ CARD</p>
                        <p style={{ fontSize: 13, fontWeight: 800, marginTop: 4, margin: 0 }}>{card.name || 'CARD HOLDER'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EF4444' }} />
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F59E0B', marginLeft: -10 }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: '0.15em', margin: '0 0 12px' }}>
                      {(card.number || '•••• •••• •••• ••••').padEnd(19, '•')}
                    </p>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>Expires: {card.expiry || 'MM/YY'}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>Card Number</label>
                      <input
                        value={card.number}
                        onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        style={{ width: '100%', height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, fontFamily: 'monospace', outline: 'none' }}
                        maxLength={19}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>Name on Card</label>
                      <input
                        value={card.name}
                        onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                        placeholder="YASWITHA"
                        style={{ width: '100%', height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>Expiry Date</label>
                      <input
                        value={card.expiry}
                        onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY"
                        style={{ width: '100%', height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, fontFamily: 'monospace', outline: 'none' }}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', marginBottom: 4 }}>CVV</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCvv ? 'text' : 'password'}
                          value={card.cvv}
                          onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="•••"
                          style={{ width: '100%', height: 42, padding: '0 36px 0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, fontFamily: 'monospace', outline: 'none' }}
                        />
                        <button type="button" onClick={() => setShowCvv(!showCvv)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#878787' }}>
                          {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {method === 'netbanking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: 0 }}>Select Your Bank</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {BANKS.map(bank => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 6,
                          border: selectedBank === bank ? '2px solid #2874F0' : '1px solid #E8E8E8',
                          background: selectedBank === bank ? '#EEF4FF' : '#FFFFFF',
                          color: '#1A1A2E', fontSize: 13, fontWeight: selectedBank === bank ? 700 : 500, cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <Building2 size={16} color={selectedBank === bank ? '#2874F0' : '#878787'} />
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COD */}
              {method === 'cod' && (
                <div style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: '#FFF8E1', border: '1px solid #FFE082', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Banknote size={32} color="#F57C00" />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', margin: '0 0 6px' }}>Cash on Delivery</p>
                  <p style={{ fontSize: 13, color: '#878787', margin: 0, lineHeight: 1.5 }}>Pay in cash when your order is delivered. Additional ₹49 COD fee applies.</p>
                </div>
              )}
            </div>
          </div>

          {/* Promo Code */}
          <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 20, border: '1px solid #E8E8E8' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag size={16} color="#F57C00" /> Promo Code
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); setPromoError(''); setPromoApplied(null); }}
                placeholder="Enter promo code (e.g. INTENT10)"
                style={{ flex: 1, height: 42, padding: '0 12px', background: '#F8F9FA', border: '1px solid #E0E0E0', borderRadius: 6, fontSize: 13, outline: 'none' }}
              />
              <button onClick={applyPromo} style={{ padding: '0 20px', height: 42, background: '#2874F0', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Apply</button>
            </div>
            {promoApplied && (
              <p style={{ fontSize: 13, color: '#388E3C', fontWeight: 700, marginTop: 8, margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={14} /> Code applied! You save ₹{promoDiscount}
              </p>
            )}
            {promoError && <p style={{ fontSize: 13, color: '#E53935', marginTop: 8, margin: '8px 0 0' }}>{promoError}</p>}
            <p style={{ fontSize: 11, color: '#878787', marginTop: 6, margin: '6px 0 0' }}>Try: INTENT10 · FIRST · SAVE50</p>
          </div>
        </div>

        {/* ── Right: Summary ── */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 20, border: '1px solid #E8E8E8', position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Delivery address summary */}
            {address && (
              <div style={{ background: '#F8F9FA', borderRadius: 8, padding: 12, border: '1px solid #F0F0F0' }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: '0 0 4px' }}>Delivering to</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>{address.name}</p>
                <p style={{ fontSize: 12, color: '#878787', marginTop: 2, margin: 0 }}>{address.line}, {address.city} — {address.pincode}</p>
              </div>
            )}

            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#878787', margin: '0 0 4px' }}>Price Summary</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}><span>MRP Total</span><span>₹{(cartTotal + cartDiscount).toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#388E3C', fontWeight: 600 }}><span>Product Discount</span><span>− ₹{cartDiscount.toLocaleString()}</span></div>
              {promoDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F57C00', fontWeight: 600 }}><span>Promo Discount</span><span>− ₹{promoDiscount}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}><span>Delivery</span><span>{deliveryCharge === 0 ? <span style={{ color: '#388E3C', fontWeight: 700 }}>FREE</span> : `₹${deliveryCharge}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}><span>Platform Fee</span><span>₹20</span></div>
              {method === 'cod' && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#878787' }}><span>COD Fee</span><span>₹49</span></div>}
              <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: '#1A1A2E' }}>
                <span>Total Payable</span>
                <span>₹{(grandTotal + (method === 'cod' ? 49 : 0)).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              style={{
                width: '100%', padding: '14px', background: placing ? '#90B8F8' : '#2874F0',
                color: 'white', border: 'none', borderRadius: 8, fontSize: 14,
                fontWeight: 800, cursor: placing ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {placing ? 'Processing Payment...' : `Place Order — ₹${(grandTotal + (method === 'cod' ? 49 : 0)).toLocaleString()}`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#878787' }}>
              <ShieldCheck size={14} color="#388E3C" />
              100% Safe & Secure Payments · SSL Encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
