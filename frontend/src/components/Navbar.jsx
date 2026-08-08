import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, ChevronDown, X,
  Menu, User, Package, LogOut, ChevronRight,
  Smartphone, Store, Cpu, Tv, Shirt, Home, Sparkles,
  Dumbbell, Watch, BookOpen, Gift, Zap, Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CATEGORY_LINKS = [
  { label: 'Home',           to: '/' },
  { label: 'Mobiles',        to: '/products?cat=Smartphones' },
  { label: 'Electronics',    to: '/products?cat=Electronics' },
  { label: 'Fashion',        to: '/products?cat=Fashion' },
  { label: 'Home & Kitchen', to: '/products?cat=Kitchen' },
  { label: 'Beauty',         to: '/products?cat=Beauty%20%26%20Care' },
  { label: 'Appliances',     to: '/products?cat=Electronics' },
  { label: 'Deals',          to: '/products?tab=deals' },
  { label: 'Best Sellers',   to: '/products?tab=bestsellers' },
  { label: 'Gift Cards',     to: '/products?tab=giftcards' },
];

const ALL_CATEGORIES = [
  { icon: Smartphone,  label: 'Mobiles',        to: '/products?cat=Smartphones',      color: '#1976D2' },
  { icon: Cpu,         label: 'Electronics',    to: '/products?cat=Electronics',      color: '#7B1FA2' },
  { icon: Tv,          label: 'TV & Appliances',to: '/products?cat=Electronics',      color: '#00796B' },
  { icon: Shirt,       label: 'Fashion',        to: '/products?cat=Fashion',          color: '#E64A19' },
  { icon: Home,        label: 'Home & Kitchen', to: '/products?cat=Kitchen',          color: '#F57F17' },
  { icon: Sparkles,    label: 'Beauty & Care',  to: '/products?cat=Beauty%20%26%20Care', color: '#C2185B' },
  { icon: Dumbbell,    label: 'Sports',         to: '/products?cat=Sports',           color: '#388E3C' },
  { icon: Watch,       label: 'Watches',        to: '/products?cat=Watches',          color: '#5D4037' },
  { icon: BookOpen,    label: 'Books',          to: '/products?cat=Books',            color: '#1565C0' },
  { icon: Tag,         label: 'Top Deals',      to: '/products?tab=deals',            color: '#D32F2F' },
  { icon: Zap,         label: 'Best Sellers',   to: '/products?tab=bestsellers',      color: '#F9A825' },
  { icon: Gift,        label: 'Gift Cards',     to: '/products?tab=giftcards',        color: '#6A1B9A' },
];

const LANGUAGES = [
  { code: 'EN', label: 'English',    flag: '🇬🇧' },
  { code: 'HI', label: 'हिंदी',      flag: '🇮🇳' },
  { code: 'TA', label: 'தமிழ்',      flag: '🇮🇳' },
  { code: 'TE', label: 'తెలుగు',     flag: '🇮🇳' },
  { code: 'KN', label: 'ಕನ್ನಡ',      flag: '🇮🇳' },
  { code: 'ML', label: 'മലയാളം',     flag: '🇮🇳' },
  { code: 'BN', label: 'বাংলা',      flag: '🇮🇳' },
  { code: 'MR', label: 'मराठी',      flag: '🇮🇳' },
];

