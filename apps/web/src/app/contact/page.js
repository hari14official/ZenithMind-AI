'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

export default function ContactPage() {
    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [sent, setSent] = useState(false)

    const handleSend = (e) => {
        e.preventDefault()
        if (!message.trim()) return

        // Format: https://wa.me/916383220803?text=Name:%20...%0AMessage:%20...
        const encodedMsg = encodeURIComponent(`Name: ${name || 'User'}\nMessage: ${message}`)
        const whatsappUrl = `https://wa.me/916383220803?text=${encodedMsg}`

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank')

        setSent(true)
        setTimeout(() => {
            setSent(false)
            setMessage('')
            setName('')
        }, 3000)
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 mesh-bg py-20 px-4">
                <div className="container max-w-2xl mx-auto">
                    <Card className="shadow-2xl border-indigo-100 backdrop-blur-sm bg-white/90 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                                    <path d="M22 2L11 13" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                </svg>
                            </div>
                            <CardTitle className="text-3xl font-extrabold text-slate-800 tracking-tight">Stay Connected with us </CardTitle>
                            <CardDescription className="text-slate-500 text-lg">We typically respond within a few hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sent ? (
                                <div className="py-12 text-center animate-in zoom-in duration-500">
                                    <div className="text-6xl mb-4">✨</div>
                                    <h3 className="text-2xl font-bold text-emerald-600 mb-2">Message Prepared!</h3>
                                    <p className="text-slate-500">Opening WhatsApp to complete the transmission to 6383220803...</p>
                                    <Button
                                        onClick={() => setSent(false)}
                                        variant="outline"
                                        className="mt-6"
                                    >
                                        Send Another
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="space-y-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Your Name (Optional)</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">What can we help you with?</label>
                                        <textarea
                                            required
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write your message here... I'm interested in enterprise stress analytics for my team."
                                            className="w-full min-h-[160px] p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 resize-none bg-white font-medium"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-14 text-lg font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <span>Send </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 pt-2 font-medium">
                                        Note: This will open WhatsApp on your device to send the message.
                                    </p>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <div className="bg-white/50 p-6 rounded-3xl border border-white/20 text-center">
                            <div className="text-3xl mb-3">📍</div>
                            <h4 className="font-bold text-slate-800">Location</h4>
                            <p className="text-xs text-slate-500">Global Remote Team</p>
                        </div>
                        <div className="bg-white/50 p-6 rounded-3xl border border-white/20 text-center">
                            <div className="text-3xl mb-3">🏢</div>
                            <h4 className="font-bold text-slate-800">Support</h4>
                            <p className="text-xs text-slate-500">24/7 Enterprise Assistance</p>
                        </div>
                        <div className="bg-white/50 p-6 rounded-3xl border border-white/20 text-center">
                            <div className="text-3xl mb-3">🚀</div>
                            <h4 className="font-bold text-slate-800">Fast Response</h4>
                            <p className="text-xs text-slate-500">&lt; 1 Hour Avg Response</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
