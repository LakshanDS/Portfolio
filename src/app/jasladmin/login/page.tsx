"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [tempId, setTempId] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [rateLimitResetTime, setRateLimitResetTime] = useState<number | null>(null);
  const router = useRouter();

  // Check if user is registered on mount
  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch("/api/login");
      const data = await response.json();
      console.log("Registration check response:", data);
      setIsRegistered(data.isRegistered);
      if (!data.isRegistered) {
        console.log("Setting QR code and temp ID:", data.qrCodeUrl, data.tempId);
        setQrCodeUrl(data.qrCodeUrl);
        setSecret(data.secret);
        setTempId(data.tempId);
      }
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.error("Failed to check registration status:", error);
      setError("Failed to load. Please refresh the page.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRemainingAttempts(null);
    setRateLimitResetTime(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code: otpCode,
          tempId,
          csrfToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use window.location instead of router to ensure cookie is sent
        window.location.href = "/jasladmin/dashboard";
      } else {
        setError(data.error || "Invalid OTP code");
        setOtpCode("");
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        if (data.resetTime !== undefined) {
          setRateLimitResetTime(data.resetTime);
        }
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0e1a] via-[#0D1117] to-[#0a1628] flex items-center justify-center p-6">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-green-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className={`w-full ${isRegistered === false ? "max-w-4xl" : "max-w-md"} relative z-10 transition-all duration-500 ease-in-out`}>
        {/* Header with gradient text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-sm border border-emerald-500/20 mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 bg-clip-text text-transparent mb-2">
            Admin Access
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono">
            <span className="text-emerald-400">&gt;_</span>{" "}
            {isRegistered === false
              ? "First time setup - scan QR code"
              : "Enter your authentication code"}
          </p>
        </div>

        <div className="relative backdrop-blur-xl bg-black/80 rounded-2xl border border-emerald-500/20 shadow-2xl shadow-emerald-900/10 overflow-hidden">
          {/* Gradient border effect - Darker Green */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20 pointer-events-none"></div>

          <div className="relative p-8">
          {isRegistered === null ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-400 border-t-transparent"></div>
              </div>
              <p className="text-sm text-[#9CA3AF]">Initializing...</p>
            </div>
          ) : !isRegistered ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-2">
              {/* Left Column: QR Code & Secret */}
              <div className="flex flex-col items-center justify-center p-6 bg-emerald-950/10 rounded-xl border border-emerald-500/10 space-y-6 h-full">
                 <div className="text-center w-full">
                     <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-4 block">Scan Me</span>
                     {qrCodeUrl && (
                      <div className="inline-block p-4 bg-white rounded-xl shadow-lg shadow-emerald-500/10 select-none">
                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 md:w-56 md:h-56 object-contain" />
                      </div>
                    )}
                 </div>
                 
                 <div className="text-center w-full space-y-2">
                    <p className="text-[10px] text-emerald-400/60 uppercase tracking-wider">Or enter secret manually</p>
                    <code className="block w-full text-center p-3 bg-black/60 rounded-lg border border-emerald-500/20 text-emerald-400 font-mono text-sm tracking-widest break-all select-all shadow-inner">
                       {secret || "Generating..."}
                    </code>
                 </div>
              </div>

              {/* Right Column: Instructions & Form */}
              <div className="space-y-6 h-full flex flex-col justify-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">i</div>
                    Instructions
                  </h3>
                   <div className="space-y-3 pl-2">
                      <div className="flex items-start gap-3 text-sm text-[#9CA3AF]">
                        <span className="text-emerald-400 font-bold mt-0.5">1.</span>
                        <p>Open <span className="text-emerald-400 font-medium">Google Authenticator</span></p>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-[#9CA3AF]">
                        <span className="text-emerald-400 font-bold mt-0.5">2.</span>
                        <p>Scan the <span className="text-emerald-400 font-medium">QR code</span> or enter the <span className="text-emerald-400 font-medium">Secret Key</span></p>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-[#9CA3AF]">
                        <span className="text-emerald-400 font-bold mt-0.5">3.</span>
                        <p>Enter the generated <span className="text-emerald-400 font-medium">6-digit code</span> below</p>
                      </div>
                   </div>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6 pt-4 border-t border-white/5">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-sm text-red-400 text-center">{error}</p>
                      {remainingAttempts !== null && (
                        <p className="text-xs text-red-300 text-center mt-1">
                          {remainingAttempts} attempts remaining
                        </p>
                      )}
                      {rateLimitResetTime !== null && (
                        <p className="text-xs text-red-300 text-center mt-1">
                          Try again in {formatTime(rateLimitResetTime)}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-emerald-400/90 block uppercase tracking-wider">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtpCode(value);
                      }}
                      className="block w-full px-4 py-3 bg-gradient-to-br from-[#0D1117] to-[#1a1f2e] border-2 border-emerald-500/20 rounded-xl text-[#E6EDF3] text-center text-3xl tracking-[0.5em] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono placeholder:text-gray-700"
                      placeholder="• • • • • •"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otpCode.length !== 6 || isLoading}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm
                      bg-gradient-to-r from-emerald-500 to-green-600 text-white
                      hover:from-emerald-400 hover:to-green-500
                      disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                      transform hover:scale-[1.02] active:scale-[0.98]
                      transition-all duration-200
                      shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
                      disabled:shadow-none
                      relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            // Regular login - just OTP field
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-sm text-red-400 text-center">{error}</p>
                  {remainingAttempts !== null && (
                    <p className="text-xs text-red-300 text-center mt-1">
                      {remainingAttempts} attempts remaining
                    </p>
                  )}
                  {rateLimitResetTime !== null && (
                    <p className="text-xs text-red-300 text-center mt-1">
                      Try again in {formatTime(rateLimitResetTime)}
                    </p>
                  )}
                </div>
              )}

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-sm border border-emerald-500/20 mb-2">
                  <svg
                    className="w-10 h-10 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-[#9CA3AF]">
                  Enter your 6-digit code from<br />
                  <span className="text-emerald-400 font-medium">Google Authenticator</span>
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-emerald-400/90 block uppercase tracking-wider">
                  Authentication Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtpCode(value);
                  }}
                  className="block w-full px-4 py-3 bg-gradient-to-br from-[#0D1117] to-[#1a1f2e] border-2 border-emerald-500/20 rounded-xl text-[#E6EDF3] text-center text-3xl tracking-[0.5em] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all font-mono placeholder:text-gray-700"
                  placeholder="• • • • • •"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={otpCode.length !== 6 || isLoading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm
                  bg-gradient-to-r from-emerald-500 to-green-600 text-white
                  hover:from-emerald-400 hover:to-green-500
                  disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
                  disabled:shadow-none
                  relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Unlock Dashboard
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </form>
          )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1f2e]/50 backdrop-blur-sm border border-emerald-500/10">
            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-[#9CA3AF]">
              {isRegistered === false
                ? "One-time setup • Secure authentication"
                : "Session expires after 5 minutes"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
