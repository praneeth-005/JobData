import React, { useState } from 'react';

interface SignInPageProps {
  onSignInSuccess: () => void;
  onNavigateToSignUp: () => void;
}

export default function SignInPage({ onSignInSuccess, onNavigateToSignUp }: SignInPageProps) {
  const [email, setEmail] = useState('arjun.rao@college.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#191512] font-sans flex flex-col justify-between selection:bg-[#4338ca] selection:text-white">
      
      {/* Chrome Top Header */}
      <header className="w-full bg-[#FBF9F6]/90 backdrop-blur-md border-b border-[#EDE6DE]/70 z-30 shrink-0">
        <div className="h-16 w-full max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#191512] text-[#FBF9F6] flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              IT
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-[#191512]">
              IT Career Partner
            </span>
            <span className="hidden sm:inline-block text-[10.5px] font-mono tracking-wide text-[#78716c] px-2 py-0.5 rounded-full border border-[#EDE6DE] bg-white/70">
              STUDIO v1.0
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EDE6DE] text-[11px] font-mono text-[#57534e] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>256-Bit Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Viewport Content: Left Architectural Showcase + Right Sign In Form */}
      <main className="w-full flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#EDE6DE] shadow-xs bg-white">
          
          {/* Left Column (~55% = 7 cols): Architectural Showcase */}
          <div className="lg:col-span-7 relative p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EDE6DE]/70 bg-gradient-to-br from-[#F9F6F0] via-[#F8F4EE] to-[#F5EFE6]">
            
            <div className="flex flex-col gap-3 max-w-lg z-10">
              <span className="font-mono text-[11px] tracking-wider uppercase text-[#c2410c] font-bold">
                Zero-Tolerance Anti-Scam Gateway
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191512] leading-tight">
                Authentic IT Careers for Indian Freshers.
              </h1>
              <p className="text-sm text-[#78716c] leading-relaxed mt-1">
                Access curated 0 YOE opportunities, direct corporate ATS portals, and verified salary floors (&gt; ₹2.4 LPA) with zero bonds.
              </p>
            </div>

            {/* Showcase Feature Tile */}
            <div className="my-8 p-5 rounded-xl bg-white/90 border border-[#EDE6DE] backdrop-blur-md shadow-xs flex flex-col gap-3 z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#191512] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#059669]">verified_user</span>
                  Verified Fresher Protocol
                </span>
                <span className="font-mono text-[10px] bg-[#ecfdf5] text-[#059669] font-bold px-2 py-0.5 rounded">
                  ACTIVE GATE
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EDE6DE]">
                  <span className="text-base font-bold text-[#191512] block">0 YOE</span>
                  <span className="text-[10px] text-[#78716c]">Freshers Only</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EDE6DE]">
                  <span className="text-base font-bold text-[#059669] block">≥ ₹2.4L</span>
                  <span className="text-[10px] text-[#78716c]">Base CTC Floor</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EDE6DE]">
                  <span className="text-base font-bold text-[#191512] block">₹0 Bond</span>
                  <span className="text-[10px] text-[#78716c]">No Fees / Bonds</span>
                </div>
              </div>
            </div>

            {/* Footer Trust Quote */}
            <div className="flex items-center gap-2 text-xs text-[#78716c] z-10">
              <span className="material-symbols-outlined text-[15px] text-[#059669]">shield_check</span>
              <span>Epistemic truth standards enforced across 42 active Indian crawlers.</span>
            </div>

          </div>

          {/* Right Column (~45% = 5 cols): Sign In Form */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-white">
            
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#191512]">
                Sign in to your console
              </h2>
              <p className="text-xs text-[#78716c]">
                Enter your credentials to manage your verified fresher feed.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191512] flex items-center justify-between">
                  <span>Email address</span>
                  <span className="text-[11px] font-mono text-[#78716c] font-normal">Personal or college email</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[18px] text-[#9ca3af] absolute left-3">
                    mail
                  </span>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full h-10 pl-9 pr-3 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] placeholder-[#9ca3af] focus:outline-none focus:border-[#4338ca] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191512]">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => alert("Password reset instructions sent to registered email.")}
                    className="text-[11px] font-medium text-[#4338ca] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-[18px] text-[#9ca3af] absolute left-3">
                    lock
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 pl-9 pr-10 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] placeholder-[#9ca3af] focus:outline-none focus:border-[#4338ca] focus:bg-white transition font-mono"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#9ca3af] hover:text-[#191512]"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#d1d5db] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5"
                />
                <label htmlFor="remember" className="text-xs text-[#57534e] cursor-pointer select-none">
                  Remember this terminal session
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#191512] hover:bg-[#332b25] text-[#FBF9F6] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition shadow-xs mt-1"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>

              {/* Passkey option */}
              <button 
                type="button"
                onClick={onSignInSuccess}
                className="w-full h-10 bg-[#FAF8F5] hover:bg-[#f3ede4] text-[#191512] font-medium text-xs rounded-lg flex items-center justify-center gap-2 border border-[#EDE6DE] transition"
              >
                <span className="material-symbols-outlined text-[17px] text-[#4338ca]">fingerprint</span>
                <span>Continue with Passkey</span>
              </button>

            </form>

            <div className="mt-6 pt-4 border-t border-[#f1f5f9] text-center text-xs text-[#78716c]">
              Don&apos;t have an account?{' '}
              <button 
                onClick={onNavigateToSignUp}
                className="font-bold text-[#4338ca] hover:underline"
              >
                Sign up
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Chrome Bottom Footer */}
      <footer className="w-full py-4 border-t border-[#EDE6DE]/70 text-center text-[11px] font-mono text-[#a8a29e]">
        IT Career Partner • Sovereign Engineering Intelligence • India Sector
      </footer>

    </div>
  );
}
