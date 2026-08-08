import { Link } from 'react-router-dom';
import { Brain, Shield, Truck, CreditCard, MapPin, Phone, Mail, Instagram, Twitter, Facebook, Youtube, Smartphone } from 'lucide-react';

const FOOTER_LINKS = {
  'About IntentIQ': [
    { label: 'About Us',            to: '/' },
    { label: 'Careers',             to: '/' },
    { label: 'Press',               to: '/' },
    { label: 'Investor Relations',  to: '/' },
    { label: 'Blog',                to: '/' },
  ],
  'Customer Service': [
    { label: 'Help Center',         to: '/' },
    { label: 'How to Buy',          to: '/' },
    { label: 'Track Your Order',    to: '/orders' },
    { label: 'Returns & Refunds',   to: '/' },
    { label: 'EMI & Payments',      to: '/' },
    { label: 'Contact Support',     to: '/' },
  ],
  'AI Discovery': [
    { label: 'How IntentIQ Works',  to: '/' },
    { label: 'AI Recommendations',  to: '/' },
    { label: 'Smart Search',        to: '/search?q=best deals' },
    { label: 'Compare Products',    to: '/products' },
    { label: 'Wishlist & Alerts',   to: '/wishlist' },
  ],
  'Policies': [
    { label: 'Privacy Policy',      to: '/' },
    { label: 'Terms of Service',    to: '/' },
    { label: 'Cookie Policy',       to: '/' },
    { label: 'DPDP Compliance',     to: '/' },
    { label: 'Seller Policy',       to: '/' },
    { label: 'Grievance Redressal', to: '/' },
  ],
};

const TRUST_BADGES = [
  { icon: Shield,   label: '100% Authentic Products', color: '#2874F0' },
  { icon: CreditCard, label: 'Secure Payments',       color: '#388E3C' },
  { icon: Truck,    label: 'Fast Delivery PAN India',  color: '#F57C00' },
  { icon: Brain,    label: 'AI-Powered Shopping',      color: '#7C3AED' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E8E8E8', marginTop: 0 }}>

      {/* Trust badges strip */}
      <div style={{ background: '#F8F9FA', borderBottom: '1px solid #E8E8E8', padding: '14px 0' }}>
        <div className="iq-container">
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {TRUST_BADGES.map(({ icon: Icon, label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={15} color={color} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#424553' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="iq-container" style={{ padding: '40px 16px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 32 }}>

          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1 }}>
                <span style={{ color: '#1A1A2E' }}>Intent</span>
                <span style={{ background: 'linear-gradient(135deg, #2874F0, #1565C0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>IQ</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', color: '#878787', textTransform: 'uppercase', marginTop: 2 }}>SHOP SMARTER</div>
            </div>
            <p style={{ fontSize: 12, color: '#878787', lineHeight: 1.7, marginBottom: 16 }}>
              India's AI-powered shopping platform. Discover products intelligently with neural recommendations.
            </p>

            {/* Social */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  style={{ width: 32, height: 32, borderRadius: 6, background: '#F5F7FA', border: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.borderColor = '#2874F0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.borderColor = '#E8E8E8'; }}>
                  <Icon size={14} color="#878787" />
                </a>
              ))}
            </div>

            {/* App download */}
            <div style={{ fontSize: 11, fontWeight: 700, color: '#878787', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Get the App</div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              {['App Store', 'Google Play'].map(s => (
                <a key={s} href="#"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F5F7FA', border: '1px solid #E8E8E8', borderRadius: 6, padding: '7px 12px', fontSize: 11, color: '#424553', textDecoration: 'none', fontWeight: 600 }}>
                  <Smartphone size={13} color="#2874F0" /> {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {section}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} style={{ fontSize: 13, color: '#878787', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#2874F0'}
                      onMouseLeave={e => e.currentTarget.style.color = '#878787'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: MapPin, text: 'Bengaluru, Karnataka, India 560001' },
                { icon: Phone,  text: '1800-000-1234 (Toll Free)' },
                { icon: Mail,   text: 'support@intentiq.in' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <Icon size={13} color="#2874F0" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#878787', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#878787', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>We Accept</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['VISA', 'MASTER', 'UPI', 'AMEX', 'Net Banking', 'COD'].map(m => (
                  <div key={m} style={{ background: '#F5F7FA', border: '1px solid #E8E8E8', borderRadius: 4, padding: '4px 8px', fontSize: 10, fontWeight: 700, color: '#424553' }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #F0F0F0', padding: '14px 0', background: '#F8F9FA' }}>
        <div className="iq-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#878787', margin: 0 }}>
            © {new Date().getFullYear()} IntentIQ Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map(l => (
              <Link key={l} to="/" style={{ fontSize: 12, color: '#878787', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2874F0'}
                onMouseLeave={e => e.currentTarget.style.color = '#878787'}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
