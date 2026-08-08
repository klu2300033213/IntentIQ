import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, X, Cpu, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { products as allProducts } from '../data/products';

// ── Smart local RAG engine ─────────────────────────────────────────────────
const INTENT_MAP = {
  category: {
    'phone|mobile|smartphone|iphone|android|galaxy|oneplus|realme|xiaomi|redmi': 'Smartphones',
    'laptop|notebook|macbook|chromebook|ultrabook': 'Laptops',
    'shoe|sneaker|footwear|sandal|boot|slipper|trainer|running shoe': 'Footwear',
    'shirt|jeans|dress|hoodie|kurta|blazer|trouser|clothing|fashion|outfit|wear|top|t-shirt|tshirt': 'Fashion',
    'watch|smartwatch|timepiece': 'Watches',
    'headphone|earphone|earbud|speaker|audio|sound|bluetooth speaker': 'Electronics',
    'tv|television|screen|display': 'Electronics',
    'tablet|ipad': 'Electronics',
    'camera|dslr|mirrorless|lens': 'Electronics',
    'cream|serum|moisturizer|lipstick|makeup|skincare|shampoo|perfume|sunscreen|beauty|lotion': 'Beauty & Care',
    'yoga|gym|dumbbell|cricket|football|badminton|sport|fitness|exercise|workout': 'Sports',
    'backpack|bag|wallet|sunglasses|luggage|accessory|accessories': 'Accessories',
    'cooker|cookware|blender|oven|kettle|kitchen|cooking|pressure cooker': 'Kitchen',
    'book|novel|bestseller|read': 'Books',
  },
};

function parsePrice(str) {
  const s = str.replace(/[₹,\s]/g, '').toLowerCase();
  const kMatch = s.match(/^([\d.]+)\s*k$/);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);
  const lMatch = s.match(/^([\d.]+)\s*l(?:akh)?$/);
  if (lMatch) return Math.round(parseFloat(lMatch[1]) * 100000);
  const plain = parseInt(s.replace(/\D/g, ''));
  return isNaN(plain) ? null : plain;
}

