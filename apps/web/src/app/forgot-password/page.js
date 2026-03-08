'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Reset
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(0) // Timer for Resend OTP
    const [resetToken, setResetToken] = useState('')

    // Auto-countdown logic
    useEffect(() => {
        let timer
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000)
        }
        return () => clearInterval(timer)
    }, [countdown])

    // Real-time OTP Auto-verification
    useEffect(() => {
        const enteredOtp = otp.join('')
        if (enteredOtp.length === 6 && step === 2 && !loading) {
            handleVerifyOTP()
        }
    }, [otp, step, loading]) // Added loading to dependency array to prevent re-triggering while loading

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message)
                setStep(2)
                setCountdown(60)
            } else {
                setError(data.detail || 'Failed to send OTP verification code')
            }
        } catch (err) {
            setError('Connection error. Please check your internet.')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError('')
        const enteredOtp = otp.join('')

        if (enteredOtp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: enteredOtp })
            });

            const data = await response.json();

            if (response.ok) {
                setResetToken(data.resetToken)
                setStep(3)
                setMessage('Verification successful. Please update your password.')
            } else {
                setError(data.detail || 'Invalid or expired OTP code')
                setCountdown(0)
                setOtp(['', '', '', '', '', ''])
            }
        } catch (err) {
            setError('Verification failed. Server connection error.')
            setCountdown(0)
            setOtp(['', '', '', '', '', ''])
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, resetToken })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...')
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
            } else {
                setError(data.detail || 'Could not reset password')
            }
        } catch (err) {
            setError('Final submission error. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false
        const newOtp = [...otp]
        newOtp[index] = element.value
        setOtp(newOtp)

        if (element.value && element.nextSibling) {
            element.nextSibling.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus()
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm shadow-2xl border-none bg-white/80 backdrop-blur-xl animate-in zoom-in-95 duration-500">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-bold border border-primary/20 shadow-inner">
                                {step === 1 ? '📧' : step === 2 ? '🔐' : '🔑'}
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-black text-center tracking-tight text-slate-800 uppercase">
                            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Update Security'}
                        </CardTitle>
                        <CardDescription className="text-center font-medium text-slate-500 px-2 text-sm">
                            {step === 1 ? 'Enter your registered email for an OTP' :
                                step === 2 ? `A 6-digit code has been sent to ${email}` :
                                    'Ensure your new password contains at least 8 characters'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="user@zenithmind.ai"
                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-base shadow-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="text-xs text-red-500 font-semibold bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">⚠️ {error}</p>}
                                <Button className="w-full h-11 rounded-xl text-base font-medium shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Generating...
                                        </>
                                    ) : 'Send OTP Verification'}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <form onSubmit={handleVerifyOTP} className="space-y-4">
                                    <div className="flex justify-between gap-1.5">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="w-full h-12 text-center text-2xl font-normal border-2 rounded-xl border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-slate-50/50 focus:bg-white shadow-sm"
                                                value={data}
                                                onChange={e => handleOtpChange(e.target, index)}
                                                onKeyDown={e => handleKeyDown(e, index)}
                                                onFocus={e => e.target.select()}
                                            />
                                        ))}
                                    </div>
                                    {error && <p className="text-xs text-red-500 font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">⚠️ {error}</p>}
                                    <Button className="w-full h-11 rounded-xl text-base font-medium shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Verifying...
                                            </>
                                        ) : 'Verify & Continue'}
                                    </Button>
                                </form>
                                <div className="text-center">
                                    {countdown > 0 ? (
                                        <p className="text-xs text-slate-400 font-medium">Resend code in <span className="text-primary font-bold">{countdown}s</span></p>
                                    ) : (
                                        <button
                                            onClick={handleSendOTP}
                                            className="text-xs font-bold text-primary hover:text-indigo-700 transition-colors"
                                            disabled={loading}
                                        >
                                            Haven't received it? Resend OTP
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-600 ml-1">New Secure Password</label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-base shadow-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-600 ml-1">Confirm Identity</label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-base shadow-sm"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-xs text-red-500 font-semibold bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">⚠️ {error}</p>}
                                <Button className="w-full h-11 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Updating...
                                        </>
                                    ) : 'Set New Password'}
                                </Button>
                            </form>
                        )}

                        {message && (
                            <div className="mt-6 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 shadow-sm shadow-emerald-500/10">
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-md font-bold flex-shrink-0">✓</div>
                                <p className="text-xs text-emerald-800 font-bold leading-tight">{message}</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center pb-6">
                        <Link href="/login" className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-all">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            Back to log in
                        </Link>
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </div>
    )
}
