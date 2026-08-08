import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, Cpu, TrendingUp, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products as allProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

// ── Semantic intent engine (client-side NLP) ───────────────────────────────
const SEMANTIC_MAP = {
  'under 500':   { maxPrice: 500 },  'under 1000':  { maxPrice: 1000 },
  'under 2000':  { maxPrice: 2000 }, 'under 5000':  { maxPrice: 5000 },
  'under 10000': { maxPrice: 10000 },'under 50000': { maxPrice: 50000 },
  'budget':      { maxPrice: 2000, sort: 'price_low' },
  'cheapest':    { sort: 'price_low' },
  'expensive':   { sort: 'price_high' },
  'premium':     { sort: 'price_high', minRating: 4.5 },
  'luxury':      { sort: 'price_high', minRating: 4.5 },
  'top rated':   { sort: 'rating', minRating: 4.5 },
  'best rated':  { sort: 'rating', minRating: 4.5 },
  'highly rated':{ sort: 'rating', minRating: 4.5 },
  'sale':        { sort: 'discount' },
  'discount':    { sort: 'discount' },
  'offer':       { sort: 'discount' },
  'deal':        { sort: 'discount' },
  'phone':       { category: 'Smartphones' },
  'mobile':      { category: 'Smartphones' },
  'iphone':      { category: 'Smartphones', brand: 'Apple' },
  'samsung':     { category: 'Smartphones', brand: 'Samsung' },
  'shoes':       { category: 'Footwear' },
  'sneakers':    { category: 'Footwear' },
  'footwear':    { category: 'Footwear' },
  'running shoes':{ category: 'Footwear' },
  'clothing':    { category: 'Fashion' },
  'clothes':     { category: 'Fashion' },
  'shirt':       { category: 'Fashion' },
  'jeans':       { category: 'Fashion' },
  'dress':       { category: 'Fashion' },
  'laptop':      { category: 'Laptops' },
  'notebook':    { category: 'Laptops' },
  'macbook':     { category: 'Laptops', brand: 'Apple' },
  'headphones':  { category: 'Electronics' },
  'earphones':   { category: 'Electronics' },
  'earbuds':     { category: 'Electronics' },
  'speakers':    { category: 'Electronics' },
  'speaker':     { category: 'Electronics' },
  'bluetooth':   { category: 'Electronics' },
  'watch':       { category: 'Watches' },
  'smartwatch':  { category: 'Watches' },
  'cream':       { category: 'Beauty & Care' },
  'skincare':    { category: 'Beauty & Care' },
  'makeup':      { category: 'Beauty & Care' },
  'beauty':      { category: 'Beauty & Care' },
  'gym':         { category: 'Sports' },
  'fitness':     { category: 'Sports' },
  'cricket':     { category: 'Sports' },
  'yoga':        { category: 'Sports' },
  'football':    { category: 'Sports' },
  'bag':         { category: 'Accessories' },
  'backpack':    { category: 'Accessories' },
  'sunglasses':  { category: 'Accessories' },
  'wallet':      { category: 'Accessories' },
  'kitchen':     { category: 'Kitchen' },
  'cookware':    { category: 'Kitchen' },
  'cooking':     { category: 'Kitchen' },
  'book':        { category: 'Books' },
  'novel':       { category: 'Books' },
};

function parseIntent(query) {
  const lower = query.toLowerCase();
  let intent = { query: lower, filters: {} };

  const entries = Object.entries(SEMANTIC_MAP).sort((a,b) => b[0].length - a[0].length);
  for (const [phrase, filters] of entries) {
    if (lower.includes(phrase)) {
      intent.filters = { ...intent.filters, ...filters };
    }
  }

  const priceRaw = lower.match(/(?:under|below|less\s*than|within|upto?|max|<)\s*([\d.,]+\s*(?:k|l(?:akh)?)?)/i)
    || lower.match(/([\d.,]+\s*(?:k|l(?:akh)?))\s*(?:rs|rupees|₹|inr)?/i)
    || lower.match(/(?:₹|rs\.?)\s*([\d.,]+\s*(?:k|l(?:akh)?)?)/i);
  if (priceRaw) {
    const raw = priceRaw[1].replace(/[₹,\s]/g, '').toLowerCase();
    const kM = raw.match(/^([\d.]+)k$/);
    const lM = raw.match(/^([\d.]+)l(?:akh)?$/);
    if (kM) intent.filters.maxPrice = Math.round(parseFloat(kM[1]) * 1000);
    else if (lM) intent.filters.maxPrice = Math.round(parseFloat(lM[1]) * 100000);
    else { const n = parseInt(raw); if (!isNaN(n) && n > 0) intent.filters.maxPrice = n; }
  }

  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'OnePlus', 'Puma', 'boAt',
    'Realme', 'Xiaomi', 'Dell', 'HP', 'Lenovo', 'Asus', 'Noise', 'Casio', 'Titan',
    'Fossil', 'Garmin', 'LOreal', 'Nivea', 'Lakme', 'Himalaya', 'Decathlon'];
  for (const brand of brands) {
    if (lower.includes(brand.toLowerCase())) {
      intent.filters.brand = brand;
    }
  }

  return intent;
}

