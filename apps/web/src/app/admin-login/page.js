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

export default function AdminLoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Hardcoded admin login for presentation/demonstration purposes
        if (formData.email === 'hari14official@gmail.com' && formData.password === 'Hari@0503') {
            // Save to localStorage as an admin user
            localStorage.setItem('token', 'admin_mock_token_12345')
            localStorage.setItem('user', JSON.stringify({ 
                id: 'admin_001', 
                email: 'admin@zenithmind.ai', 
                name: 'System Administrator',
                isAdmin: true 
            }))

            setTimeout(() => {
                router.push('/admin-dashboard')
            }, 500)
        } else {
            setError('Invalid administrator credentials.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-indigo-200 shadow-xl shadow-indigo-100">
                    <CardHeader className="space-y-1 bg-indigo-50/50 rounded-t-xl border-b border-indigo-100 pb-6">
                        <div className="mx-auto bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-2 border border-indigo-200 shadow-sm">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-indigo-900">
                            Administrator Login
                        </CardTitle>
                        <CardDescription className="text-center font-medium text-indigo-700/70">
                            Access the secure ZenithMind Administration Panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-slate-700">Admin Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="border-slate-300 focus:border-indigo-500 shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-bold text-slate-700">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="border-slate-300 focus:border-indigo-500 shadow-sm"
                                />
                            </div>

                            {error && <p className="text-sm text-red-600 font-bold bg-red-50 p-2.5 rounded-lg border border-red-200 shadow-sm">{error}</p>}
                            
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-md h-11 mt-2 font-bold tracking-wide" type="submit" disabled={loading}>
                                {loading ? 'Authenticating...' : 'Secure Login'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-100 bg-slate-50/50 rounded-b-xl py-4 mt-2">
                        <p className="text-sm text-slate-500">
                            Return to{' '}
                            <Link href="/login" className="text-indigo-600 hover:underline font-bold">
                                User Login
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </div>
    )
}
