import React, { useState } from 'react';

interface SignUpPageProps {
  onSignUpSuccess: (user: { name: string; email: string }) => void;
  onNavigateToSignIn: () => void;
}

export default function SignUpPage({ onSignUpSuccess, onNavigateToSignIn }: SignUpPageProps) {
  const [fullName, setFullName] = useState('Arjun Rao');
  const [email, setEmail] = useState('arjun.rao@college.edu');
  const [graduationYear, setGraduationYear] = useState('2024 Batch');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [targetTrack, setTargetTrack] = useState('Full Stack Engineering');
  const [password, setPassword] = useState('Redbull@005');
  const [confirmPassword, setConfirmPassword] = useState('Redbull@005');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const pwdScore = calculatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to the Zero Fake Experience & Anti-Bond Pledge.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess({ name: fullName, email });
    }, 700);
  };

  const handleSSO = (provider: 'Google' | 'GitHub') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess({
        name: provider === 'Google' ? 'Arjun Rao' : 'Arjun Rao (GitHub)',
        email: provider === 'Google' ? 'arjun.rao@gmail.com' : 'arjun-rao@users.noreply.github.com'
      });
    }, 700);
  };

  const handleQuickFill = () => {
    setFullName('Sneha Patel');
    setEmail('sneha.patel@nit.edu');
    setGraduationYear('2025 Batch');
    setDegree('B.Tech Electronics & Communication');
    setTargetTrack('QA Automation');
    setPassword('Redbull@005');
    setConfirmPassword('Redbull@005');
    setAgreeTerms(true);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#191512] font-sans flex flex-col justify-between selection:bg-[#9c3d0c]/15 selection:text-[#9c3d0c]">
      
      {/* Top Header */}
      <header className="w-full bg-[#fbf7f4]/90 backdrop-blur-md border-b border-[#EDE6DE]/70 z-30 shrink-0">
        <div className="h-16 max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#9c3d0c] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              IT
            </div>
            <span className="font-bold text-base tracking-tight text-[#191512]">
              IT Career Partner
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-wide text-[#78716c] px-2 py-0.5 rounded-full border border-[#EDE6DE] bg-white/70">
              FRESHER REGISTER
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EDE6DE] text-[11px] font-mono text-[#57534e] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>256-Bit Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="w-full flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#EDE6DE] shadow-xl bg-white">
            
            {/* Left Column (~52% = 6 cols on lg): Hero & Guarantees */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EDE6DE]/70 bg-gradient-to-br from-[#FDFBF7] via-[#F8F4EE] to-[#F3EDE3] relative overflow-hidden">
              
              {/* Subtle ambient light */}
              <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#9c3d0c]/5 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-wider uppercase text-[#9c3d0c] font-bold">
                  STUDENT &amp; FRESHER EXCLUSIVE
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191512] leading-[1.15]">
                  Designed exclusively for <span className="text-[#9c3d0c]">2024, 2025 &amp; 2026</span> Indian IT freshers.
                </h1>
                <p className="text-sm text-[#78716c] leading-relaxed mt-1">
                  Zero spam. Zero customer support or telecalling roles. We audit every posting down to contract terms, bond clauses, and real market pay.
                </p>
              </div>

              {/* 3 Value Proposition Cards */}
              <div className="relative z-10 my-8 space-y-3.5">
                
                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-white/90 shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 text-[#047857] flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                    🎯
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#191512]">0 Years Experience Locked</div>
                    <div className="text-[11.5px] text-[#78716c] mt-0.5 leading-snug">
                      No postings asking for 2-3 years will ever show up in your radar.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-white/90 shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0284c7]/15 text-[#0284c7] flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                    💵
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#191512]">Verified CTC Floor ≥ ₹2.4 LPA</div>
                    <div className="text-[11.5px] text-[#78716c] mt-0.5 leading-snug">
                      Paid internships (&gt; ₹5k WFH, &gt; ₹10k WFO) and full-time packages verified against exploitation.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-white/90 shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#9c3d0c]/15 text-[#9c3d0c] flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                    🛡️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#191512]">Zero Bond Guarantee</div>
                    <div className="text-[11.5px] text-[#78716c] mt-0.5 leading-snug">
                      100% verified against service bonds, certificate surrender, or upfront training fee scams.
                    </div>
                  </div>
                </div>

              </div>

              {/* Live Telemetry Pill */}
              <div className="relative z-10 flex items-center justify-between text-xs text-[#78716c] pt-2 border-t border-[#EDE6DE]/70">
                <span className="font-mono text-[11px] text-[#635b53]">
                  ⚡ 1,420 Active Roles • 89 Companies Hiring
                </span>
                <span className="text-[11px] font-bold text-[#047857]">
                  0 Scams Allowed
                </span>
              </div>

            </div>

            {/* Right Column (~48% = 6 cols on lg): Registration Form */}
            <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
              
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#191512]">
                    Create your account
                  </h2>
                  <p className="text-xs text-[#78716c] mt-0.5">
                    Setup your fresher profile in 30 seconds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#f3ede3] border border-[#EDE6DE] text-[10.5px] font-mono font-semibold text-[#9c3d0c] transition-colors"
                >
                  ⚡ Quick-Fill
                </button>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleSSO('Google')}
                  className="h-10 px-3 rounded-xl border border-[#EDE6DE] hover:border-[#cbd5e1] hover:bg-[#FAF8F5] transition-all flex items-center justify-center gap-2 text-xs font-semibold text-[#191512] shadow-2xs"
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
                  className="h-10 px-3 rounded-xl border border-[#EDE6DE] hover:border-[#cbd5e1] hover:bg-[#FAF8F5] transition-all flex items-center justify-center gap-2 text-xs font-semibold text-[#191512] shadow-2xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#EDE6DE] w-full"></div>
                <span className="bg-white px-3 text-[10.5px] font-mono text-[#94a3b8] uppercase tracking-wider whitespace-nowrap">
                  or register with email
                </span>
                <div className="border-t border-[#EDE6DE] w-full"></div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#191512] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Arjun Rao"
                      required
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] focus:bg-white text-xs text-[#191512] placeholder:text-[#94a3b8] border border-[#EDE6DE] focus:border-[#9c3d0c] focus:ring-1 focus:ring-[#9c3d0c]/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191512] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arjun@college.edu"
                      required
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] focus:bg-white text-xs text-[#191512] placeholder:text-[#94a3b8] border border-[#EDE6DE] focus:border-[#9c3d0c] focus:ring-1 focus:ring-[#9c3d0c]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Batch & Degree */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#191512] mb-1">
                      Graduation Batch
                    </label>
                    <select
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] focus:bg-white text-xs text-[#191512] border border-[#EDE6DE] focus:border-[#9c3d0c] outline-none"
                    >
                      <option>2024 Batch</option>
                      <option>2025 Batch</option>
                      <option>2026 Batch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191512] mb-1">
                      Degree / Stream
                    </label>
                    <select
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#FAF8F5] focus:bg-white text-xs text-[#191512] border border-[#EDE6DE] focus:border-[#9c3d0c] outline-none"
                    >
                      <option>B.Tech Computer Science</option>
                      <option>B.Tech Information Tech</option>
                      <option>B.Tech ECE / Electronics</option>
                      <option>MCA / BCA</option>
                      <option>B.Sc Computer Science</option>
                    </select>
                  </div>
                </div>

                {/* Target Role Track */}
                <div>
                  <label className="block text-xs font-semibold text-[#191512] mb-1.5">
                    Target Primary Track
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Full Stack Engineering',
                      'Backend / Cloud',
                      'QA Automation',
                      'Frontend',
                      'Data & AI'
                    ].map((track) => (
                      <button
                        type="button"
                        key={track}
                        onClick={() => setTargetTrack(track)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          targetTrack === track
                            ? 'bg-[#9c3d0c] text-white shadow-2xs font-semibold'
                            : 'bg-[#FAF8F5] text-[#635b53] border border-[#EDE6DE] hover:bg-[#f3ede3]'
                        }`}
                      >
                        {track}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#191512]">
                        Password
                      </label>
                      <span className={`text-[10px] font-mono font-bold ${
                        pwdScore >= 3 ? 'text-[#047857]' : pwdScore === 2 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {pwdScore >= 3 ? 'Strong' : pwdScore === 2 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full h-10 px-3 pr-8 rounded-xl bg-[#FAF8F5] focus:bg-white text-xs text-[#191512] border border-[#EDE6DE] focus:border-[#9c3d0c] outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#191512] text-xs p-1"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#191512]">
                        Confirm Password
                      </label>
                      {passwordsMatch && (
                        <span className="text-[10px] font-mono text-[#047857] font-bold">
                          ✓ Matches
                        </span>
                      )}
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className={`w-full h-10 px-3 rounded-xl bg-[#FAF8F5] focus:bg-white text-xs text-[#191512] border outline-none font-mono ${
                        confirmPassword.length > 0 && !passwordsMatch
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-[#EDE6DE] focus:border-[#9c3d0c]'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Strength Indicator Bars */}
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  <div className={`h-1 rounded-full ${pwdScore >= 1 ? 'bg-red-500' : 'bg-stone-200'}`}></div>
                  <div className={`h-1 rounded-full ${pwdScore >= 2 ? 'bg-amber-500' : 'bg-stone-200'}`}></div>
                  <div className={`h-1 rounded-full ${pwdScore >= 3 ? 'bg-emerald-500' : 'bg-stone-200'}`}></div>
                  <div className={`h-1 rounded-full ${pwdScore >= 4 ? 'bg-emerald-600' : 'bg-stone-200'}`}></div>
                </div>

                {/* Anti-Exploitation Pledge Checkbox */}
                <div className="pt-1.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-[#EDE6DE] text-[#9c3d0c] focus:ring-[#9c3d0c] mt-0.5"
                    />
                    <span className="text-[11.5px] text-[#635b53] leading-snug">
                      I confirm genuine graduation credentials and agree to the <strong className="text-[#191512]">Zero Fake Experience &amp; Anti-Bond Pledge</strong>.
                    </span>
                  </label>
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#9c3d0c] hover:bg-[#853309] text-white font-semibold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating verified profile...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create Fresher Account</span>
                      <span className="text-base">→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-4 text-center">
                <p className="text-xs text-[#635b53]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToSignIn}
                    className="font-bold text-[#9c3d0c] hover:underline"
                  >
                    Sign in to your console
                  </button>
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#EDE6DE]/70 py-4 bg-white/50 text-center">
        <div className="text-[11px] font-mono text-[#78716c]">
          IT Career Partner • Ultra-Premium Engineering Console • India Sector
        </div>
      </footer>

    </div>
  );
}
