'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResora } from '@/context/ResoraContext';
import { UserRole } from '@/types';
import {
  GraduationCap,
  UserCheck,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User as UserIcon,
  Loader2,
  Sparkles,
  KeyRound,
  X,
  BadgeCheck
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const {
    setRole,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    resetPassword,
  } = useResora();

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('student@resora.demo');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Role specific fields for sign up
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState<number>(3);
  const [title, setTitle] = useState('');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getDashboardPath = (role: UserRole) => {
    if (role === 'STUDENT') return '/student/dashboard';
    if (role === 'FACULTY') return '/faculty/dashboard';
    return '/admin/dashboard';
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // If it's a demo credential or offline fallback
    if (email.endsWith('@resora.demo') || email === 'aryan@college.edu') {
      setRole(selectedRole);
      router.push(getDashboardPath(selectedRole));
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithEmail(email, password, selectedRole);
      if (result.success) {
        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => {
          router.push(getDashboardPath(selectedRole));
        }, 500);
      } else {
        setErrorMsg(result.error || 'Failed to sign in. Please verify your email and password.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const extra = {
        rollNumber: selectedRole === 'STUDENT' ? rollNumber || '24CS' + Math.floor(100 + Math.random() * 900) : undefined,
        department,
        academicYear: selectedRole === 'STUDENT' ? academicYear : undefined,
        title: selectedRole === 'FACULTY' ? (title || 'Assistant Professor') : selectedRole === 'ADMIN' ? (title || 'Campus Administrator') : undefined,
      };

      const result = await registerWithEmail(email, password, name.trim(), selectedRole, extra);
      if (result.success) {
        setSuccessMsg('Account registered successfully! Welcome to RESORA.');
        setTimeout(() => {
          router.push(getDashboardPath(selectedRole));
        }, 700);
      } else {
        setErrorMsg(result.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const result = await loginWithGoogle(selectedRole);
      if (result.success) {
        setSuccessMsg('Authenticated with Google! Redirecting...');
        setTimeout(() => {
          router.push(getDashboardPath(selectedRole));
        }, 500);
      } else {
        setErrorMsg(result.error || 'Google authentication failed.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to authenticate with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Handler
  const handleSendResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setForgotLoading(true);
    setForgotStatus(null);

    const result = await resetPassword(forgotEmail);
    setForgotLoading(false);

    if (result.success) {
      setForgotStatus({
        type: 'success',
        message: 'Password reset link sent! Please check your inbox.',
      });
    } else {
      setForgotStatus({
        type: 'error',
        message: result.error || 'Failed to send password reset email.',
      });
    }
  };

  // 1-Click Quick Demo Switcher
  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    setRole(role);
    if (role === 'STUDENT') {
      setEmail('student@resora.demo');
      setPassword('password123');
      router.push('/student/dashboard');
    } else if (role === 'FACULTY') {
      setEmail('faculty@resora.demo');
      setPassword('password123');
      router.push('/faculty/dashboard');
    } else {
      setEmail('admin@resora.demo');
      setPassword('password123');
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans relative">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        {/* Left Form Section */}
        <div className="p-8 sm:p-12 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Logo Header */}
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="inline-flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold font-heading text-2xl shadow-glow">
                  R
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-xl tracking-tight block">RESORA</span>
                  <span className="text-[10px] text-brand-600 font-semibold tracking-wider uppercase">Campus Intelligence</span>
                </div>
              </Link>

              {/* Firebase badge */}
              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-medium text-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Firebase Auth</span>
              </div>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`pb-3 text-sm font-bold transition-all relative ${
                  authMode === 'signin'
                    ? 'text-brand-600 border-b-2 border-brand-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  if (email.endsWith('@resora.demo')) {
                    setEmail('');
                    setPassword('');
                  }
                }}
                className={`pb-3 ml-6 text-sm font-bold transition-all relative ${
                  authMode === 'signup'
                    ? 'text-brand-600 border-b-2 border-brand-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Create Account
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              {authMode === 'signin' ? 'Welcome Back' : 'Create Your Campus Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {authMode === 'signin'
                ? 'Sign in to access your bookings, resources, and campus portal'
                : 'Join the smart campus network with your university credentials'}
            </p>

            {/* Role Selector Segmented Switcher */}
            <div className="mt-5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('STUDENT');
                    if (email.endsWith('@resora.demo')) setEmail('student@resora.demo');
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                    selectedRole === 'STUDENT'
                      ? 'bg-white text-brand-600 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('FACULTY');
                    if (email.endsWith('@resora.demo')) setEmail('faculty@resora.demo');
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                    selectedRole === 'FACULTY'
                      ? 'bg-white text-emerald-600 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Faculty</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('ADMIN');
                    if (email.endsWith('@resora.demo')) setEmail('admin@resora.demo');
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'bg-white text-purple-600 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMsg}</div>
                <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-700 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{successMsg}</div>
              </div>
            )}

            {/* Google Authentication Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-2.5 transition-all shadow-sm hover:shadow"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                    Or with campus email
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Sign In vs Sign Up Form */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="e.g. aryan@college.edu"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-brand-600 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-600 focus:ring-brand-500" />
                    <span>Keep me signed in</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Create Account (Sign Up) Form */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="e.g. Aryan Sharma"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="e.g. aryan@university.edu"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* Role Specific Fields */}
                {selectedRole === 'STUDENT' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Roll / ID No.</label>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={e => setRollNumber(e.target.value)}
                        placeholder="e.g. 21CS104"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                      <select
                        value={academicYear}
                        onChange={e => setAcademicYear(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
                      >
                        <option value={1}>1st Year (Freshman)</option>
                        <option value={2}>2nd Year (Sophomore)</option>
                        <option value={3}>3rd Year (Junior)</option>
                        <option value={4}>4th Year (Senior)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {selectedRole === 'FACULTY' ? 'Department & Designation' : 'Department / Unit'}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder={selectedRole === 'FACULTY' ? 'e.g. Associate Professor, CSE' : 'e.g. Facilities & Tech Ops'}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="Min 6 characters"
                        className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm password"
                        className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  By registering, you agree to the{' '}
                  <span className="text-brand-600 font-medium cursor-pointer">Campus Usage Policy</span> and terms.
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  1-Click Quick Demo Access
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  Instant Test
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('STUDENT')}
                  className="p-2 border border-slate-200 hover:border-brand-500 bg-slate-50 hover:bg-brand-50 rounded-xl text-[11px] font-semibold text-slate-700 text-center transition-all group"
                >
                  <div className="font-bold group-hover:text-brand-700">Student Demo</div>
                  <div className="text-[9px] text-slate-400 font-normal">Aryan Sharma</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('FACULTY')}
                  className="p-2 border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50 rounded-xl text-[11px] font-semibold text-slate-700 text-center transition-all group"
                >
                  <div className="font-bold group-hover:text-emerald-700">Faculty Demo</div>
                  <div className="text-[9px] text-slate-400 font-normal">Dr. S. Jenkins</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('ADMIN')}
                  className="p-2 border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50 rounded-xl text-[11px] font-semibold text-slate-700 text-center transition-all group"
                >
                  <div className="font-bold group-hover:text-purple-700">Admin Demo</div>
                  <div className="text-[9px] text-slate-400 font-normal">Dean Operations</div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            {authMode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Campus Visual Hero */}
        <div className="bg-slate-900 text-white p-12 flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
            alt="Campus"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-500/30 text-brand-300 rounded-full text-xs font-semibold mb-4 border border-brand-500/40">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              <span>Campus Intelligence Ecosystem</span>
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight leading-tight">
              Learn.<br />Book.<br />Grow.<br />All In One Place.
            </h3>
            <p className="text-slate-300 text-xs mt-3 max-w-sm leading-relaxed">
              Connect to cutting-edge campus laboratories, book resources with smart conflict checking, discover hackathons, and accelerate student success.
            </p>
          </div>

          <div className="relative z-10 space-y-3.5 bg-slate-950/40 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
              Platform Capabilities
            </div>
            {[
              { title: 'Campus Resources & Smart Finder', desc: 'AI-assisted slot recommendations & equipment bundle checks' },
              { title: 'Placements & Exam Roadmaps', desc: 'Curated semester preparation guides and mock exams' },
              { title: 'Hackathons & Internships', desc: 'Direct faculty endorsements and vetted opportunities' },
              { title: 'Digital QR Passes', desc: 'Instant pass verification and automated check-in logging' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-4">
            <div>© 2026 RESORA · Smart Campus Platform</div>
            <div className="flex items-center space-x-2 text-emerald-400 font-medium">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Firebase Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotStatus(null);
              }}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Reset Campus Password</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Enter your registered university email. We will send an official Firebase password reset link to your inbox.
            </p>

            {forgotStatus && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center space-x-2 ${
                  forgotStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {forgotStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                )}
                <span>{forgotStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSendResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    placeholder="e.g. aryan@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStatus(null);
                  }}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-1/2 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
