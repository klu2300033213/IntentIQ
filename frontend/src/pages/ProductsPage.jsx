import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { apiService } from '../services/apiService';
import { categories } from '../data/products';
import { SlidersHorizontal, Search, X, ChevronDown, ChevronRight, Grid, Package } from 'lucide-react';

const SORT_OPTIONS = [
  { id: 'relevance',  label: 'Relevance' },
  { id: 'price_low',  label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'rating',     label: 'Customer Rating' },
  { id: 'discount',   label: 'Biggest Discount' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500',      max: 500 },
  { label: '₹500 – ₹1,000',  max: 1000,  min: 500 },
  { label: '₹1,000 – ₹5,000',max: 5000,  min: 1000 },
  { label: '₹5,000 – ₹20,000',max: 20000, min: 5000 },
  { label: '₹20,000 – ₹50,000',max: 50000,min: 20000 },
  { label: 'Above ₹50,000',   min: 50000 },
];

function ProductSkeleton() {
  return (
    <div className="iq-product-card">
      <div style={{ background: '#1A1D35', aspectRatio: '1/1', width: '100%' }} className="iq-skeleton" />
      <div className="iq-product-body gap-3">
        <div className="iq-skeleton h-3 w-16 rounded" />
        <div className="iq-skeleton h-4 w-full rounded" />
        <div className="iq-skeleton h-3 w-20 rounded" />
        <div className="iq-skeleton h-5 w-24 rounded" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'All');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('relevance');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRangeLabel, setPriceRangeLabel] = useState('');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setSelectedCat(cat);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCat !== 'All') params.category = selectedCat;
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (maxPrice && !isNaN(Number(maxPrice))) params.maxPrice = Number(maxPrice);

    apiService.getProducts(params).then((data) => {
      let list = data || [];
      if (sort === 'price_low')  list = [...list].sort((a, b) => a.price - b.price);
      if (sort === 'price_high') list = [...list].sort((a, b) => b.price - a.price);
      if (sort === 'rating')     list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      if (sort === 'discount')   list = [...list].sort((a, b) => (b.discount || 0) - (a.discount || 0));
      setProducts(list);
      setLoading(false);
    });
  }, [selectedCat, sort, maxPrice, searchQuery]);

  const clearFilters = () => {
    setSelectedCat('All');
    setMaxPrice('');
    setSearchQuery('');
    setSort('relevance');
    setPriceRangeLabel('');
  };

  const hasFilters = selectedCat !== 'All' || maxPrice || searchQuery;
  const allCats = ['All', ...categories.filter(c => c !== 'All')];

  return (
    <div style={{ background: '#F1F3F6', minHeight: '100vh', paddingBottom: 48 }}>
      {/* ── Page Header ── */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E8E8', padding: '12px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="iq-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555A80' }}>
              <span>Home</span>
              <ChevronRight size={12} />
              <span style={{ color: '#F0F2FF', fontWeight: 600 }}>
                {selectedCat === 'All' ? 'All Products' : selectedCat}
              </span>
              {products.length > 0 && (
                <span style={{ marginLeft: 4 }}>({products.length} results)</span>
              )}
            </div>

            {/* Sort + Filter row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Sort dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    background: '#FFFFFF', border: '1px solid #D1D5DB',
                    borderRadius: 4, padding: '7px 28px 7px 12px', fontSize: 13, color: '#1A1A2E',
                    appearance: 'none', cursor: 'pointer', outline: 'none'
                  }}>
                  {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#8B90B5', pointerEvents: 'none' }} />
              </div>

              {/* Filter toggle (mobile) */}
              <button onClick={() => setShowFilters(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: showFilters ? 'var(--iq-orange)' : '#1C1F3A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 13, color: showFilters ? 'white' : '#8B90B5', cursor: 'pointer', fontWeight: 600 }}>
                <SlidersHorizontal size={14} />
                Filters
              </button>

              {hasFilters && (
                <button onClick={clearFilters}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#FF5252', cursor: 'pointer', background: 'none', border: 'none' }}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="iq-container" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', gap: 20 }}>

          {/* ═══ SIDEBAR FILTERS ═══ */}
          <aside style={{
            width: 220, flexShrink: 0, display: showFilters || window.innerWidth >= 1024 ? 'block' : 'none'
          }} className="hidden lg:block">
            <div className="iq-filter-sidebar">
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#F0F2FF', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Filters
                {hasFilters && <button onClick={clearFilters} style={{ fontSize: 11, color: '#FF5252', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>}
              </h3>

              {/* Categories */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8B90B5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Category</div>
                {allCats.map(cat => (
                  <button key={cat} onClick={() => setSelectedCat(cat)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px',
                      fontSize: 13, borderRadius: 4, marginBottom: 2, cursor: 'pointer', border: 'none',
                      background: selectedCat === cat ? 'rgba(255,107,0,0.12)' : 'transparent',
                      color: selectedCat === cat ? '#FF8C38' : '#8B90B5',
                      fontWeight: selectedCat === cat ? 700 : 400,
                      transition: 'all 0.15s',
                    }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8B90B5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Price Range</div>
                {PRICE_RANGES.map(r => (
                  <button key={r.label} onClick={() => { setMaxPrice(r.max || ''); setPriceRangeLabel(r.label); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px',
                      fontSize: 13, borderRadius: 4, marginBottom: 2, cursor: 'pointer', border: 'none',
                      background: priceRangeLabel === r.label ? 'rgba(255,107,0,0.12)' : 'transparent',
                      color: priceRangeLabel === r.label ? '#FF8C38' : '#8B90B5',
                      fontWeight: priceRangeLabel === r.label ? 700 : 400,
                      transition: 'all 0.15s',
                    }}>
                    {r.label}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Max price (₹)"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(e.target.value); setPriceRangeLabel(''); }}
                  style={{ width: '100%', marginTop: 8, padding: '7px 10px', background: '#1C1F3A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 12, color: '#F0F2FF', outline: 'none' }}
                />
              </div>

              {/* Search within */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8B90B5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Search</div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px 8px 32px', background: '#1C1F3A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 12, color: '#F0F2FF', outline: 'none' }}
                  />
                  <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555A80' }} />
                </div>
              </div>
            </div>
          </aside>

          {/* ═══ PRODUCT GRID ═══ */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Active filter tags */}
            {hasFilters && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {selectedCat !== 'All' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: 4, fontSize: 12, color: '#FF8C38', fontWeight: 600 }}>
                    {selectedCat}
                    <button onClick={() => setSelectedCat('All')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF8C38', padding: 0 }}><X size={11} /></button>
                  </span>
                )}
                {priceRangeLabel && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: 4, fontSize: 12, color: '#FF8C38', fontWeight: 600 }}>
                    {priceRangeLabel}
                    <button onClick={() => { setMaxPrice(''); setPriceRangeLabel(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF8C38', padding: 0 }}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="iq-product-grid">
                {Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#555A80' }}>
                <Package size={56} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F0F2FF', marginBottom: 8 }}>No products found</h3>
                <p style={{ fontSize: 14 }}>Try different filters or search terms</p>
                <button onClick={clearFilters} className="iq-btn-orange" style={{ marginTop: 20 }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="iq-product-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
