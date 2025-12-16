'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Key, 
  Mail, 
  ArrowLeft, 
  Church,
  AlertCircle,
  CheckCircle,
  Shield,
  Lock
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { forgotPassword, resetPassword, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/admin');
    return null;
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const result = await forgotPassword(email);
    
    if (result.success) {
      setSuccess(result.message);
      // For demo, show the mock token
      console.log('Mock reset token: reset_token_12345');
      setTimeout(() => {
        setStep('reset');
        setSuccess('');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const result = await resetPassword(token, newPassword);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        router.push('/admin/auth/login');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Key className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {step === 'request' ? 'Reset Password' : 'Create New Password'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {step === 'request' 
                ? 'Enter your email to receive a reset link' 
                : 'Enter your new password below'}
            </p>
          </div>
        </div>

        {/* Back button */}
        <div>
          <Link
            href="/admin/auth/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>

        {/* Request Reset Form */}
        {step === 'request' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleRequestReset}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-orange-500 focus:border-transparent"
                    placeholder="admin@aagc.org"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg font-medium ${
                    isLoading
                      ? 'bg-amber-400 dark:bg-orange-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 dark:bg-orange-600 dark:hover:bg-orange-700'
                  } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Key className="h-5 w-5" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Demo Information */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                For Demo Purposes:
              </p>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Use email: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">admin@aagc.org</code></p>
                <p>Mock token will appear in console</p>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Form */}
        {step === 'reset' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reset Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter reset token"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Check your email for the reset token (demo: use any token)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg font-medium ${
                    isLoading
                      ? 'bg-amber-400 dark:bg-orange-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 dark:bg-orange-600 dark:hover:bg-orange-700'
                  } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Key className="h-5 w-5" />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Shield className="h-3 w-3" />
            <span>Password reset links expire in 1 hour</span>
          </div>
        </div>
      </div>
    </div>
  );
}