const SUGGESTIONS = [
  'iPhone 15 Pro', 'Samsung Galaxy S24', 'Sony headphones',
  'Nike running shoes', 'laptops under 60000', 'smartwatch for men', 'skincare under 500',
];

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [showSugg, setShowSugg] = useState(false);
  const [filteredSugg, setFilteredSugg] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const catRef = useRef(null);
  const langRef = useRef(null);
  const { wishlist, user, cartCount, openLogin, openRegister, logout } = useShop();

  const promos = [
    '🇮🇳 Great Freedom Sale is Live!',
    'Up to 80% Off on Top Brands',
    '10% Instant Discount* on HDFC Cards',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatDropOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSugg(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const onQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setFilteredSugg(SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase())));
      setShowSugg(true);
    } else {
      setFilteredSugg([]);
      setShowSugg(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowSugg(false);
    }
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    const [toPath, toSearch] = to.split('?');
    if (!toSearch) return location.pathname === toPath && !location.search;
    return location.pathname === toPath && location.search === `?${toSearch}`;
  };

  const headerTop = promoVisible ? 36 : 0;

  return (
    <>
      {/* ════════════ PROMO STRIP ════════════ */}
      {promoVisible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 36, background: '#F8F9FA', borderBottom: '1px solid #E0E0E0',
          display: 'flex', alignItems: 'center',
        }}>
          <div className="iq-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12 }}>
              <span style={{ color: '#C62828', fontWeight: 700 }}>{promos[0]}</span>
              <span className="hidden sm:inline" style={{ color: '#424553' }}>{promos[1]}</span>
              <span className="hidden md:inline" style={{ color: '#424553' }}>{promos[2]}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => navigate('/products')}
                style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', background: '#2874F0', padding: '3px 14px', borderRadius: 3, border: 'none', cursor: 'pointer' }}>
                Shop Now →
              </button>
              <span className="hidden sm:flex items-center gap-1" style={{ fontSize: 12, color: '#424553', cursor: 'pointer' }}>
                <Smartphone size={12} /> Download App
              </span>
              <span className="hidden md:flex items-center gap-1" style={{ fontSize: 12, color: '#424553', cursor: 'pointer' }}>
                <Store size={12} /> Become a Seller
              </span>
              <button onClick={() => setPromoVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#878787' }}>
                <X size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ MAIN HEADER ════════════ */}
      <header className="iq-header-main fixed left-0 right-0 z-40" style={{ top: headerTop }}>
        <div className="iq-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="iq-logo-mark">
                <span className="iq-logo-intent">Intent</span>
                <span className="iq-logo-iq">IQ</span>
              </div>
              <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.22em', color: '#878787', textTransform: 'uppercase', marginTop: 1 }}>
                SHOP SMARTER
              </div>
            </Link>

            {/* ── All Categories Dropdown ── */}
            <div style={{ position: 'relative', flexShrink: 0 }} ref={catRef} className="hidden lg:block">
              <button
                onClick={() => setCatDropOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', background: catDropOpen ? '#E8EFD4' : '#F8F9FA',
                  border: '1px solid #E8E8E8', borderRadius: 3,
                  fontSize: 13, fontWeight: 500, color: '#424553',
                  whiteSpace: 'nowrap', cursor: 'pointer',
                }}>
                <Menu size={14} /> All Categories <ChevronDown size={12} style={{ transform: catDropOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>

              {catDropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                  width: 280, background: '#FFFFFF',
                  border: '1px solid #E8E8E8', borderRadius: 8,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.14)', zIndex: 200, overflow: 'hidden',
                }}>
                  <div style={{ padding: '8px 0' }}>
                    {ALL_CATEGORIES.map(({ icon: Icon, label, to, color }) => (
                      <Link key={label} to={to}
                        onClick={() => setCatDropOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', textDecoration: 'none', color: '#1A1A2E', fontSize: 13, fontWeight: 500 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F5F7FF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={15} color={color} />
                        </div>
                        {label}
                        <ChevronRight size={12} color="#C0C0C0" style={{ marginLeft: 'auto' }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <div style={{ flex: 1, minWidth: 0, position: 'relative' }} ref={searchRef}>
              <form onSubmit={handleSearch} className="flex iq-search-wrap">
                <input
                  type="text" value={query} onChange={e => onQueryChange(e.target.value)}
                  onFocus={() => !query && setShowSugg(true)}
                  placeholder="Search for products, brands and more..."
                  className="iq-search-input flex-1 min-w-0" />
                <button type="submit" className="iq-search-btn"><Search size={18} /></button>
              </form>
              {showSugg && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFFFFF', border: '1px solid #E8E8E8', borderTop: 'none', borderRadius: '0 0 4px 4px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', zIndex: 100 }}>
                  {!query && <div style={{ padding: '10px 16px 6px', fontSize: 11, fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Popular Searches</div>}
                  {(query ? filteredSugg : SUGGESTIONS).map((s, i) => (
                    <button key={i} onClick={() => { navigate(`/search?q=${encodeURIComponent(s)}`); setQuery(''); setShowSugg(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 16px', fontSize: 13, color: '#1A1A2E', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <Search size={12} color="#878787" /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Language Selector ── */}
            <div style={{ position: 'relative', flexShrink: 0 }} ref={langRef} className="hidden xl:block">
              <button
                onClick={() => setLangDropOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#424553', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                🇮🇳 {selectedLang.code} <ChevronDown size={11} style={{ transform: langDropOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              {langDropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: 160, background: '#FFFFFF',
                  border: '1px solid #E8E8E8', borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.13)', zIndex: 200, overflow: 'hidden',
                }}>
                  <div style={{ padding: '4px 0' }}>
                    {LANGUAGES.map(lang => (
                      <button key={lang.code}
                        onClick={() => { setSelectedLang(lang); setLangDropOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '9px 14px', fontSize: 13, color: lang.code === selectedLang.code ? '#2874F0' : '#1A1A2E',
                          background: lang.code === selectedLang.code ? '#EEF4FF' : 'none',
                          border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: lang.code === selectedLang.code ? 700 : 400,
                        }}
                        onMouseEnter={e => { if (lang.code !== selectedLang.code) e.currentTarget.style.background = '#F8F9FA'; }}
                        onMouseLeave={e => { if (lang.code !== selectedLang.code) e.currentTarget.style.background = 'none'; }}>
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {lang.code === selectedLang.code && <span style={{ marginLeft: 'auto', fontSize: 10 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Account ── */}
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button onClick={() => user ? setUserMenuOpen(v => !v) : openLogin()}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', minWidth: 64 }}>
                <span style={{ fontSize: 11, color: '#878787' }}>Hello, {user ? user.name?.split(' ')[0] : 'Sign In'}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: 3 }}>
                  Account <ChevronDown size={11} />
                </span>
              </button>

              {userMenuOpen && user && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 220, background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.13)', zIndex: 200, overflow: 'hidden' }}>
                  {/* User info header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F0F0', background: '#F5F7FF' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2874F0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: '#878787', marginTop: 2 }}>{user.email}</div>
                  </div>
                  {[
                    { icon: User,    label: 'My Profile',  to: '/profile' },
                    { icon: Package, label: 'My Orders',   to: '/orders'  },
                    { icon: Heart,   label: 'Wishlist',    to: '/wishlist' },
                  ].map(({ icon: Icon, label, to }) => (
                    <Link key={to} to={to} onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 13, color: '#424553', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <Icon size={15} color="#878787" /> {label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid #F0F0F0' }}>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', fontSize: 13, color: '#E53935', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link to="/orders" className="hidden md:flex"
              style={{ flexDirection: 'column', alignItems: 'center', padding: '4px 8px', textDecoration: 'none', minWidth: 72 }}>
              <span style={{ fontSize: 11, color: '#878787' }}>Returns</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', padding: '4px 8px' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={26} color="#1A1A2E" />
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: -8, right: -8, background: '#2874F0', color: 'white', fontSize: 11, fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }} className="hidden sm:inline">Cart</span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', padding: '4px 6px' }} className="hidden md:flex">
              <div style={{ position: 'relative' }}>
                <Heart size={22} color="#1A1A2E" />
                {wishlist.length > 0 && (
                  <span style={{ position: 'absolute', top: -7, right: -7, background: '#E53935', color: 'white', fontSize: 10, fontWeight: 800, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(v => !v)} className="lg:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              {menuOpen ? <X size={20} color="#1A1A2E" /> : <Menu size={20} color="#1A1A2E" />}
            </button>
          </div>
        </div>

        {/* ════════ CATEGORY NAV ════════ */}
        <div className="iq-category-nav hidden lg:block">
          <div className="iq-container">
            <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {CATEGORY_LINKS.map(({ label, to }) => (
                <Link key={label} to={to} className={`iq-nav-pill ${isActive(to) ? 'active' : ''}`}>{label}</Link>
              ))}
              <Link to="/profile" className="iq-nav-pill shrink-0" style={{ color: '#2874F0', marginLeft: 'auto' }}>
                Become a Seller
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div style={{ background: '#FFFFFF', borderTop: '1px solid #E8E8E8', padding: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 4 }}>
              {ALL_CATEGORIES.map(({ label, to, icon: Icon, color }) => (
                <Link key={label} to={to} onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', fontSize: 13, color: '#424553', textDecoration: 'none', borderRadius: 4, fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <Icon size={14} color={color} /> {label}
                </Link>
              ))}
            </div>
            {!user && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, padding: '8px 0 0', borderTop: '1px solid #F0F0F0' }}>
                <button onClick={openLogin} style={{ flex: 1, padding: 10, background: '#2874F0', color: 'white', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Sign In</button>
                <button onClick={openRegister} style={{ flex: 1, padding: 10, background: 'none', color: '#2874F0', border: '1.5px solid #2874F0', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Register</button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Spacer */}
      <div style={{ height: promoVisible ? 116 : 80 }} />
    </>
  );
}