function semanticSearch(query, products) {
  const intent = parseIntent(query);
  const lower = query.toLowerCase();

  const scored = products.map(p => {
    let score = 0;
    const searchText = [p.name, p.brand, p.category, p.description].join(' ').toLowerCase();

    if (intent.filters.category) {
      const filterCat = intent.filters.category.toLowerCase();
      const prodCat = p.category.toLowerCase();
      const categoryMatch = prodCat.includes(filterCat) || filterCat.includes(prodCat);
      if (!categoryMatch) {
        if (!intent.filters.brand) {
          return { product: p, score: -1 };
        }
        if (!p.brand.toLowerCase().includes((intent.filters.brand || '').toLowerCase())) {
          return { product: p, score: -1 };
        }
      }
    }

    if (intent.filters.maxPrice && p.price > intent.filters.maxPrice) {
      return { product: p, score: -1 };
    }

    if (intent.filters.minRating && p.rating < intent.filters.minRating) {
      return { product: p, score: -1 };
    }

    const brandFilter = intent.filters.brand;
    if (brandFilter) {
      if (!p.brand.toLowerCase().includes(brandFilter.toLowerCase())) {
        if (!intent.filters.category) {
          return { product: p, score: -1 };
        }
        return { product: p, score: -1 };
      }
    }

    const stopWords = new Set(['i','a','an','the','is','are','want','need','for','good','best',
      'some','what','which','how','under','below','with','and','or','me','give','find','show',
      'looking','can','you','please','get','buy','purchase','suggest','recommend']);
    const keywords = lower.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

    for (const kw of keywords) {
      if (p.name.toLowerCase().includes(kw)) score += 10;
      else if (p.brand.toLowerCase().includes(kw)) score += 8;
      else if (p.category.toLowerCase().includes(kw)) score += 6;
      else if (searchText.includes(kw)) score += 3;
    }

    score += (p.aiScore || 90) * 0.05 + (p.rating || 4) * 2;

    if (intent.filters.sort === 'price_low')  score += (200000 - p.price) / 10000;
    if (intent.filters.sort === 'price_high') score += p.price / 10000;
    if (intent.filters.sort === 'rating')     score += (p.rating || 4) * 5;
    if (intent.filters.sort === 'discount')   score += (p.discount || 0) * 2;

    return { product: p, score };
  });

  let results = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.product);

  if (results.length === 0 && intent.filters.maxPrice) {
    const relaxed = { ...intent, filters: { ...intent.filters, maxPrice: undefined } };
    return semanticSearch_noFallback(query, products, relaxed);
  }

  return results;
}

