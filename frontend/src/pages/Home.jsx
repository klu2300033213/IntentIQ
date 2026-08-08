import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Star, Zap, Shield, Truck,
  RotateCcw, CreditCard, Headphones, ArrowRight,
  Sparkles, BarChart2, Search, ShoppingBag, Brain, Check
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { apiService } from '../services/apiService';
import { products as allProducts, getProductImage } from '../data/products';
import { useShop } from '../context/ShopContext';
import { getCategoryLabel } from '../utils/translations';

/* ══ CATEGORY DATA ══════════════════════════════════════════ */
const CATEGORIES = [
  { name: 'Mobiles',       key: 'Smartphones',   img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80' },
  { name: 'Electronics',   key: 'Electronics',   img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80' },
  { name: 'TV & Appliances',key: 'Electronics',  img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=200&q=80' },
  { name: 'Fashion',       key: 'Fashion',        img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80' },
  { name: 'Home & Kitchen',key: 'Kitchen',        img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=200&q=80' },
  { name: 'Beauty',        key: 'Beauty & Care',  img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sports',        key: 'Sports',         img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=200&q=80' },
  { name: 'Footwear',      key: 'Footwear',       img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80' },
  { name: 'Watches',       key: 'Watches',        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80' },
  { name: 'Accessories',   key: 'Accessories',    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80' },
  { name: 'Books',         key: 'Books',          img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=200&q=80' },
  { name: 'Gift Cards',    key: 'All',            img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80' },
];

/* ══ SERVICE BAR DATA ══════════════════════════════════════════ */
const SERVICES = [
  { icon: RotateCcw, title: '10 Days', sub: 'Easy Returns' },
  { icon: Truck,     title: 'Free Delivery', sub: 'On orders ₹499+' },
  { icon: Shield,    title: '100% Authentic', sub: 'Products' },
  { icon: CreditCard,title: 'Secure Payments', sub: '100% Safe' },
  { icon: Headphones,title: '24/7 Support', sub: 'Always Available' },
];

/* ══ AI FEATURE DATA ══════════════════════════════════════════ */
const AI_FEATURES = [
  { icon: Brain,     label: 'AI-Powered Recommendations', sub: 'Personalized just for you',   color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', link: '/' },
  { icon: BarChart2, label: 'Compare Products',           sub: 'Find the best choice',        color: '#1565C0', bg: 'rgba(21,101,192,0.12)', link: '/products' },
  { icon: Shield,    label: 'Secure Shopping',            sub: 'Your data is protected',      color: '#16A34A', bg: 'rgba(22,163,74,0.12)',  link: '/' },
  { icon: Truck,     label: 'Fast Delivery',              sub: 'At your doorstep',            color: '#FF6B00', bg: 'rgba(255,107,0,0.12)',  link: '/' },
];

/* ══ HERO SLIDES ══════════════════════════════════════════════ */
const HERO_SLIDES = [
  {
    badge: '🔥 Great Freedom Sale',
    title: 'Discover. Compare.',
    titleAccent: 'Shop Smarter.',
    sub: 'Save big on top brands across all categories',
    cta: 'Shop the Sale',
    ctaLink: '/products',
    offer: { bank: 'HDFC BANK', text: '10% Instant Discount*', sub2: 'on Credit Cards & EASYEMI', note: 'T&C Apply' },
    background: 'linear-gradient(135deg, #E8F0FE 0%, #EEF2FF 40%, #F0F4FF 70%, #F5F7FF 100%)',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    img2: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    badge: '💻 Laptop Carnival',
    title: 'Power Through',
    titleAccent: 'Every Task.',
    sub: 'Top laptops at unbeatable prices — Dell, HP, Lenovo & more',
    cta: 'Explore Laptops',
    ctaLink: '/products?cat=Laptops',
    offer: { bank: 'SBI CARD', text: '5% Cashback*', sub2: 'on SBI Credit Cards', note: 'T&C Apply' },
    bg: 'linear-gradient(135deg, #EEF6FF 0%, #E8F4FE 40%, #EFF5FF 70%, #F5F8FF 100%)',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    img2: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80',
  },
  {
    badge: '👟 Fashion Week',
    title: 'Style That',
    titleAccent: 'Speaks Loud.',
    sub: 'Nike, Adidas, Puma & 500+ brands — Styles starting ₹499',
    cta: 'Shop Fashion',
    ctaLink: '/products?cat=Fashion',
    offer: { bank: 'ICICI BANK', text: 'No-Cost EMI*', sub2: 'on Fashion ₹1500+', note: 'T&C Apply' },
    bg: 'linear-gradient(135deg, #FFF5EE 0%, #FFF0E8 40%, #FFEEE0 70%, #FFF5F0 100%)',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    img2: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
  },
];

/* ══ DEAL SECTIONS DATA ══════════════════════════════════════ */
const DEAL_SECTIONS = [
  { title: 'Top Deals on Smartphones', category: 'Smartphones', link: '/products?cat=Smartphones' },
  { title: 'Best of Electronics',      category: 'Electronics',  link: '/products?cat=Electronics'  },
  { title: 'Fashion Top Picks',        category: 'Fashion',      link: '/products?cat=Fashion'      },
  { title: 'Home & Kitchen',           category: 'Kitchen',      link: '/products?cat=Kitchen'      },
];

function getByCategory(cat, count = 4) {
  return allProducts.filter(p => p.category === cat || p.category.includes(cat.split(' ')[0]))
    .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
    .slice(0, count);
}

/* ══ MINI DEAL CARD ══════════════════════════════════════════ */
function MiniCard({ product }) {
  const navigate = useNavigate();
  const img = product.image || getProductImage(product);
  return (
    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="iq-mini-card text-left"
      style={{ minWidth: 0 }}>
      <img src={img} alt={product.name} className="iq-mini-img" loading="lazy"
        onError={e => { e.target.onerror = null; e.target.src = getProductImage(product); }} />
      <div className="iq-mini-name">{product.name}</div>
      <div className="iq-mini-price">₹{(product.price || 999).toLocaleString()}</div>
      {product.discount > 5 && <div className="iq-mini-discount">-{product.discount}%</div>}
    </button>
  );
}

/* ══ SKELETON LOADER ══════════════════════════════════════════ */
function ProductSkeleton() {
  return (
    <div className="iq-product-card">
      <div className="iq-product-img-wrap" style={{ background: '#1A1D35' }}>
        <div className="iq-skeleton w-full h-full" />
      </div>
      <div className="iq-product-body gap-3">
        <div className="iq-skeleton h-3 w-16 rounded" />
        <div className="iq-skeleton h-4 w-full rounded" />
        <div className="iq-skeleton h-3 w-20 rounded" />
        <div className="iq-skeleton h-5 w-24 rounded" />
      </div>
    </div>
  );
}

/* ══ MAIN HOME COMPONENT ══════════════════════════════════════ */
export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [feedProducts, setFeedProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const { user, openRegister, t, currentLang } = useShop();
  const navigate = useNavigate();

  // Auto-advance hero carousel
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  // Load feed
  const loadFeed = useCallback((cat) => {
    setLoading(true);
    const sid = localStorage.getItem('nexora-session-id') || 'session-demo';
    const promise = cat === 'All'
      ? apiService.getHomeFeed(sid, 24)
      : apiService.getProducts({ category: cat });
    promise.then(data => { setFeedProducts(data || []); setLoading(false); });
  }, []);

  useEffect(() => { loadFeed(selectedCat); }, [selectedCat]);

  const slide = HERO_SLIDES[heroIdx];

  return (
    <div style={{ background: '#F1F3F6', minHeight: '100vh' }}>

      {/* ════════════════════════════════════════
          HERO CAROUSEL
      ════════════════════════════════════════ */}
      <section className="iq-hero" style={{ background: slide.bg, transition: 'background 0.8s ease' }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 320, height: 320, background: 'rgba(124,58,237,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 250, height: 250, background: 'rgba(21,101,192,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="iq-container" style={{ position: 'relative', paddingTop: 32, paddingBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>

            {/* ── Left: Hero Content ── */}
            <div style={{ maxWidth: 560 }} key={heroIdx} className="iq-fade-up">
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(40,116,240,0.08)', border: '1px solid rgba(40,116,240,0.2)',
                borderRadius: 4, padding: '5px 12px', marginBottom: 16
              }}>
                <span style={{ fontSize: 13, color: '#2874F0', fontWeight: 700 }}>{slide.badge}</span>
                <span style={{ fontSize: 11, color: '#2874F0', fontWeight: 600 }}>🇮🇳</span>
              </div>

              {/* Headline */}
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', color: '#1A1A2E', marginBottom: 8 }}>
                {heroIdx === 0 ? t('discover_title') : slide.title}<br />
                <span style={{ color: '#2874F0' }}>{heroIdx === 0 ? '' : slide.titleAccent}</span>
              </h1>

              <p style={{ fontSize: 15, color: '#424553', marginBottom: 24 }}>{heroIdx === 0 ? t('discover_sub') : slide.sub}</p>

              {/* CTA */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="iq-btn-blue" onClick={() => navigate(slide.ctaLink)}>
                  {t('shop_now')} <ArrowRight size={15} />
                </button>
                <button className="iq-btn-outline" onClick={() => navigate('/search?q=best deals')}>
                  {t('explore_all')}
                </button>
              </div>

              {/* Carousel dots */}
              <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setHeroIdx(i)}
                    className={`iq-carousel-dot ${i === heroIdx ? 'active' : ''}`} />
                ))}
              </div>
            </div>

            {/* ── Right: Product Image + Offer Card ── */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }} className="hidden md:flex">
              {/* Main product image */}
              <div style={{ position: 'relative' }}>
                <img src={slide.img} alt="featured product" key={heroIdx}
                  style={{ width: 260, height: 260, objectFit: 'contain', borderRadius: 12 }}
                  className="iq-fade-up" />
              </div>
              {/* Secondary product image */}
              <img src={slide.img2} alt="product 2" key={`img2-${heroIdx}`}
                style={{ width: 130, height: 130, objectFit: 'contain', borderRadius: 8 }}
                className="hidden lg:block iq-fade-up" />

              {/* Bank offer card */}
              <div style={{
                background: '#FFFFFF', border: '1px solid #E8E8E8',
                borderRadius: 8, padding: '14px 16px', minWidth: 160, textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }} className="hidden lg:block">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#2874F0', letterSpacing: '0.08em', marginBottom: 4 }}>
                  {slide.offer.bank}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', lineHeight: 1.3 }}>{slide.offer.text}</div>
                <div style={{ fontSize: 11, color: '#424553', marginTop: 4 }}>{slide.offer.sub2}</div>
                <div style={{ fontSize: 10, color: '#878787', marginTop: 8 }}>{slide.offer.note}</div>
              </div>
            </div>
          </div>

          {/* Prev / Next arrows */}
          <button onClick={() => setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: '1px solid #E8E8E8', color: '#1A1A2E', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length)}
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: '1px solid #E8E8E8', color: '#1A1A2E', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICE BAR
      ════════════════════════════════════════ */}
      <section className="iq-service-bar">
        <div className="iq-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '12px 0', flexWrap: 'wrap' }}>
            {[
              { icon: RotateCcw, textKey: 'days_returns' },
              { icon: Truck,     textKey: 'free_delivery' },
              { icon: Shield,    textKey: 'authentic' },
              { icon: CreditCard,textKey: 'secure_payments' },
              { icon: Headphones,textKey: 'support_247' },
            ].map(({ icon: Icon, textKey }) => (
              <div key={textKey} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 150px', minWidth: 140 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#2874F0" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>{t(textKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SHOP BY CATEGORY
      ════════════════════════════════════════ */}
      <section className="iq-section">
        <div className="iq-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="iq-section-title">{t('shop_by_category')}</h2>
            <Link to="/products" className="iq-section-link">{t('view_all')} <ChevronRight size={14} /></Link>
          </div>
          <div className="iq-scroll-row">
            {CATEGORIES.map(({ name, key, img }) => (
              <button key={name} className="iq-cat-card shrink-0"
                onClick={() => navigate(key === 'All' ? '/products' : `/products?cat=${encodeURIComponent(key)}`)}>
                <img src={img} alt={name} className="iq-cat-img"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'; }} />
                <div className="iq-cat-name">{getCategoryLabel(currentLang, name)}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4-COLUMN DEAL SECTIONS
      ════════════════════════════════════════ */}
      <section className="iq-section" style={{ paddingTop: 0 }}>
        <div className="iq-container">
          <div className="iq-deal-grid">
            {DEAL_SECTIONS.map(({ title, category, link }) => {
              const items = getByCategory(category, 4);
              const translatedTitle = category === 'Smartphones' ? t('top_deals_smartphones')
                : category === 'Electronics' ? t('best_electronics')
                : category === 'Fashion' ? t('fashion_top_picks')
                : t('home_kitchen');
              return (
                <div key={title} className="iq-deal-section">
                  <div className="iq-deal-header">
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E' }}>{translatedTitle}</span>
                    <Link to={link} className="iq-section-link" style={{ fontSize: 12 }}>
                      {t('view_all')} <ChevronRight size={12} />
                    </Link>
                  </div>
                  <div style={{ display: 'flex' }}>
                    {items.map(p => <MiniCard key={p.id} product={p} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          AI FEATURE STRIP
      ════════════════════════════════════════ */}
      <section className="iq-section" style={{ paddingTop: 0 }}>
        <div className="iq-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {AI_FEATURES.map(({ icon: Icon, label, sub, color, bg, link }) => (
              <Link key={label} to={link} className="iq-ai-feature" style={{ textDecoration: 'none' }}>
                <div className="iq-ai-icon" style={{ background: bg }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#878787' }}>{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PERSONALIZED FEED — ALL PRODUCTS
      ════════════════════════════════════════ */}
      <section className="iq-section" style={{ paddingTop: 0, paddingBottom: 40 }}>
        <div className="iq-container">
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 className="iq-section-title">Picked For You</h2>
              <p style={{ fontSize: 12, color: '#878787', marginTop: 3 }}>AI-personalised • 35% category diversity enforced</p>
            </div>
            <Link to="/products" className="iq-section-link">View All <ChevronRight size={14} /></Link>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 16 }}>
            {['All', 'Smartphones', 'Laptops', 'Electronics', 'Fashion', 'Footwear', 'Watches', 'Beauty & Care', 'Sports', 'Books'].map(cat => (
              <button key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap', border: '1.5px solid',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: selectedCat === cat ? '#2874F0' : '#FFFFFF',
                  borderColor: selectedCat === cat ? '#2874F0' : '#D1D5DB',
                  color: selectedCat === cat ? 'white' : '#424553',
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="iq-product-grid">
              {Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : feedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#878787' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E' }}>No products found</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Try a different category</p>
            </div>
          ) : (
            <div className="iq-product-grid">
              {feedProducts.slice(0, 24).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {feedProducts.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button className="iq-btn-outline" onClick={() => navigate('/products')}>
                View More Products <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          AI DISCOVERY SECTION
      ════════════════════════════════════════ */}
      <section className="iq-section" style={{ background: '#F0F4FF', borderTop: '1px solid #E8E8E8', paddingBottom: 48 }}>
        <div className="iq-container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 4, padding: '5px 14px', marginBottom: 14 }}>
              <Sparkles size={13} color="#7C3AED" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.08em' }}>INTENTIQ AI ENGINE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 900, color: '#1A1A2E', letterSpacing: '-0.5px' }}>
              Shopping, <span style={{ color: '#7C3AED' }}>With Intelligence.</span>
            </h2>
            <p style={{ fontSize: 14, color: '#878787', marginTop: 10, maxWidth: 480, margin: '10px auto 0' }}>
              IntentIQ's AI understands what you're looking for — even when you don't have the exact words.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, maxWidth: 960, margin: '0 auto' }}>
            {[
              { icon: Brain, title: 'AI-Powered Recommendations', desc: 'Two-Tower neural network personalises your feed in real-time based on your browse patterns.', color: '#7C3AED', bg: '#FFFFFF' },
              { icon: Search, title: 'Intent-Aware Search', desc: 'Type naturally — "phones under 30k for photography" and IntentIQ understands exactly what you mean.', color: '#2874F0', bg: '#FFFFFF' },
              { icon: BarChart2, title: 'Smart Comparison', desc: 'Compare products side-by-side with AI-generated insights on what matters most for your use case.', color: '#FF6B00', bg: '#FFFFFF' },
              { icon: Sparkles, title: 'Gemini RAG Assistant', desc: 'Ask our AI shopping assistant anything — powered by Google Gemini with live product catalog context.', color: '#388E3C', bg: '#FFFFFF' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} style={{ background: bg, border: '1px solid #E8E8E8', borderRadius: 8, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 12, color: '#878787', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>

          {!user && (
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <button className="iq-btn-blue" onClick={openRegister}>
                <Sparkles size={15} /> Get Personalised Recommendations
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          COMPLETE THE SETUP
      ════════════════════════════════════════ */}
      <section className="iq-section" style={{ paddingBottom: 48 }}>
        <div className="iq-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 className="iq-section-title">Complete Your Setup</h2>
            <Link to="/products" className="iq-section-link">View All <ChevronRight size={14} /></Link>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 8, padding: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {getByCategory('Laptops', 1).concat(getByCategory('Electronics', 3)).slice(0, 4).map((p, i, arr) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(`/product/${p.id}`)}>
                  <div style={{ width: 100, height: 100, background: '#F5F7FA', borderRadius: 8, border: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <img src={p.image || getProductImage(p)} alt={p.name}
                      style={{ width: 80, height: 80, objectFit: 'contain' }}
                      onError={e => { e.target.onerror = null; e.target.src = getProductImage(p); }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#878787', maxWidth: 90, textAlign: 'center', lineHeight: 1.3 }}>{p.name.split(' ').slice(0, 3).join(' ')}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A2E', marginTop: 4 }}>₹{p.price.toLocaleString()}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ fontSize: 22, color: '#D1D5DB', fontWeight: 300 }}>+</div>
                )}
              </div>
            ))}
            <button className="iq-btn-blue" style={{ marginLeft: 'auto' }} onClick={() => navigate('/products')}>
              Shop Bundle <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
