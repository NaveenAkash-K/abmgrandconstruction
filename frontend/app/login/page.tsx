"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

type ViewType = 'login' | 'forgotPassword' | 'resetPassword' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // View state
  const [currentView, setCurrentView] = useState<ViewType>('login');

  // Login state
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset password state
  const [resetData, setResetData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, authLoading, router]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials.email, credentials.password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler - sends OTP
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword({ email: forgotEmail });
      setCurrentView('resetPassword');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password handler - verifies OTP and sets new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (resetData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email: forgotEmail,
        otp: resetData.otp,
        newPassword: resetData.newPassword
      });
      setCurrentView('success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset all state and go back to login
  const handleBackToLogin = () => {
    setCurrentView('login');
    setError('');
    setForgotEmail('');
    setResetData({ otp: '', newPassword: '', confirmPassword: '' });
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword({ email: forgotEmail });
      setError(''); // Clear any previous errors
      alert('OTP has been resent to your email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.logo}>
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Login View */}
      {currentView === 'login' && (
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.logo}>
            <h1>ABM Admin</h1>
            <p>Sign in to your account</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <Mail size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.forgotPasswordLink}
            onClick={() => {
              setError('');
              setCurrentView('forgotPassword');
            }}
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      )}

      {/* Forgot Password View */}
      {currentView === 'forgotPassword' && (
        <form onSubmit={handleForgotPassword} className={styles.form}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackToLogin}
          >
            <ArrowLeft size={20} />
            Back to Login
          </button>

          <div className={styles.logo}>
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a reset code</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <Mail size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      )}

      {/* Reset Password View */}
      {currentView === 'resetPassword' && (
        <form onSubmit={handleResetPassword} className={styles.form}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => setCurrentView('forgotPassword')}
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className={styles.logo}>
            <h1>Reset Password</h1>
            <p>Enter the code sent to {forgotEmail}</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <KeyRound size={20} />
              <input
                type="text"
                placeholder="Enter OTP Code"
                value={resetData.otp}
                onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                required
                disabled={loading}
                maxLength={6}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <Lock size={20} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <Lock size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button
            type="button"
            className={styles.resendButton}
            onClick={handleResendOTP}
            disabled={loading}
          >
            Didn't receive the code? Resend
          </button>
        </form>
      )}

      {/* Success View */}
      {currentView === 'success' && (
        <div className={styles.form}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>

          <div className={styles.logo}>
            <h1>Password Reset!</h1>
            <p>Your password has been successfully reset</p>
          </div>

          <button
            type="button"
            className={styles.submitButton}
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}