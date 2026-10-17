import React, { useState } from 'react';

interface SignInPageProps {
  onSignInSuccess: (user: { name: string; email: string }) => void;
  onNavigateToSignUp: () => void;
}

export default function SignInPage({ onSignInSuccess, onNavigateToSignUp }: SignInPageProps) {
  const [email, setEmail] = useState('arjun.rao@college.edu');
  const [password, setPassword] = useState('Redbull@005');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Derive name from email prefix or demo profile
      const derivedName = email.includes('arjun')
        ? 'Arjun Rao'
        : email.includes('sneha')
        ? 'Sneha Patel'
        : email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

      onSignInSuccess({ name: derivedName, email });
    }, 600);
  };

  const handleSSO = (provider: 'Google' | 'GitHub') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess({
        name: provider === 'Google' ? 'Arjun Rao' : 'Arjun Rao (GitHub)',
        email: provider === 'Google' ? 'arjun.rao@gmail.com' : 'arjun-rao@users.noreply.github.com'
      });
    }, 700);
  };

  const handleQuickFill = (preset: 'arjun' | 'sneha') => {
    if (preset === 'arjun') {
      setEmail('arjun.rao@college.edu');
      setPassword('Redbull@005');
    } else {
      setEmail('sneha.patel@nit.edu');
      setPassword('Redbull@005');
    }
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#191512] font-sans flex flex-col justify-between selection:bg-[#9c3d0c]/15 selection:text-[#9c3d0c]">
      
      {/* Top Header */}
      <header className="w-full bg-[#FBF9F6]/90 backdrop-blur-md border-b border-[#EDE6DE]/70 z-30 shrink-0">
        <div className="h-16 w-full max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#191512] text-[#FBF9F6] flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              IT
            </div>
            <span className="font-bold text-base tracking-tight text-[#191512]">
              IT Career Partner
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-wide text-[#78716c] px-2 py-0.5 rounded-full border border-[#EDE6DE] bg-white/70">
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
      <main className="w-full flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#EDE6DE] shadow-xl bg-white">
            
            {/* Left Column (~58% = 7 cols): Architectural Showcase */}
            <div className="lg:col-span-7 relative p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EDE6DE]/70 bg-gradient-to-br from-[#FDFBF7] via-[#F8F4EE] to-[#F3EDE3] overflow-hidden">
              
              {/* Soft ambient blur halos */}
              <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-12 right-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

              {/* Top Hero Text */}
              <div className="relative z-10 flex flex-col gap-3 max-w-lg">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] font-semibold text-[#9c3d0c]">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span>Continuous Verification Gateway</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#191512] leading-[1.15]">
                  Authentic IT Careers for Indian Freshers.
                </h1>
                
                <p className="text-sm text-[#635b53] leading-relaxed mt-1 font-normal">
                  Zero phantom listings. Direct corporate ATS links, verified salary floors (&gt; ₹2.4 LPA), and zero consultancy bonds.
                </p>
              </div>

              {/* Showcase Card: Gatekeeper Verification Report */}
              <div className="relative z-10 my-8 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_12px_32px_rgba(30,20,10,0.06)] flex flex-col gap-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#f1ebe3]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#10b981]/15 text-[#047857] flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#191512]">
                      Verified Gatekeeper Protocol
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-[#10b981]/10 text-[#047857] border border-[#10b981]/20">
                    ACTIVE RADAR
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DE] text-center">
                    <div className="text-base sm:text-lg font-black text-[#191512]">0 YOE</div>
                    <div className="text-[10px] font-mono text-[#78716c] uppercase mt-0.5">Strict Freshers</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DE] text-center">
                    <div className="text-base sm:text-lg font-black text-[#047857]">≥ ₹2.4 LPA</div>
                    <div className="text-[10px] font-mono text-[#78716c] uppercase mt-0.5">Base CTC Floor</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DE] text-center">
                    <div className="text-base sm:text-lg font-black text-[#9c3d0c]">₹0 Bond</div>
                    <div className="text-[10px] font-mono text-[#78716c] uppercase mt-0.5">Zero Exploitation</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-[#635b53] font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    Bangalore • Hyderabad • Pune • Remote
                  </span>
                  <span className="text-[#9c3d0c] font-semibold">1,420 Active Roles</span>
                </div>
              </div>

              {/* Bottom Telemetry Stamp */}
              <div className="relative z-10 flex items-center justify-between text-xs text-[#78716c] pt-2">
                <span className="font-mono text-[11px]">
                  🛡️ Deterministic ATS matching tailored to your master resume
                </span>
              </div>
            </div>

            {/* Right Column (~42% = 5 cols): Sign In Form */}
            <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-[#191512]">
                  Sign in to your console
                </h2>
                <p className="text-xs sm:text-sm text-[#78716c] mt-1">
                  Enter your engineering credentials or single sign-on.
                </p>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => handleSSO('Google')}
                  className="h-11 px-3 rounded-xl border border-[#EDE6DE] hover:border-[#cbd5e1] hover:bg-[#FAF8F5] transition-all flex items-center justify-center gap-2.5 text-xs font-semibold text-[#191512] shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSSO('GitHub')}
                  className="h-11 px-3 rounded-xl border border-[#EDE6DE] hover:border-[#cbd5e1] hover:bg-[#FAF8F5] transition-all flex items-center justify-center gap-2.5 text-xs font-semibold text-[#191512] shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-[#EDE6DE] w-full"></div>
                <span className="bg-white px-3 text-[11px] font-mono text-[#94a3b8] uppercase tracking-wider whitespace-nowrap">
                  or with college / personal email
                </span>
                <div className="border-t border-[#EDE6DE] w-full"></div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#191512]">
                      Email Address
                    </label>
                    <span className="text-[10px] font-mono text-[#94a3b8]">
                      Personal or college domain
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arjun.rao@college.edu"
                      required
                      className="w-full h-11 pl-3.5 pr-4 rounded-xl bg-[#FAF8F5] focus:bg-white text-sm text-[#191512] placeholder:text-[#94a3b8] border border-[#EDE6DE] focus:border-[#9c3d0c] focus:ring-2 focus:ring-[#9c3d0c]/15 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#191512]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs font-medium text-[#9c3d0c] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-[#FAF8F5] focus:bg-white text-sm text-[#191512] placeholder:text-[#94a3b8] border border-[#EDE6DE] focus:border-[#9c3d0c] focus:ring-2 focus:ring-[#9c3d0c]/15 outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#191512] p-1 text-xs"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#EDE6DE] text-[#9c3d0c] focus:ring-[#9c3d0c]"
                    />
                    <span className="text-xs text-[#635b53]">Remember this terminal session</span>
                  </label>
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#191512] hover:bg-[#2d2824] text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Access Telemetry Dashboard</span>
                      <span className="text-base">→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill Demo Presets */}
              <div className="mt-5 pt-4 border-t border-[#f1ebe3] flex items-center justify-between">
                <span className="text-[10.5px] font-mono text-[#94a3b8] uppercase">Quick Demo Fill:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('arjun')}
                    className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#f3ede3] border border-[#EDE6DE] text-[11px] font-medium text-[#191512] transition-colors"
                  >
                    Arjun (2024)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('sneha')}
                    className="px-2 py-0.5 rounded-md bg-[#FAF8F5] hover:bg-[#f3ede3] border border-[#EDE6DE] text-[11px] font-medium text-[#191512] transition-colors"
                  >
                    Sneha (2025)
                  </button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-4 text-center">
                <p className="text-xs text-[#635b53]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToSignUp}
                    className="font-bold text-[#9c3d0c] hover:underline"
                  >
                    Create a fresher account
                  </button>
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#EDE6DE]">
            <h3 className="text-lg font-bold text-[#191512] mb-1">Reset Password</h3>
            <p className="text-xs text-[#635b53] mb-4">
              Enter your registered engineering college or personal email address to receive an instant verification reset link.
            </p>
            {resetEmailSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center">
                <div className="text-base mb-1">📬</div>
                <div className="font-semibold">Reset instructions dispatched!</div>
                <div className="text-[11px] mt-1 text-emerald-600">Check your inbox for a 256-bit secure reset link.</div>
                <button
                  type="button"
                  onClick={() => { setForgotModalOpen(false); setResetEmailSent(false); }}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setResetEmailSent(true); }} className="space-y-3">
                <input
                  type="email"
                  defaultValue={email}
                  required
                  placeholder="name@college.edu"
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE6DE] text-xs outline-none focus:border-[#9c3d0c]"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-[#EDE6DE] text-xs font-semibold text-[#635b53] hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#191512] text-white text-xs font-semibold hover:bg-[#2d2824]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-[#EDE6DE]/70 py-4 bg-white/50 text-center">
        <div className="text-[11px] font-mono text-[#78716c]">
          IT Career Partner • Sovereign Engineering Intelligence • India Sector
        </div>
      </footer>

    </div>
  );
}
