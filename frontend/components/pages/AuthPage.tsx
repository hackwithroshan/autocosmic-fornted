import React, { useState, useEffect } from 'react';
import { UserRole, AuthPageSettings } from '../../types';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import FacebookIcon from '../icons/FacebookIcon';

interface AuthPageProps {
  onLogin: (credentials: {email: string, password: string}) => Promise<{success: boolean, error?: string, role?: UserRole}>;
  onRegister: (credentials: {name: string, email: string, password: string}) => Promise<{success: boolean, error?: string, errors?: string[]}>;
  navigateToPage: (page: 'home') => void;
  settings: AuthPageSettings;
  storeName: string;
}

// Helper component for input fields.
const InputField = ({ name, label, type, value, onChange, helperText, autoComplete }: { name: string, label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, helperText?: string, autoComplete?: string }) => (
    <div>
        <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
        <input 
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zaina-primary/50 focus:border-zaina-primary outline-none transition"
        />
        {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, navigateToPage, settings, storeName }) => {
  const [view, setView] = useState<'register' | 'login' | 'forgotPassword'>('login');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear errors on view change
  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [view]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!loginData.email || !loginData.password) {
      setError('Email and password are required.');
      return;
    }
    setIsLoading(true);
    const result = await onLogin(loginData);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed.');
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
     if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Please fill all fields.');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    const result = await onRegister({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
    });
    setIsLoading(false);
  
    if (result.success) {
      setMessage('Registration successful! Please log in to continue.');
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
      setView('login');
    } else {
      const errorMessage = result.errors ? result.errors.join(' \n') : result.error;
      setError(errorMessage || 'Registration failed. Please try again.');
    }
  };
  
  const renderLogin = () => (
    <>
      <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
      <p className="text-sm text-gray-500 mt-2">Sign in to continue your journey.</p>
      {message && <p className="text-center text-xs text-green-600 mt-4 bg-green-100 p-2 rounded">{message}</p>}
      <form onSubmit={handleLoginSubmit} className="mt-8 space-y-5">
        <InputField name="email" label="E-mail or phone number" type="email" value={loginData.email} onChange={handleLoginChange} autoComplete="email" />
        <InputField name="password" label="Password" type="password" value={loginData.password} onChange={handleLoginChange} autoComplete="current-password" />
        {error && <p className="text-center text-xs text-red-500 whitespace-pre-line">{error}</p>}
        <div className="flex items-center justify-between">
            <label htmlFor="remember" className="text-xs text-gray-600 flex items-center">
                <input type="checkbox" id="remember" className="mr-2 h-4 w-4 rounded border-gray-300 text-zaina-primary focus:ring-zaina-primary" />
                Remember me
            </label>
            <button type="button" onClick={() => setView('forgotPassword')} className="text-xs font-semibold text-zaina-primary hover:underline">Forgot password?</button>
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-3 text-white font-semibold rounded-lg bg-zaina-primary hover:bg-zaina-cta-blue transition-colors disabled:opacity-70">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 mt-6">
        Don't have an account? <button onClick={() => setView('register')} className="font-semibold text-zaina-primary hover:underline">Register now</button>
      </p>
    </>
  );
  
  const renderRegister = () => (
    <>
      <h2 className="text-3xl font-bold text-gray-800">Create your account</h2>
      <p className="text-sm text-gray-500 mt-2">It's free and easy</p>
      <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-4">
        <InputField name="name" label="Your name" type="text" value={registerData.name} onChange={handleRegisterChange} autoComplete="name" />
        <InputField name="email" label="E-mail or phone number" type="email" value={registerData.email} onChange={handleRegisterChange} autoComplete="email" />
        <InputField name="password" label="Password" type="password" value={registerData.password} onChange={handleRegisterChange} helperText="Must be 8 characters at least" autoComplete="new-password"/>
        <InputField name="confirmPassword" label="Confirm Password" type="password" value={registerData.confirmPassword} onChange={handleRegisterChange} autoComplete="new-password" />
        <div className="text-xs text-gray-500 flex items-start">
            <input type="checkbox" id="terms" className="mt-0.5 mr-2 h-4 w-4 rounded border-gray-300 text-zaina-primary focus:ring-zaina-primary"/>
            <label htmlFor="terms">By creating an account means you agree to the <a href="#" className="font-semibold text-zaina-primary hover:underline">Terms and Conditions</a>, and our <a href="#" className="font-semibold text-zaina-primary hover:underline">Privacy Policy</a>.</label>
        </div>
        {error && <p className="text-center text-xs text-red-500 whitespace-pre-line">{error}</p>}
        <button type="submit" disabled={isLoading} className="w-full py-3 text-white font-semibold rounded-lg bg-zaina-primary hover:bg-zaina-cta-blue transition-colors disabled:opacity-70">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="text-center text-xs text-gray-400 my-4">or do it via other accounts</div>
      <div className="flex justify-center gap-4">
        <button className="p-2 border rounded-md hover:bg-gray-100"><GoogleIcon className="w-5 h-5"/></button>
        <button className="p-2 border rounded-md hover:bg-gray-100"><AppleIcon className="w-5 h-5"/></button>
        <button className="p-2 border rounded-md hover:bg-gray-100"><FacebookIcon className="w-5 h-5 text-[#1877F2]"/></button>
      </div>
       <p className="text-xs text-center text-gray-500 mt-6">
        Already have an account? <button onClick={() => setView('login')} className="font-semibold text-zaina-primary hover:underline">Log in</button>
      </p>
    </>
  );

  const renderForgotPassword = () => (
    <>
      <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
      <p className="text-sm text-gray-500 mt-2">Enter your email to receive a reset link.</p>
      {message && <p className="text-center text-xs text-green-600 mt-4 bg-green-100 p-2 rounded">{message}</p>}
      {error && <p className="text-center text-xs text-red-500 mt-4 bg-red-100 p-2 rounded">{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); setError(null); setMessage("If an account exists for this email, a reset link has been sent (simulated)."); }} className="mt-8 space-y-5">
        <InputField name="email" label="E-mail address" type="email" value={loginData.email} onChange={handleLoginChange} autoComplete="email" />
        <button type="submit" disabled={isLoading} className="w-full py-3 text-white font-semibold rounded-lg bg-zaina-primary hover:bg-zaina-cta-blue transition-colors disabled:opacity-70">
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 mt-6">
        Remembered your password? <button onClick={() => setView('login')} className="font-semibold text-zaina-primary hover:underline">Log in</button>
      </p>
    </>
  );

  const renderContent = () => {
      switch(view) {
          case 'register': return renderRegister();
          case 'login': return renderLogin();
          case 'forgotPassword': return renderForgotPassword();
          default: return renderRegister();
      }
  };
  
  return (
    <div className="py-12 md:py-16 font-sans">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-16 shadow-2xl rounded-2xl overflow-hidden bg-white">
          
          {/* Left Column */}
          <div className="h-full p-8 md:p-12 text-white flex-col justify-between hidden lg:flex" style={{ background: settings.backgroundColor }}>
            <div>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('home'); }} className="font-bold text-xl">{storeName}</a>
                <img src={settings.imageUrl} alt="Authentication page illustration" className="w-full max-w-sm mx-auto rounded-lg shadow-xl mt-12"/>
            </div>
            <div className="mt-8">
                <p className="text-lg font-medium">{settings.title}</p>
                <p className="text-sm opacity-80 mt-1">{settings.subtitle}</p>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="p-8 md:p-12">
            {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;