function semanticSearch_noFallback(query, products, preIntent) {
  const lower = query.toLowerCase();
  const scored = products.map(p => {
    let score = 0;
    const searchText = [p.name, p.brand, p.category, p.description].join(' ').toLowerCase();
    if (preIntent.filters.category) {
      const filterCat = preIntent.filters.category.toLowerCase();
      const prodCat = p.category.toLowerCase();
      if (!prodCat.includes(filterCat) && !filterCat.includes(prodCat)) return { product: p, score: -1 };
    }
    if (preIntent.filters.brand && !p.brand.toLowerCase().includes(preIntent.filters.brand.toLowerCase())) {
      return { product: p, score: -1 };
    }
    const stopWords = new Set(['i','a','an','the','is','are','want','need','for']);
    const keywords = lower.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
    for (const kw of keywords) {
      if (searchText.includes(kw)) score += 5;
    }
    score += (p.aiScore || 90) * 0.05 + (p.rating || 4) * 2;
    return { product: p, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.product);
}

const SUGGESTIONS = [
  'Running shoes under ₹10000',
  'Best smartphones under ₹50000',
  'Sony headphones',
  'Top rated laptops',
  'Nike shoes',
  'Skincare under ₹1000',
  'Samsung Galaxy',
  'Premium watches',
  'Books on finance',
  'Gym equipment',
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputVal, setInputVal] = useState(query);
  const [intent, setIntent] = useState(null);
  const [aiReply, setAiReply] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputVal(query);
    if (!query) { setResults([]); setLoading(false); return; }

    setLoading(true);
    const parsed = parseIntent(query);
    setIntent(parsed);

    const localResults = semanticSearch(query, allProducts);

    const cat = parsed.filters.category || '';
    const maxP = parsed.filters.maxPrice;
    const brand = parsed.filters.brand || '';
    let reply = '';
    if (localResults.length === 0) {
      reply = `No exact results for "${query}". Showing closest matches from our catalog.`;
    } else if (brand && cat) {
      reply = `Found ${localResults.length} ${brand} ${cat} products${maxP ? ` under ₹${maxP.toLocaleString()}` : ''}, ranked by AI relevance.`;
    } else if (brand) {
      reply = `Found ${localResults.length} ${brand} products matching "${query}", ranked by Two-Tower AI score.`;
    } else if (cat) {
      reply = `Showing ${localResults.length} ${cat} products${maxP ? ` under ₹${maxP.toLocaleString()}` : ''}, ranked by best match.`;
    } else {
      reply = `Found ${localResults.length} products for "${query}"${maxP ? ` under ₹${maxP.toLocaleString()}` : ''}, re-ranked by AI score.`;
    }
    setAiReply(reply);
    setResults(localResults);
    setLoading(false);
  }, [query]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = inputVal.trim();
    if (q) setSearchParams({ q });
  };

  const handleSuggestion = (s) => {
    setInputVal(s);
    setShowSuggestions(false);
    setSearchParams({ q: s });
  };

  return (
    <div>
      {/* ── Search Header ── */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E8E8E8', padding: '24px 20px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#2874F0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            <Cpu size={14} />
            Two-Tower Semantic Search · NLP Intent Engine · AI Re-ranking
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8F9FA', border: '1.5px solid #2874F0', borderRadius: 8, padding: '8px 14px', boxShadow: '0 2px 8px rgba(40,116,240,0.1)' }}>
              <Search size={18} color="#878787" />
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder='Try: "Nike shoes under ₹10000" or "best rated laptops"'
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#1A1A2E' }}
              />
              {inputVal && (
                <button type="button" onClick={() => { setInputVal(''); inputRef.current?.focus(); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={16} color="#878787" />
                </button>
              )}
              <button type="submit" style={{ padding: '8px 20px', background: '#2874F0', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> Search
              </button>
            </div>

            {/* Autocomplete suggestions */}
            {showSuggestions && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px 6px', fontSize: 11, fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #F0F0F0' }}>
                  Popular searches
                </div>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={() => handleSuggestion(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', fontSize: 13, color: '#1A1A2E', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <TrendingUp size={13} color="#2874F0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Quick chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {['Nike', 'Apple', 'Under ₹5000', 'Top rated', 'Best laptops', 'Running shoes', 'Skincare deals'].map(chip => (
              <button
                key={chip}
                onClick={() => handleSuggestion(chip)}
                style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, background: '#EEF4FF', color: '#2874F0', border: '1px solid #C7D8FA', borderRadius: 20, cursor: 'pointer' }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>
        {!query ? (
          // ── Empty state ──
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EEF4FF', border: '1px solid #C7D8FA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Search size={36} color="#2874F0" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1A1A2E', marginBottom: 8 }}>AI-Powered Search</h2>
            <p style={{ fontSize: 14, color: '#878787', maxWidth: 450, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Type anything — natural language, product names, brand names, or price ranges.
              Our semantic engine understands what you mean.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {SUGGESTIONS.slice(0, 6).map(s => (
                <button key={s} onClick={() => handleSuggestion(s)}
                  style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, background: '#FFFFFF', border: '1px solid #E8E8E8', color: '#1A1A2E', borderRadius: 20, cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div>Loading results...</div>
        ) : (
          <>
            {/* ── AI Reply Banner ── */}
            <div style={{ background: '#EEF4FF', border: '1px solid #C7D8FA', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2874F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={18} color="white" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#2874F0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Semantic Engine</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7', borderRadius: 12 }}>LIVE</span>
                </div>
                <p style={{ fontSize: 14, color: '#1A1A2E', margin: 0, fontWeight: 500 }}>{aiReply}</p>
                {intent?.filters && Object.keys(intent.filters).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {intent.filters.category && (
                      <span style={{ padding: '3px 10px', fontSize: 11, fontWeight: 700, background: '#FFFFFF', color: '#2874F0', border: '1px solid #C7D8FA', borderRadius: 12 }}>
                        📂 {intent.filters.category}
                      </span>
                    )}
                    {intent.filters.maxPrice && (
                      <span style={{ padding: '3px 10px', fontSize: 11, fontWeight: 700, background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7', borderRadius: 12 }}>
                        💰 Under ₹{intent.filters.maxPrice.toLocaleString()}
                      </span>
                    )}
                    {intent.filters.brand && (
                      <span style={{ padding: '3px 10px', fontSize: 11, fontWeight: 700, background: '#F3E5F5', color: '#7B1FA2', border: '1px solid #CE93D8', borderRadius: 12 }}>
                        🏷️ {intent.filters.brand}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: 16, color: '#878787', marginBottom: 16 }}>No results for "{query}"</p>
                <Link to="/products" style={{ display: 'inline-block', padding: '10px 24px', background: '#2874F0', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
