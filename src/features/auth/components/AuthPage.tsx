// src/features/auth/components/AuthPage.tsx  (НОВИЙ)
import { useState, FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { signIn, signUp, signInWithGoogle, resetPassword, clearMessages } from '../authSlice';
import '../auth.css';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const { loading, error, info } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showReq, setShowReq] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const switchMode = (m: Mode) => { setMode(m); setLocalError(null); dispatch(clearMessages()); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setLocalError('Введіть email.');
    if (password.length < 6) return setLocalError('Пароль має містити щонайменше 6 символів.');
    setLocalError(null);
    dispatch(mode === 'signin' ? signIn({ email: email.trim(), password, remember }) : signUp({ email: email.trim(), password }));
  };

  const forgot = () => {
    if (!email.trim()) return setLocalError('Спочатку введіть email, на який надіслати лист.');
    setLocalError(null);
    dispatch(resetPassword(email.trim()));
  };

  const message = localError ?? error;

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo"><TrendingUp size={22} /></div>
        <span className="auth-badge">● INVESTIQ SAFESPACE OS</span>
        <h1>Welcome to InvestIQ</h1>
        <p className="auth-sub">Smart control of your personal finances and investments</p>

        <div className="auth-tabs">
          <button type="button" className={mode === 'signin' ? 'on' : ''} onClick={() => switchMode('signin')}>Sign In</button>
          <button type="button" className={mode === 'signup' ? 'on' : ''} onClick={() => switchMode('signup')}>Sign Up</button>
        </div>

        <button type="button" className="auth-google" disabled={loading} onClick={() => dispatch(signInWithGoogle())}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
            <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="auth-or"><span>OR {mode === 'signin' ? 'SIGN IN' : 'SIGN UP'} WITH EMAIL</span></div>

        <form onSubmit={submit} noValidate>
          <label className="auth-label">Email address</label>
          <div className="auth-input">
            <Mail size={16} />
            <input type="email" autoComplete="email" placeholder="investor@investiq.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="auth-label-row">
            <label className="auth-label">Password</label>
            <button type="button" className="auth-link" onClick={() => setShowReq(!showReq)}>Security requirements</button>
          </div>
          <div className="auth-input">
            <Lock size={16} />
            <input
              type={show ? 'text' : 'password'}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="auth-eye" aria-label="Show password" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {showReq && <p className="auth-hint">Мінімум 6 символів. Краще поєднувати літери, цифри та спецсимволи.</p>}

          <div className="auth-row">
            <label className="auth-check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            {mode === 'signin' && <button type="button" className="auth-link" onClick={forgot}>Forgot password?</button>}
          </div>

          {message && <p className="auth-msg error" role="alert">{message}</p>}
          {info && <p className="auth-msg ok">{info}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In to Cabinet' : 'Create account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" className="auth-link" onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? 'Create account' : 'Sign in'}
          </button>
        </p>

        <div className="auth-secure">
          <span className="shield"><ShieldCheck size={16} /></span>
          <div>
            <b>Bank-grade encryption standard</b> <em>AES-256</em>
            <p>All financial data is securely protected with end-to-end encryption.</p>
          </div>
        </div>
      </div>
    </div>
  );
}