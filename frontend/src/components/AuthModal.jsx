import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { apiService } from '../services/apiService';
import { X, Eye, EyeOff, ShieldCheck, Zap, Sparkles, Mail, Lock, User } from 'lucide-react';

function InputField({ label, type = 'text', value, onChange, placeholder, icon: Icon }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#424553', marginBottom: 6, letterSpacing: '0.02em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#878787' }} />
        )}
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: isPassword ? '11px 40px 11px 38px' : '11px 14px 11px 38px',
            background: '#F8F9FA',
            border: '1.5px solid #E0E0E0',
            borderRadius: 6,
            fontSize: 14,
            color: '#1A1A2E',
            outline: 'none',
            transition: 'border-color 0.15s',
            fontFamily: 'inherit',
          }}
          onFocus={e => e.target.style.borderColor = '#2874F0'}
          onBlur={e => e.target.style.borderColor = '#E0E0E0'}
          required
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#878787', display: 'flex' }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthModal() {
  const { authModal, closeAuth, login, openLogin, openRegister } = useShop();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModal) return null;

  const isLogin = authModal === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        if (!form.email || !form.password) throw new Error('Please fill all fields');
        const userObj = await apiService.loginUser({ email: form.email, password: form.password });
        login(userObj);
      } else {
        if (!form.name || !form.email || !form.password) throw new Error('Please fill all fields');
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters');
        const userObj = await apiService.registerUser({ name: form.name, email: form.email, password: form.password });
        login(userObj);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && closeAuth()}
    >
      {/* Card */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 420,
        background: '#FFFFFF', borderRadius: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        overflow: 'hidden', animation: 'fadeSlideIn 0.2s ease',
      }}>
        {/* Blue accent bar on top */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #2874F0 0%, #1565C0 50%, #7C3AED 100%)' }} />

        <div style={{ padding: '28px 32px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #2874F0, #1565C0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="white" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.3px' }}>IntentIQ</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
                {isLogin ? 'Welcome back 👋' : 'Create account'}
              </h2>
              <p style={{ fontSize: 13, color: '#878787', marginTop: 4 }}>
                {isLogin ? 'Sign in for AI-powered recommendations' : 'Join for personalised product discovery'}
              </p>
            </div>
            <button
              onClick={closeAuth}
              style={{ background: '#F5F7FA', border: '1px solid #E8E8E8', borderRadius: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#424553', flexShrink: 0 }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#FFF0F0', border: '1.5px solid #FFCDD2', borderRadius: 6, fontSize: 13, color: '#E53935', fontWeight: 500 }}>
              ⚠ {error}
            </div>
          )}

          {/* Quick demo */}
          {isLogin && (
            <div
              style={{ marginBottom: 18, padding: '10px 14px', background: '#EEF4FF', border: '1.5px solid #BBDEFB', borderRadius: 6, fontSize: 12, color: '#2874F0', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => setForm({ name: '', email: 'demo@nexora.ai', password: 'demo123' })}
            >
              <strong>Demo account:</strong> Click to autofill — demo@nexora.ai / demo123
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <InputField label="Full Name" value={form.name} onChange={update('name')} placeholder="Aarav Sharma" icon={User} />
            )}
            <InputField label="Email Address" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" icon={Mail} />
            <InputField label="Password" type="password" value={form.password} onChange={update('password')} placeholder="••••••••" icon={Lock} />

            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 16 }}>
                <button type="button" style={{ fontSize: 12, color: '#2874F0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', background: loading ? '#90B8F8' : '#2874F0',
                color: 'white', border: 'none', borderRadius: 6,
                fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s', letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#1565C0'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#2874F0'; }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 0' }}>
            <div style={{ flex: 1, height: 1, background: '#F0F0F0' }} />
            <span style={{ fontSize: 12, color: '#C0C0C0' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#F0F0F0' }} />
          </div>

          {/* Switch mode */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#878787', marginTop: 16 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={isLogin ? openRegister : openLogin}
              style={{ color: '#2874F0', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Trust badges */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#878787' }}>
              <ShieldCheck size={13} color="#388E3C" /> DPDP 2023
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#878787' }}>
              <Zap size={13} color="#F59E0B" /> Gemini RAG
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#878787' }}>
              <Sparkles size={13} color="#7C3AED" /> AI Powered
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
