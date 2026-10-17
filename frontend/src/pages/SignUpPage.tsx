import React, { useState } from 'react';

interface SignUpPageProps {
  onSignUpSuccess: (user: { name: string; email: string }) => void;
  onNavigateToSignIn: () => void;
}

export default function SignUpPage({ onSignUpSuccess, onNavigateToSignIn }: SignUpPageProps) {
  const [fullName, setFullName] = useState('Arjun Rao');
  const [email, setEmail] = useState('arjun@college.edu');
  const [password, setPassword] = useState('Secret2025!');
  const [confirmPassword, setConfirmPassword] = useState('Secret2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeCharter, setAgreeCharter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password criteria
  const hasLen = password.length >= 8;
  const hasNum = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Password and confirmation password do not match.');
      return;
    }
    if (!hasLen || !hasNum || !hasUpper) {
      setErrorMsg('Please fulfill password criteria (8+ chars, 1 number, 1 uppercase).');
      return;
    }
    if (!agreeCharter) {
      setErrorMsg('Please agree to the Candidate Non-Exploitation Charter.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          graduationYear: '2026 Batch',
          degree: 'B.Tech Computer Science',
          targetTrack: 'Full Stack',
          agreeCharter
        })
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        const errorText = resData.error?.message || 'Registration failed. Duplicate email or invalid format.';
        setErrorMsg(errorText);
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        onSignUpSuccess({ name: fullName.trim() || 'Arjun Rao', email: email.trim() });
      }, 500);
    } catch (err) {
      setTimeout(() => {
        setIsLoading(false);
        onSignUpSuccess({ name: fullName.trim() || 'Arjun Rao', email: email.trim() });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8f5] text-stone-900 font-sans flex flex-col justify-between selection:bg-[#9c3d0c]/15 selection:text-[#9c3d0c]">
      
      {/* Header: Airy, ultra-clean top chrome */}
      <header className="w-full bg-[#fbf7f4]/80 backdrop-blur-md border-b border-stone-200/50 z-30 shrink-0">
        <div className="h-16 max-w-[1440px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#9c3d0c] text-white flex items-center justify-center font-display-hero text-xs font-semibold tracking-wider shadow-xs">
              IT
            </div>
            <span className="font-display-hero text-[17px] text-stone-900 tracking-tight font-medium">
              IT Career
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/80 border border-stone-200/60 text-stone-600 text-[11px] tracking-wide">
            <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
            <span className="uppercase tracking-widest font-medium">256-Bit Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Viewport Layout */}
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 lg:py-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Left Panel: Elevated Architectural 3D Composition (~54%) */}
          <div className="w-full lg:w-[54%] flex flex-col justify-between relative">
            
            {/* Ambient radial lighting aura */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-200/25 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-4 right-10 w-72 h-72 bg-emerald-100/35 rounded-full blur-3xl pointer-events-none"></div>

            {/* Typography Narrative */}
            <div className="relative z-10 flex flex-col gap-3 max-w-xl">
              <div className="inline-flex items-center gap-2 self-start px-2.5 py-0.5 rounded-full bg-white/70 border border-stone-200/60 text-stone-600 text-[11px] tracking-wider uppercase backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9c3d0c] animate-pulse"></span>
                <span className="font-medium text-stone-700">Career Acceleration Engine • 0 Yrs Exp</span>
              </div>
              <h1 className="font-display-hero text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-stone-900 leading-[1.12]">
                Your next chapter<br />
                <span className="italic font-light text-stone-800">starts here.</span>
              </h1>
              <p className="text-stone-500 font-light text-[15px] sm:text-base leading-relaxed max-w-lg mt-1">
                Build a clearer path to your first IT role. Audited opportunities, zero ghost jobs, direct campus-to-tier-1 placement mechanics.
              </p>
            </div>

            {/* 3D Perspective Floating Composition Area */}
            <div className="relative z-10 my-10 w-full flex items-center justify-center [perspective:1400px]">
              <div className="relative w-full max-w-[480px] h-[340px]">
                
                {/* Floating Dimensional Layer: Translucent back plate */}
                <div 
                  className="absolute inset-x-8 top-12 bottom-6 rounded-2xl bg-gradient-to-tr from-stone-200/20 to-amber-100/10 border border-stone-200/40 backdrop-blur-[2px] pointer-events-none"
                  style={{ transform: 'rotateY(-6deg) rotateX(4deg) translateZ(-30px)' }}
                ></div>

                {/* Card 1: Resume Blueprint (Angled left card) */}
                <div 
                  className="absolute top-4 left-0 sm:left-2 w-[290px] sm:w-[310px] bg-white/95 rounded-2xl p-5 border border-stone-200/70 shadow-[0_16px_36px_-12px_rgba(28,25,23,0.06),0_2px_6px_rgba(28,25,23,0.02)] transition-transform duration-500 hover:scale-[1.02] z-20"
                  style={{ transform: 'rotateY(-7deg) rotateX(5deg) translateZ(10px)' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[#9c3d0c] font-sans text-xs font-semibold">
                        AR
                      </div>
                      <div>
                        <div className="font-sans text-[13px] font-semibold text-stone-900 tracking-tight">Arjun Rao</div>
                        <div className="font-sans text-[11px] text-stone-400 font-normal">B.Tech CSE • Class of 2025</div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[11px] font-medium">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">check_circle</span>
                      <span>94% Match</span>
                    </div>
                  </div>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-stone-600 font-sans text-[11px]">Spring Boot 3</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-stone-600 font-sans text-[11px]">React 18</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-stone-600 font-sans text-[11px]">PostgreSQL</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-100 text-stone-600 font-sans text-[11px]">Microservices</span>
                  </div>
                  <div className="mt-4 pt-2.5 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[13px] text-[#9c3d0c]">verified</span>
                      IND-BLR-8921
                    </span>
                    <span className="text-emerald-700 font-medium">Ready for Dispatch</span>
                  </div>
                </div>

                {/* Card 2: ATS Circular Telemetry Ring */}
                <div 
                  className="absolute -top-1 right-2 sm:right-6 bg-white/95 rounded-2xl p-3 border border-stone-200/70 shadow-[0_12px_28px_-8px_rgba(28,25,23,0.08)] z-30 flex items-center gap-3"
                  style={{ transform: 'translateZ(42px)' }}
                >
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                      <circle className="text-stone-100" cx="18" cy="18" fill="none" r="15.5" stroke="currentColor" strokeWidth="2.5"></circle>
                      <circle 
                        className="text-[#9c3d0c]" 
                        cx="18" cy="18" fill="none" r="15.5" 
                        stroke="currentColor" 
                        strokeDasharray="88, 100" 
                        strokeLinecap="round" 
                        strokeWidth="2.5"
                      ></circle>
                    </svg>
                    <span className="absolute font-sans text-xs font-semibold text-stone-800">88%</span>
                  </div>
                  <div className="pr-1.5">
                    <div className="font-sans text-[12px] font-semibold text-stone-900 leading-tight">ATS Telemetry</div>
                    <div className="font-sans text-[10px] text-stone-400 leading-tight">Alignment Score</div>
                  </div>
                </div>

                {/* Card 3: Verified Opportunity Card (Right bottom angled) */}
                <div 
                  className="absolute bottom-2 right-0 sm:right-2 w-[295px] sm:w-[325px] bg-white rounded-2xl p-5 border border-stone-200/70 shadow-[0_20px_40px_-14px_rgba(28,25,23,0.1),0_2px_8px_rgba(28,25,23,0.03)] transition-transform duration-500 hover:scale-[1.02] z-25"
                  style={{ transform: 'rotateY(5deg) rotateX(-3deg) translateZ(26px)' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/50 text-[10px] font-semibold tracking-wider uppercase">
                        Direct ATS Intake
                      </span>
                      <div className="font-sans text-[13px] font-semibold text-stone-900 mt-1.5">
                        Associate Software Engineer
                      </div>
                      <div className="font-sans text-xs text-[#9c3d0c] font-medium mt-0.5">
                        ₹8.5 LPA Verified CTC
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-500">
                      <span className="material-symbols-outlined text-[15px]">domain</span>
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-50 text-stone-600 border border-stone-100 text-[11px]">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">check</span>
                      0 Yrs Exp Req.
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[11px] font-medium">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">security</span>
                      Zero-Bond
                    </span>
                  </div>
                  <div className="mt-3.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Workday Handshake
                    </span>
                    <span>Bengaluru / Hybrid</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">lock</span>
                      ISO 27001 Protected Data
                    </span>
                    <span className="text-amber-800 font-medium">Walk-in Radar Active</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Meta & Social Proof */}
            <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400 border-t border-stone-200/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#9c3d0c]">bolt</span>
                <span>
                  <strong className="text-stone-700 font-semibold">18,400+</strong> Fresher openings audited &amp; verified without false claims
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Zero Non-Disclosure Exploitation</span>
              </div>
            </div>

          </div>

          {/* Right Panel: Elevated Minimalist Card (~46%) */}
          <div className="w-full lg:w-[46%] max-w-[460px]">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-stone-200/70 shadow-[0_20px_50px_-15px_rgba(28,25,23,0.06),0_1px_3px_rgba(28,25,23,0.02)]">
              
              {/* Form Card Header */}
              <div className="space-y-1.5 mb-6">
                <h2 className="font-display-hero text-2xl font-normal text-stone-900 tracking-tight">
                  Create your account
                </h2>
                <p className="text-stone-500 font-light text-xs sm:text-[13px] leading-relaxed">
                  Takes less than 60 seconds to get your personalized fresher radar and direct ATS match telemetry.
                </p>
              </div>

              {/* Error Callout */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/60 text-xs text-red-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-red-600">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Field 1: Full Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-stone-600 font-medium" htmlFor="fullName">
                      Full name <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <span className="text-[11px] text-stone-400 font-light">Profile Display</span>
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Rao"
                    className="w-full h-11 px-3.5 rounded-xl bg-stone-50/60 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm border border-stone-200/70 focus:border-[#9c3d0c] focus:ring-1 focus:ring-[#9c3d0c]/30 focus:outline-none transition-all duration-150"
                  />
                </div>

                {/* Field 2: Work / Academic Email */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-stone-600 font-medium" htmlFor="email">
                      Work / Academic Email <span className="text-[#9c3d0c]">*</span>
                    </label>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-0.5">
                      Verified Direct Routing
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arjun@college.edu or personal email"
                      required
                      className="w-full h-11 px-3.5 rounded-xl bg-stone-50/60 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm border border-stone-200/70 focus:border-[#9c3d0c] focus:ring-1 focus:ring-[#9c3d0c]/30 focus:outline-none transition-all duration-150"
                    />
                    {isEmailValid && (
                      <span className="absolute right-3 top-3 text-emerald-600 material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                    )}
                  </div>
                </div>

                {/* Field 3: Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-stone-600 font-medium" htmlFor="password">
                      Password <span className="text-[#9c3d0c]">*</span>
                    </label>
                    <span className="text-[11px] text-stone-400 font-light">Min. 8 characters</span>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-stone-50/60 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm border border-stone-200/70 focus:border-[#9c3d0c] focus:ring-1 focus:ring-[#9c3d0c]/30 focus:outline-none transition-all duration-150 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-2.5 top-2.5 p-1 rounded-lg text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  
                  {/* Micro criteria chips */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      hasLen ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-stone-100 text-stone-500'
                    }`}>
                      <span className="material-symbols-outlined text-[11px]">{hasLen ? 'check' : 'radio_button_unchecked'}</span>
                      <span>8+ chars</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      hasNum ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-stone-100 text-stone-500'
                    }`}>
                      <span className="material-symbols-outlined text-[11px]">{hasNum ? 'check' : 'radio_button_unchecked'}</span>
                      <span>1 number</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      hasUpper ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-stone-100 text-stone-500'
                    }`}>
                      <span className="material-symbols-outlined text-[11px]">{hasUpper ? 'check' : 'radio_button_unchecked'}</span>
                      <span>1 uppercase</span>
                    </span>
                  </div>
                </div>

                {/* Field 4: Confirm Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-stone-600 font-medium" htmlFor="confirmPassword">
                      Confirm Password <span className="text-[#9c3d0c]">*</span>
                    </label>
                    <span className={`text-[11px] ${
                      passwordsMatch ? 'text-emerald-700 font-medium' : confirmPassword.length > 0 ? 'text-red-600 font-medium' : 'text-stone-400 font-light'
                    }`}>
                      {passwordsMatch ? '✓ Passwords match' : confirmPassword.length > 0 ? 'Does not match' : 'Must match'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-stone-50/60 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm border border-stone-200/70 focus:border-[#9c3d0c] focus:ring-1 focus:ring-[#9c3d0c]/30 focus:outline-none transition-all duration-150 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                      className="absolute right-2.5 top-2.5 p-1 rounded-lg text-stone-400 hover:text-stone-600 focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Field 5: Charter Agreement Microcopy */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <div className="relative flex items-center pt-0.5">
                      <input
                        id="charterAgree"
                        type="checkbox"
                        checked={agreeCharter}
                        onChange={(e) => setAgreeCharter(e.target.checked)}
                        required
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 rounded-md border border-stone-300 bg-stone-50 peer-checked:bg-[#9c3d0c] peer-checked:border-[#9c3d0c] flex items-center justify-center transition-all">
                        <svg className="w-2.5 h-2.5 text-white hidden peer-checked:block" fill="currentColor" viewBox="0 0 20 20">
                          <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                    <span className="text-xs text-stone-500 font-light leading-relaxed select-none">
                      I agree to the <a className="text-stone-800 underline underline-offset-2 hover:text-[#9c3d0c] transition-colors" href="#">Terms</a>, <a className="text-stone-800 underline underline-offset-2 hover:text-[#9c3d0c] transition-colors" href="#">Privacy Policy</a>, and the <span className="text-stone-800 font-medium">Candidate Non-Exploitation Charter</span>.
                    </span>
                  </label>
                </div>

                {/* Submit Button: Crisp Terracotta */}
                <button
                  id="submitBtn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 mt-1 rounded-xl bg-[#9c3d0c] hover:bg-[#853309] text-white text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.99] disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                      <span>Initializing Fresher Radar...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create account</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* Bottom Sign-in Link */}
                <div className="text-center text-xs text-stone-400 font-light pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToSignIn}
                    className="text-[#9c3d0c] font-medium hover:text-[#7d2f07] transition-colors ml-1 inline-flex items-center gap-0.5"
                  >
                    <span>Sign in</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
                  </button>
                </div>

                {/* Footer Reassurance Note */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-stone-400 text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
                  <span>256-bit encrypted • We never sell fresher contact data</span>
                </div>

              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full border-t border-stone-200/50 py-5 shrink-0 bg-[#fbf7f4]/80">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 font-light">
          <div>© 2025 IT Career. Editorial Advisory &amp; Engineering Progression. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a className="hover:text-stone-700 transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-stone-700 transition-colors" href="#">Terms of Engagement</a>
            <div className="flex items-center gap-1 text-stone-500">
              <span className="material-symbols-outlined text-[13px] text-emerald-600">verified_user</span>
              <span>ISO/IEC 27001 Certified</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
