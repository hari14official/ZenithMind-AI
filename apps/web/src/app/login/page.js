'use client'
export const dynamic = "force-dynamic";
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendEmailVerification } from 'firebase/auth'
import { API_BASE_URL } from '@/lib/api-config'

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [isVerificationSent, setIsVerificationSent] = useState(false)
    const [loginEmail, setLoginEmail] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        if (!termsAccepted) {
            setError('Please accept the Terms & Conditions before logging in.')
            return
        }

        setLoading(true)

        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user

            if (!user.emailVerified) {
                try {
                    await sendEmailVerification(user)
                    console.log('Verification email newly sent')
                } catch (error_) {
                    console.error('Error sending verification email:', error_)
                }

                await new Promise(resolve => setTimeout(resolve, 500))
                await signOut(auth);
                setLoginEmail(user.email);
                setIsVerificationSent(true);
                return;
            }

            // Save to localStorage (mocking structure so the rest of the app thinks it's logged in)
            localStorage.setItem('token', user.accessToken || "firebase_jwt")
            localStorage.setItem('user', JSON.stringify({ id: user.uid, email: user.email }))

            // Send login alert
            fetch(`${API_BASE_URL}/api/v1/auth/login-alert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, name: user.email.split('@')[0] })
            }).catch(console.error);

            setSuccessMessage('Logged in successfully!')
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        } catch (err) {
            console.error(err)
            setError('Email or password is incorrect')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setError('')
        setSuccessMessage('')

        if (!termsAccepted) {
            setError('Please accept the Terms & Conditions before continuing.')
            return
        }

        try {
            const provider = new GoogleAuthProvider()
            const userCredential = await signInWithPopup(auth, provider)
            const user = userCredential.user

            // Save to localStorage
            localStorage.setItem('token', user.accessToken || "firebase_jwt")
            localStorage.setItem('user', JSON.stringify({ id: user.uid, email: user.email, name: user.displayName }))

            // Send login alert
            fetch(`${API_BASE_URL}/api/v1/auth/login-alert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, name: user.displayName || user.email.split('@')[0] })
            }).catch(console.error);

            setSuccessMessage('Logged in with Google successfully!')
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        } catch (err) {
            console.error('Google Sign-In Error:', err)
            setError(err.message || 'Google Sign-In failed')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            {isVerificationSent ? 'Check your email' : 'Welcome back'}
                        </CardTitle>
                        {!isVerificationSent && (
                            <CardDescription className="text-center">
                                Enter your email to sign in to your account
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isVerificationSent ? (
                            <div className="text-center space-y-4 py-4">
                                <p className="text-slate-600">
                                    We have sent you a verification email to <span className="font-semibold text-slate-800">{loginEmail}</span>. Please verify it and log in.
                                </p>
                                <Button className="w-full mt-4" onClick={() => globalThis.location.reload()}>
                                    Log In
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="zenithmind@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-primary hover:underline float-right"
                                    >
                                        Forgot password?
                                    </Link>
                                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative my-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">or</span>
                                    </div>
                                </div>

                                {/* Google Sign-In */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full flex items-center justify-center gap-3 border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground bg-background hover:bg-muted transition-colors shadow-sm"
                                >
                                    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                        <path fill="none" d="M0 0h48v48H0z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                                        I accept the Terms & Conditions
                                    </label>
                                </div>

                                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                                {successMessage && <p className="text-sm text-emerald-600 font-medium">{successMessage}</p>}
                                <Button className="w-full" type="submit" disabled={loading}>
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    {!isVerificationSent && (
                        <CardFooter className="flex flex-col gap-2 justify-center">
                            <p className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Are you an administrator?{' '}
                                <Link href="/admin-login" className="text-primary hover:underline font-bold">
                                    Admin Login
                                </Link>
                            </p>
                        </CardFooter>
                    )}
                </Card>
            </div>
            <Footer />
        </div>
    )
}
