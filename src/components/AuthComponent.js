import React, { useState } from 'react';
import FixedLogo from './fixedLogo';

const AuthComponent = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isTelegramPremium: false,
    referredBy: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin 
      ? 'https://api.hashtagdigital.net/api/auth/login'
      : 'https://api.hashtagdigital.net/api/auth/register';

    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      if (onSuccess) {
        onSuccess(data);
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: isLogin ? 'black' : 'transparent',
            color: 'white',
          }}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: !isLogin ? 'black' : 'transparent',
            color: 'white',
          }}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.formContainer}>
        {!isLogin && (
          <div>
            <label style={styles.label}>Username</label>
            <div style={styles.inputContainer}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="john_doe"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div>
          <label style={styles.label}>Email</label>
          <div style={styles.inputContainer}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label style={styles.label}>Password</label>
          <div style={styles.inputContainer}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {!isLogin && (
          <>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="isTelegramPremium"
                checked={formData.isTelegramPremium}
                onChange={handleInputChange}
                style={styles.checkbox}
              />
              <label style={styles.checkboxLabel}>
                I have Telegram Premium
              </label>
            </div>

            <div>
              <label style={styles.label}>Referral Code (Optional)</label>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="REF-ABC123"
                />
              </div>
            </div>
          </>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <FixedLogo top="68%" />
    </div>
  );
};

const styles = {
  container: {
    color: 'white',
    borderRadius: '8px',
    maxWidth: '90vw',
    margin: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    display: 'flex',
    marginBottom: '32px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '50px',
    padding: '4px',
    width: '90vw',
  },
  tabButton: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s, color 0.3s',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '500px',
  },
  label: {
    fontSize: '18px',
    marginBottom: '8px',
    display: 'block',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: '16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '16px',
    color: 'black',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
  },
  checkboxLabel: {
    fontSize: '16px',
  },
  error: {
    color: '#ff4444',
    fontSize: '14px',
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    backgroundColor: 'black',
    color: 'white',
    padding: '16px',
    border: 'none',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default AuthComponent;