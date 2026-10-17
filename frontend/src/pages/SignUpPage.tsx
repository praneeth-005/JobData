import React, { useState } from 'react';

interface SignUpPageProps {
  onSignUpSuccess: () => void;
  onNavigateToSignIn: () => void;
}

export default function SignUpPage({ onSignUpSuccess, onNavigateToSignIn }: SignUpPageProps) {
  const [fullName, setFullName] = useState('Arjun Rao');
  const [email, setEmail] = useState('arjun.rao@college.edu');
  const [graduationYear, setGraduationYear] = useState('2024');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [password, setPassword] = useState('Password@123');
  const [confirmPassword, setConfirmPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Please accept the honest engineering pledge.");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#191512] font-sans flex flex-col justify-between selection:bg-[#4338ca] selection:text-white">
      
      {/* Header */}
      <header className="w-full bg-[#fbf7f4]/90 backdrop-blur-md border-b border-[#EDE6DE]/70 z-30 shrink-0">
        <div className="h-16 max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#9c3d0c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              IT
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-[#191512]">
              IT Career Partner
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EDE6DE] text-[11px] font-mono text-[#57534e] shadow-2xs">
            <span className="material-symbols-outlined text-[13px] text-[#059669]">lock</span>
            <span className="uppercase tracking-wider font-medium">256-Bit Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="w-full flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#EDE6DE] shadow-xs bg-white">
          
          {/* Left Column (~54%): Architectural Benefits */}
          <div className="lg:col-span-7 relative p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EDE6DE]/70 bg-gradient-to-br from-[#FBF8F4] via-[#F8F3ED] to-[#F4ECE3]">
            
            <div className="flex flex-col gap-3 max-w-lg z-10">
              <span className="font-mono text-[11px] tracking-wider uppercase text-[#9c3d0c] font-bold">
                Student &amp; Fresher Exclusive
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191512] leading-tight">
                Designed exclusively for 2024 &amp; 2025 Indian IT freshers.
              </h1>
              <p className="text-sm text-[#78716c] leading-relaxed mt-1">
                Zero spam. Zero customer support or telecalling roles. We audit every posting down to contract terms, bond clauses, and real market pay.
              </p>
            </div>

            {/* Feature List */}
            <div className="my-8 flex flex-col gap-3 z-10">
              <div className="p-3.5 rounded-xl bg-white/90 border border-[#EDE6DE] flex items-start gap-3 shadow-2xs">
                <span className="material-symbols-outlined text-[20px] text-[#059669] shrink-0 mt-0.5">verified</span>
                <div>
                  <h4 className="text-xs font-bold text-[#191512]">0 Years Experience Locked</h4>
                  <p className="text-[11.5px] text-[#78716c] mt-0.5">
                    No postings asking for 2-3 years will ever show up in your radar.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-[#EDE6DE] flex items-start gap-3 shadow-2xs">
                <span className="material-symbols-outlined text-[20px] text-[#059669] shrink-0 mt-0.5">payments</span>
                <div>
                  <h4 className="text-xs font-bold text-[#191512]">Verified CTC Floor ≥ ₹2.4 LPA</h4>
                  <p className="text-[11.5px] text-[#78716c] mt-0.5">
                    Paid internships (&gt;₹5k WFH, &gt;₹10k WFO) and full-time packages verified against exploitation.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-[#EDE6DE] flex items-start gap-3 shadow-2xs">
                <span className="material-symbols-outlined text-[20px] text-[#059669] shrink-0 mt-0.5">gavel</span>
                <div>
                  <h4 className="text-xs font-bold text-[#191512]">Zero Bond Guarantee</h4>
                  <p className="text-[11.5px] text-[#78716c] mt-0.5">
                    100% verified against service bonds, certificate surrender, or upfront training fee scams.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#78716c] z-10">
              Deterministic ATS matching tailored to your unvarnished master resume.
            </div>

          </div>

          {/* Right Column (~46%): Sign Up Form */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center bg-white">
            
            <div className="flex flex-col gap-1 mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-[#191512]">
                Create your account
              </h2>
              <p className="text-xs text-[#78716c]">
                Setup your fresher profile in 30 seconds.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191512]">Full Name</label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Rao"
                  className="w-full h-9 px-3 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] placeholder-[#9ca3af] focus:outline-none focus:border-[#4338ca] focus:bg-white transition"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191512]">Email Address</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun@college.edu or personal email"
                  className="w-full h-9 px-3 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] placeholder-[#9ca3af] focus:outline-none focus:border-[#4338ca] focus:bg-white transition"
                />
              </div>

              {/* Graduation Batch & Degree (Row) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191512]">Graduation Year</label>
                  <select 
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full h-9 px-2.5 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] focus:outline-none focus:border-[#4338ca] font-mono cursor-pointer"
                  >
                    <option value="2024">2024 Batch</option>
                    <option value="2025">2025 Batch</option>
                    <option value="2026">2026 Batch</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191512]">Degree / Stream</label>
                  <input 
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="B.Tech, MCA, BCA"
                    className="w-full h-9 px-3 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] focus:outline-none focus:border-[#4338ca] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191512]">Password</label>
                  <span className="text-[10px] font-mono text-[#059669]">Strong</span>
                </div>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full h-9 px-3 pr-10 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] focus:outline-none focus:border-[#4338ca] focus:bg-white transition font-mono"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#9ca3af] hover:text-[#191512]"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191512]">Confirm Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-9 px-3 bg-[#FAF8F5] border border-[#EDE6DE] rounded-lg text-xs text-[#191512] focus:outline-none focus:border-[#4338ca] focus:bg-white transition font-mono"
                />
              </div>

              {/* Agreement */}
              <div className="flex items-start gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-[#d1d5db] text-[#4338ca] focus:ring-[#4338ca] h-3.5 w-3.5 mt-0.5"
                />
                <label htmlFor="agree" className="text-[11.5px] text-[#57534e] cursor-pointer select-none leading-tight">
                  I confirm genuine graduation credentials and agree to the <strong>Zero Fake Experience Pledge</strong>.
                </label>
              </div>

              {/* Submit */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#9c3d0c] hover:bg-[#7c2d12] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition shadow-xs mt-1"
              >
                <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>

            </form>

            <div className="mt-5 pt-3 border-t border-[#f1f5f9] text-center text-xs text-[#78716c]">
              Already have an account?{' '}
              <button 
                onClick={onNavigateToSignIn}
                className="font-bold text-[#4338ca] hover:underline"
              >
                Sign in
              </button>
            </div>

          </div>

        </div>
      </main>

      <footer className="w-full py-4 border-t border-[#EDE6DE]/70 text-center text-[11px] font-mono text-[#a8a29e]">
        IT Career Partner • Ultra-Premium Engineering Console • India Sector
      </footer>

    </div>
  );
}
