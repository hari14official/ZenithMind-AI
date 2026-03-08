'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, deleteUser } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', gender: '', age: '', about: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [isVerificationSent, setIsVerificationSent] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        if (!termsAccepted) {
            setError('Please accept the Terms & Conditions before registering.')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match")
            return
        }

        setLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user

            try {
                await sendEmailVerification(user)
            } catch (verifyErr) {
                console.error('Error sending verification email:', verifyErr)
            }

            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: formData.name,
                    email: formData.email,
                    gender: formData.gender,
                    age: formData.age,
                    about: formData.about,
                    createdAt: new Date().toISOString()
                });
            } catch (dbErr) {
                // If it fails, delete the auth user to prevent dangling half-accounts
                try {
                    await deleteUser(user);
                } catch (delErr) {
                    console.error("Cleanup failed:", delErr);
                }

                let msg = 'Error saving profile: ' + dbErr.message;
                if (dbErr.message && dbErr.message.includes('permission-denied')) {
                    msg = "Firestore Error: Permission Denied. You MUST go to Firebase Console -> Firestore Database -> Rules and change to 'allow read, write: if true;'";
                } else if (dbErr.code === 'not-found' || (dbErr.message && dbErr.message.includes('not found'))) {
                    msg = "Firestore Error: Database not found. Please click 'Create Database' in your Firebase Firestore console.";
                }
                throw new Error(msg);
            }

            // Give Firebase a tiny moment to complete any background syncs before signing out
            await new Promise(resolve => setTimeout(resolve, 500))
            await signOut(auth)

            setRegisteredEmail(user.email)
            setIsVerificationSent(true)
        } catch (err) {
            console.error(err)
            if (err.code === 'auth/email-already-in-use') {
                setError('User already exists. Please sign in')
            } else {
                setError(err.message || 'Registration failed')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            {isVerificationSent ? 'Check your email' : 'Create an account'}
                        </CardTitle>
                        {!isVerificationSent && (
                            <CardDescription className="text-center">
                                Enter your information to create your account
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isVerificationSent ? (
                            <div className="text-center space-y-4 py-4">
                                <p className="text-slate-600">
                                    We have sent you a verification email to <span className="font-semibold text-slate-800">{registeredEmail}</span>. Please verify it and log in.
                                </p>
                                <Button className="w-full mt-4" onClick={() => router.push('/login')}>
                                    Log In
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium leading-none">Full Name</label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="gender" className="text-sm font-medium leading-none">Gender</label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">Prefer not to say</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="age" className="text-sm font-medium leading-none">Age</label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="e.g. 25"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        required
                                        min="1"
                                        max="120"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="about" className="text-sm font-medium leading-none">About you</label>
                                    <textarea
                                        id="about"
                                        placeholder="Tell us a little bit about yourself..."
                                        value={formData.about}
                                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">Confirm Password</label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
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
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    {!isVerificationSent && (
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary hover:underline">
                                    Sign in
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