function smartSearch(prompt, limit = 4) {
  const lower = prompt.toLowerCase();
  let detectedCategory = null;
  for (const [pattern, cat] of Object.entries(INTENT_MAP.category)) {
    if (new RegExp(pattern, 'i').test(lower)) { detectedCategory = cat; break; }
  }
  let maxPrice = null;
  const priceRaw = lower.match(/(?:under|below|within|less\s*than|upto?|max|<)\s*([\d.,]+\s*(?:k|l(?:akh)?)?)/i)
    || lower.match(/([\d.,]+\s*(?:k|l(?:akh)?))(?:\s*(?:rs|rupees|₹|inr))?/i);
  if (priceRaw) { maxPrice = parsePrice(priceRaw[1]); if (maxPrice === 0) maxPrice = null; }

  const brands = ['Apple','Samsung','Nike','Adidas','Sony','OnePlus','boAt','Bose','Puma','Realme',
    'Xiaomi','Dell','HP','Lenovo','Asus','Noise','Casio','Titan','Fossil','Garmin','LOreal',
    'Nivea','Lakme','Himalaya','Decathlon','JBL','Motorola','POCO','Google','Nothing','iQOO'];
  const detectedBrand = brands.find(b => lower.includes(b.toLowerCase()));

  let sort = null;
  if (/cheap|budget|affordable|low price/.test(lower)) sort = 'price_low';
  else if (/premium|luxury|expensive|high.?end/.test(lower)) sort = 'price_high';
  else if (/best\s*rated|top\s*rated/.test(lower)) sort = 'rating';
  else if (/deal|offer|discount|sale/.test(lower)) sort = 'discount';

  const stopWords = new Set(['i','a','an','the','is','are','want','need','for','good','best',
    'can','you','show','me','give','find','get','please','some','what','which','how','under',
    'below','within','with','and','or','looking','my','any','nice','suggest','recommend','top','buy']);
  const rawKeywords = lower.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w) && !/^\d+k?$/.test(w));

  const scoreProduct = (p, usePriceFilter) => {
    let score = 0;
    const searchText = [p.name, p.brand, p.category, p.description].join(' ').toLowerCase();
    if (detectedCategory) {
      const filterCat = detectedCategory.toLowerCase();
      const prodCat = p.category.toLowerCase();
      if (!prodCat.includes(filterCat) && !filterCat.includes(prodCat)) {
        if (!detectedBrand || !p.brand.toLowerCase().includes(detectedBrand.toLowerCase())) return -1;
      }
    }
    if (usePriceFilter && maxPrice && p.price > maxPrice) return -1;
    if (detectedBrand && !p.brand.toLowerCase().includes(detectedBrand.toLowerCase())) return -1;
    for (const kw of rawKeywords) {
      if (p.name.toLowerCase().includes(kw)) score += 10;
      else if (p.brand.toLowerCase().includes(kw)) score += 8;
      else if (p.category.toLowerCase().includes(kw)) score += 6;
      else if (searchText.includes(kw)) score += 3;
      else if (p.name.toLowerCase().split(/\s+/).some(w => w.startsWith(kw) && kw.length >= 4)) score += 5;
    }
    score += (p.aiScore || 90) * 0.05 + (p.rating || 4) * 2;
    if (sort === 'price_low')  score += (200000 - p.price) / 5000;
    if (sort === 'price_high') score += p.price / 5000;
    if (sort === 'rating')     score += (p.rating || 4) * 5;
    if (sort === 'discount')   score += (p.discount || 0) * 2;
    return score;
  };

  let results = allProducts.map(p => ({ p, s: scoreProduct(p, true) }))
    .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map(x => x.p);

  if (results.length === 0 && maxPrice) {
    results = allProducts.map(p => ({ p, s: scoreProduct(p, false) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map(x => x.p);
  }
  if (results.length === 0) {
    results = allProducts
      .filter(p => !detectedCategory || p.category.toLowerCase().includes(detectedCategory.toLowerCase()))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
  }
  return { results, detectedCategory, detectedBrand, maxPrice };
}

function buildSmartReply(prompt, detected) {
  const { results, detectedCategory, detectedBrand, maxPrice } = detected;
  if (results.length === 0) return `I couldn't find anything for "${prompt}". Try: "best laptops", "Nike shoes", "phones under 30000".`;
  const priceNote = maxPrice ? ` under ₹${maxPrice.toLocaleString()}` : '';
  if (detectedBrand && detectedCategory) return `Here are the best ${detectedBrand} ${detectedCategory} products${priceNote}:`;
  if (detectedBrand) return `Top ${detectedBrand} products for you${priceNote}:`;
  if (detectedCategory) return `Best ${detectedCategory} picks${priceNote}, ranked by AI score:`;
  return `Here are the top matches for "${prompt}"${priceNote}:`;
}

const QUICK_CHIPS = [
  { label: '📱 Phones under ₹30k', query: 'best phones under 30000' },
  { label: '👟 Nike shoes', query: 'Nike running shoes' },
  { label: '💻 Laptops under ₹60k', query: 'laptops under 60000' },
  { label: '🎧 Sony headphones', query: 'Sony headphones' },
  { label: '⌚ Premium watches', query: 'premium watches' },
];

const GEMINI_KEY = 'AIzaSyDZZ3w4gSWi2kx7dNr0lH3aTXpF5MqYb8E';

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi! I'm IntentIQ AI — your smart shopping assistant. Tell me what you're looking for and I'll find the best products instantly! 🛍️",
    products: [],
    meta: null,
  }]);
  const navigate = useNavigate();
  const { addToCart, t } = useShop();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleSend = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    const detected = smartSearch(userText, 4);
    const products = detected.results;

    let geminiReply = '';
    let modelUsed = 'IntentIQ Local NLP Engine';
    let cost = 0;
    const t0 = Date.now();

    try {
      const ragContext = products.length > 0
        ? products.map(p => `• ${p.name} — Brand: ${p.brand}, Category: ${p.category}, Price: ₹${p.price?.toLocaleString()}, Rating: ${p.rating}★, ${p.description || ''}`).join('\n')
        : 'No specific products found for this query.';

      const systemPrompt = `You are IntentIQ AI, a friendly Indian e-commerce shopping assistant.
Answer in 1-3 short, helpful sentences. Be specific and mention product names from the context.
Do NOT make up products not in the context.

Available Products:
${ragContext}

User: ${userText}
Answer:`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 150, topP: 0.9 },
          }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw?.trim()) { geminiReply = raw.trim(); modelUsed = 'Gemini 2.0 Flash'; cost = 0.0024; }
      }
    } catch (_) {}

    const latency = Date.now() - t0;
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: geminiReply || buildSmartReply(userText, detected),
      products,
      meta: { modelUsed, cost, latency },
    }]);
    setLoading(false);
  };

  const handleSubmit = (e) => { e?.preventDefault(); handleSend(); };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 150, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>

      {/* ── Chat Panel ── */}
      {open && (
        <div style={{
          width: 370, height: 570, display: 'flex', flexDirection: 'column',
          background: '#FFFFFF', borderRadius: 16,
          border: '1px solid #E0E0E0', boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#2874F0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="white" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>IntentIQ AI Assistant</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50', animation: 'pulse 2s infinite' }} />
                  <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Gemini RAG · Live</p>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>

                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#2874F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Cpu size={9} color="white" />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#2874F0' }}>IntentIQ AI</span>
                  </div>
                )}

                <div style={{
                  maxWidth: '90%', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px', fontSize: 12, lineHeight: 1.5,
                  background: msg.role === 'user' ? '#2874F0' : '#F5F7FA',
                  color: msg.role === 'user' ? '#FFFFFF' : '#1A1A2E',
                  border: msg.role === 'user' ? 'none' : '1px solid #E8E8E8',
                }}>
                  <p style={{ margin: 0 }}>{msg.content}</p>
                  {msg.meta && (
                    <div style={{ marginTop: 6, paddingTop: 6, borderTop: msg.role === 'user' ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E8E8E8', display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 10, color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#878787' }}>
                      <span style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : '#2874F0', fontWeight: 600 }}>{msg.meta.modelUsed}</span>
                      {msg.meta.cost > 0 && <span>• ${msg.meta.cost}/req</span>}
                      <span>• {msg.meta.latency}ms</span>
                    </div>
                  )}
                </div>

                {/* Product cards */}
                {msg.products?.length > 0 && (
                  <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
                    {msg.products.slice(0, 4).map(p => (
                      <div key={p.id}
                        onClick={() => navigate(`/product/${p.id}`)}
                        style={{ background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(40,116,240,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                      >
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: 80, objectFit: 'cover' }}
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'; }} />
                        <div style={{ padding: '8px 8px 6px' }}>
                          <p style={{ fontSize: 10, color: '#2874F0', fontWeight: 700, margin: '0 0 2px' }}>{p.brand}</p>
                          <p style={{ fontSize: 11, color: '#1A1A2E', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 12, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>₹{p.price?.toLocaleString()}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Star size={9} fill="#F59E0B" color="#F59E0B" />
                              <span style={{ fontSize: 9, color: '#878787' }}>{p.rating}</span>
                            </div>
                          </div>
                          <button onClick={e => { e.stopPropagation(); addToCart(p); }}
                            style={{ width: '100%', marginTop: 6, padding: '5px 0', fontSize: 10, fontWeight: 700, background: '#2874F0', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {msg.products?.length > 0 && (
                  <button onClick={() => navigate(`/products`)}
                    style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: '#2874F0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    See all results <ArrowRight size={11} />
                  </button>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#2874F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Cpu size={9} color="white" />
                </div>
                <div style={{ background: '#F5F7FA', border: '1px solid #E8E8E8', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: 12, color: '#878787', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 150, 300].map(d => (
                      <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#2874F0', animation: `bounce 1s ${d}ms infinite` }} />
                    ))}
                  </div>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #F0F0F0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_CHIPS.slice(0, 3).map(chip => (
              <button key={chip.query} onClick={() => handleSend(chip.query)}
                style={{ fontSize: 10, fontWeight: 600, padding: '4px 10px', background: '#F0F4FF', color: '#2874F0', border: '1px solid #C7D8FA', borderRadius: 20, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{ padding: '8px 12px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8F9FA', border: '1.5px solid #E0E0E0', borderRadius: 10, padding: '8px 12px', transition: 'border-color 0.15s' }}
              onFocus={e => e.currentTarget.style.borderColor = '#2874F0'}
              onBlur={e => e.currentTarget.style.borderColor = '#E0E0E0'}
            >
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask: Best laptop under ₹60000..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: '#1A1A2E', fontFamily: 'inherit' }} />
              <button type="submit" disabled={loading || !input.trim()}
                style={{ width: 30, height: 30, borderRadius: 8, background: loading || !input.trim() ? '#E0E0E0' : '#2874F0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
                <Send size={13} color="white" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── FAB ── */}
      <button onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: open ? '#1565C0' : '#2874F0',
          color: 'white', padding: '12px 20px', borderRadius: 50,
          border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
          boxShadow: '0 4px 20px rgba(40,116,240,0.4)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <X size={16} /> : <Sparkles size={16} />}
        {open ? 'Close' : t('ask_ai')}
        {!open && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
