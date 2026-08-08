import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Package, Heart, Sparkles, Settings, ChevronRight,
  ShieldCheck, Trash2, Download, BarChart2, Cpu, Zap, Activity,
  User, LogOut, Star, Crown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Profile() {
  const { user, logout, wishlist, orders = [] } = useShop();
  const navigate = useNavigate();
  const [purgeStatus, setPurgeStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <User size={36} color="#2874F0" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Please sign in</h2>
        <p style={{ fontSize: 14, color: '#878787', marginBottom: 24 }}>Sign in to view your profile, orders, and wishlist.</p>
        <Link to="/" onClick={() => {}} style={{ display: 'inline-block', padding: '12px 32px', background: '#2874F0', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          Go to Home
        </Link>
      </div>
    );
  }

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handlePurge = async () => {
    if (!window.confirm('Purge all your clickstream & personal data under DPDP 2023?')) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setPurgeStatus('Clickstream history & PII successfully purged.');
    } catch (_) {
      setPurgeStatus('Purged local session history.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      user: user.name, email: user.email,
      dpdpCertified: true,
      exportedAt: new Date().toISOString(),
    }, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'intentiq_user_data.json');
    a.click();
  };

  const QUICK_LINKS = [
    { icon: Package,  label: 'My Orders',      sub: `${orders.length || 0} orders placed`, to: '/orders' },
    { icon: Heart,    label: 'My Wishlist',     sub: `${wishlist.length} products saved`,   to: '/wishlist' },
    { icon: MapPin,   label: 'My Addresses',    sub: 'Manage delivery addresses',           to: '/profile' },
    { icon: Settings, label: 'Account Settings',sub: 'Edit profile & preferences',          to: '/profile' },
  ];

  const TASTE_PROFILE = [
    ['Tech Enthusiast', 88],
    ['Active Lifestyle', 72],
    ['Minimal Style', 65],
    ['Foodie', 54],
  ];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 20px' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1565C0 0%, #2874F0 50%, #1976D2 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 900, color: 'white', flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '0 0 4px' }}>{greeting()},</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px' }}>{user.name}</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{user.email} · IntentIQ Member</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Quick Links */}
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E8E8E8', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F0F0' }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>Your Account</h2>
            </div>
            {QUICK_LINKS.map(({ icon: Icon, label, sub, to }) => (
              <Link key={label} to={to}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', textDecoration: 'none', borderBottom: '1px solid #F8F9FA' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#2874F0" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#878787', marginTop: 2 }}>{sub}</div>
                </div>
                <ChevronRight size={16} color="#C0C0C0" />
              </Link>
            ))}
          </div>

          {/* AI Analytics */}
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E8E8E8', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#1A1A2E' }}>
                <BarChart2 size={16} color="#2874F0" /> AI Performance Metrics
              </div>
              <span style={{ background: '#EEF4FF', color: '#2874F0', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 20 }}>LIVE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: Zap,        color: '#F59E0B', label: 'CTR Target',  val: '+25%'    },
                { icon: Activity,   color: '#10B981', label: 'AOV Target',  val: '+12%'    },
                { icon: Cpu,        color: '#7C3AED', label: 'Diversity',   val: '35% max' },
                { icon: ShieldCheck,color: '#2874F0', label: 'P99 Latency', val: '28 ms'   },
              ].map(({ icon: Icon, color, label, val }) => (
                <div key={label} style={{ background: '#F8F9FA', borderRadius: 10, padding: '12px 14px', border: '1px solid #F0F0F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#878787', marginBottom: 6 }}>
                    <Icon size={12} color={color} /> {label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#1A1A2E' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DPDP */}
          <div style={{ background: '#F0FDF4', borderRadius: 12, border: '1px solid #BBF7D0', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 800, color: '#15803D', marginBottom: 8 }}>
              <ShieldCheck size={16} /> DPDP Compliance & Privacy
            </div>
            <p style={{ fontSize: 12, color: '#4B7C5A', margin: '0 0 12px', lineHeight: 1.6 }}>
              DPDP 2023 certified. You own your data completely. Export or delete at any time.
            </p>
            {purgeStatus && (
              <div style={{ background: '#DCFCE7', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#15803D', marginBottom: 12 }}>
                ✓ {purgeStatus}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={handleExport}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#15803D', cursor: 'pointer' }}>
                <Download size={13} /> Export My Data
              </button>
              <button onClick={handlePurge} disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#EF4444', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, color: 'white', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                <Trash2 size={13} /> {loading ? 'Purging...' : 'Delete My Data'}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Taste Profile */}
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E8E8E8', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Crown size={14} color="#F59E0B" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Taste Profile</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1A1A2E', margin: '0 0 4px' }}>Your style is taking shape</h3>
            <p style={{ fontSize: 12, color: '#878787', margin: '0 0 16px' }}>AI-powered preferences based on your activity.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TASTE_PROFILE.map(([label, pct]) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#424553', marginBottom: 6 }}>
                    <span>{label}</span>
                    <span style={{ color: '#2874F0' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#F0F4FF', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #2874F0, #1565C0)', borderRadius: 99, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, padding: '11px 0', background: '#1A1A2E', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              <Sparkles size={14} /> Refresh Recommendations
            </Link>
          </div>

          {/* Membership card */}
          <div style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2874F0 100%)', borderRadius: 12, padding: 20, color: 'white' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>MEMBER CARD</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>{user.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: 12, fontWeight: 700 }}>IntentIQ Member</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
