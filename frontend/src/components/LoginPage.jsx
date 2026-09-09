import { useState } from 'react';
import { login, register } from '../services/authService';

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const user = mode === 'login' ? await login({ email: form.email, password: form.password }) : await register(form);
      onLogin(user);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to connect to the backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span className="brand-mark">T</span><span>Todo Manager</span></div>
        <p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Get started'}</p>
        <h1>{mode === 'login' ? 'Sign in to focus.' : 'Create your account.'}</h1>
        <p className="auth-copy">{mode === 'login' ? 'Pick up where you left off.' : 'Keep your next steps in one clear place.'}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && <label>Name<input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required /></label>}
          <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" required /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-accent auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  );
}

export default LoginPage;
