'use client'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'
import { API_BASE_URL } from '@/lib/api-config'

const steps = [
    {
        number: '01',
        title: 'Create Your Account',
        icon: '👤',
        description: 'Sign up using your work email. Your account is your private health vault — no video data ever leaves your device.',
        details: [
            'Click "Get Started" on the home page.',
            'Enter your name, work email, and a strong password.',
            'Verify your email via the confirmation link sent to your inbox.',
            'Log in and complete your profile (department, role).',
        ],
    },
    {
        number: '02',
        title: 'Grant Camera Access',
        icon: '📷',
        description: 'ZenithMind uses your webcam locally — no footage is recorded or sent to any server. Only mathematical vectors are computed.',
        details: [
            'Navigate to the Dashboard after login.',
            'Click "Start Session" — your browser will request camera permission.',
            'Click "Allow" in the browser permission prompt.',
            'Position yourself 40–70 cm from the camera, with good frontal lighting.',
        ],
    },
    {
        number: '03',
        title: 'Run a Monitoring Session',
        icon: '🧠',
        description: 'The AI engine analyses your facial landmarks in real-time at up to 30 FPS, computing your live stress score.',
        details: [
            'The live camera feed will appear in the monitor panel.',
            'The system will auto-calibrate your baseline over the first 30 seconds.',
            'Your real-time Stress Score (0–100) updates every second.',
            'A green zone (0–40) means calm. Yellow (40–70) is moderate. Red (70–100) is high stress.',
        ],
    },
    {
        number: '04',
        title: 'Receive Alerts & Play Relief Games',
        icon: '🎮',
        description: 'When stress exceeds your personal threshold, ZenithMind gently suggests a micro-break game to restore your focus.',
        details: [
            'A non-intrusive banner appears when stress > 70 for 30+ seconds.',
            'Choose a game: Zen Breath, Whack-a-Mole, or Memory Matrix.',
            'Each game takes 2–5 minutes and is scientifically calibrated for cortisol reduction.',
            'Game scores are saved and contribute to your Cognitive Performance report.',
        ],
    },
    {
        number: '05',
        title: 'Review Your Analytics',
        icon: '📊',
        description: 'Your dashboard shows live and historical trends — blink rate, head pose, stress timeline, and game performance.',
        details: [
            'Open the "Analytics" tab in the sidebar to see your session history.',
            'Charts show your Average Stress Score by day, week, and month.',
            'Filter by date range or session type.',
            'Hover over any data point to see the exact metric at that timestamp.',
        ],
    },
    {
        number: '06',
        title: 'Download Your PDF Report',
        icon: '📄',
        description: 'At the end of each session, ZenithMind auto-generates a comprehensive wellness report you can download or share.',
        details: [
            'Go to the "Reports" section in the sidebar.',
            'Select any completed session from the list.',
            'Click "Download PDF" to save your personal health audit.',
            'Reports include: Overall Stress Score, Blink Rate Graph, Gaze Variability, and Game Performance metrics.',
        ],
    },
]

const faqs = [
    {
        q: 'Is my video data stored anywhere?',
        a: 'No. ZenithMind processes all video locally on your device using edge AI. Only numerical biometric vectors (e.g., Eye Aspect Ratio, Head Pose) are computed and, optionally, synced to the server — never raw video.',
    },
    {
        q: 'What webcam do I need?',
        a: 'Any standard webcam with at least 720p resolution works. Built-in laptop cameras are fine. Ensure you have adequate frontal lighting for best accuracy.',
    },
    {
        q: 'How accurate is the stress detection?',
        a: 'Our Random Forest classifier achieves ~87% accuracy on the internal validation set. It measures physiological stress indicators (blink rate, gaze, head pose) — not emotional mood.',
    },
    {
        q: 'Can anyone else see my scores?',
        a: 'Only you have access to your personal scores. If you use it personally, no one else sees it. For enterprise accounts, team admins might only see anonymized, aggregated data.',
    },
    {
        q: 'What browsers are supported?',
        a: 'Chrome 90+, Edge 90+, and Firefox 88+. Safari is not recommended due to limited WebRTC camera API support.',
    },
]

const keywordAnswers = {
    'free': 'Yes, you can create a free account to get started with basic features.',
    'cost': 'Basic features are free. Premium subscriptions for advanced analytics are coming soon.',
    'price': 'Basic features are free. Premium subscriptions for advanced analytics are coming soon.',
    'password': 'You can reset your password from the login page by clicking "Forgot Password".',
    'delete': 'You can delete your account permanently from the Settings page.',
    'mobile': 'We currently recommend using a desktop browser since webcam positioning works best on a stable monitor or laptop.',
    'phone': 'We currently recommend using a desktop browser since webcam positioning works best on a stable monitor or laptop.'
}



export default function AboutPage() {
    const [openFaq, setOpenFaq] = useState(null)
    const [customQuestion, setCustomQuestion] = useState('')
    const [customAnswer, setCustomAnswer] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleAskQuestion = async (e) => {
        e.preventDefault()
        if (!customQuestion.trim() || isLoading) return

        setIsLoading(true)
        setCustomAnswer('')

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/chat/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: customQuestion }),
            })
            const data = await res.json()
            setCustomAnswer(data.answer || "I'm not sure, please try again.")
        } catch (error) {
            console.error(error)
            setCustomAnswer("Error: Could not reach the AI service.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="pointer-events-none absolute inset-0 -z-10 mesh-bg-light opacity-60" />
                <div className="container mx-auto max-w-4xl text-center px-4">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                        About ZenithMind AI
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                        Your AI-Powered{' '}
                        <span className="gradient-text">Workplace Wellness</span>{' '}
                        Guardian
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        ZenithMind AI turns your existing webcam into a real-time stress monitor. It detects physiological stress signals, suggests science-backed micro-breaks, and generates actionable wellness reports — all while keeping your video 100% private.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg">Get Started Free</Button>
                        </Link>
                        <Link href="/#features">
                            <Button variant="outline" size="lg">Explore Features</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── What It Does (Services) ── */}
            <section className="py-16 bg-slate-50" id="services">
                <div className="container mx-auto max-w-5xl px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What ZenithMind Does</h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        A holistic, end-to-end solution that integrates seamlessly into any knowledge worker's daily routine.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '👁️', title: 'Detects Stress', desc: 'Analyses 468 facial landmarks — blink rate, eye aspect ratio, head pose — in real-time.' },
                            { icon: '🧘', title: 'Triggers Relief', desc: 'Suggests gamified micro-breaks (Zen Breath, Whack-a-Mole, Memory Matrix) when stress spikes.' },
                            { icon: '📈', title: 'Tracks Trends', desc: 'Historical charts and session timelines let you spot patterns in your weekly stress curve.' },
                            { icon: '🔒', title: 'Stays Private', desc: 'Edge AI ensures no video ever leaves your device. GDPR & HIPAA compliant by design.' },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl border bg-background p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-3xl">{item.icon}</span>
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* ── User Manual / Procedure ── */}
            <section className="py-20 bg-slate-50" id="user-manual">
                <div className="container mx-auto max-w-4xl px-4">
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                        User Manual
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Step-by-Step Guide</h2>
                    <p className="text-muted-foreground mb-12 max-w-xl">
                        Follow these six steps to get full value from ZenithMind AI — from account creation to downloading your first wellness report.
                    </p>

                    <div className="space-y-6">
                        {steps.map((step, idx) => (
                            <div key={step.number} className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                                <div className="flex items-start gap-5 p-6">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                STEP {step.number}
                                            </span>
                                            <h3 className="text-lg font-bold">{step.title}</h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{step.description}</p>
                                        <ul className="space-y-2">
                                            {step.details.map((d, i) => (
                                                <li key={d} className="flex items-start gap-2 text-sm">
                                                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-foreground/80">{d}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="border-t border-dashed border-border mx-6 opacity-50" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stress Score Legend ── */}
            <section className="py-16">
                <div className="container mx-auto max-w-3xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Understanding Your Stress Score</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            { range: '0 – 40', label: 'Calm', color: 'bg-emerald-100 border-emerald-300 text-emerald-800', dot: 'bg-emerald-500', desc: 'You are in the zone. Cognitive performance is at peak. Keep going!' },
                            { range: '41 – 70', label: 'Moderate', color: 'bg-amber-100 border-amber-300 text-amber-800', dot: 'bg-amber-500', desc: 'Stress is building. Consider a short stretch or breathing break soon.' },
                            { range: '71 – 100', label: 'High', color: 'bg-red-100 border-red-300 text-red-800', dot: 'bg-red-500', desc: 'Elevated stress detected. A relief game is strongly recommended.' },
                        ].map((s) => (
                            <div key={s.label} className={`rounded-2xl border-2 p-6 ${s.color}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-3 h-3 rounded-full ${s.dot}`} />
                                    <span className="font-bold text-lg">{s.label}</span>
                                </div>
                                <p className="text-2xl font-extrabold mb-3">{s.range}</p>
                                <p className="text-sm leading-relaxed opacity-80">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto max-w-3xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div key={faq.q} className="rounded-xl border bg-background shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-muted/50 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <span className={`ml-4 flex-shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-45' : ''}`}>
                                        ＋
                                    </span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Enhanced Q&A Feature ── */}
                    <div id="qa-section" className="mt-16 relative overflow-hidden rounded-[2.5rem] border bg-white/40 p-1 backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:shadow-primary/10 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative rounded-[2.3rem] bg-white/80 p-8 md:p-10 shadow-inner">
                            <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">Have Any Other Questions?</h3>
                            <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
                                Our AI support bot is here to help you get the most out of ZenithMind AI. Type anything from technical setup to wellness science.
                            </p>

                            <form onSubmit={handleAskQuestion} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                <div className="relative flex-1 group/input">
                                    <input
                                        type="text"
                                        placeholder="Type your question here..."
                                        className="w-full pl-6 pr-14 py-4 border-2 border-slate-200/60 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 disabled:opacity-50 text-base"
                                        value={customQuestion}
                                        onChange={(e) => setCustomQuestion(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </div>
                                </div>
                                <Button type="submit" disabled={isLoading} className="relative h-14 px-8 rounded-2xl bg-primary text-white font-bold text-lg hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[0] transition-all duration-300 overflow-hidden">
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <span>Ask Question</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {/* Loading Skeleton Loader — Highly Premium Appearance */}
                            {isLoading && (
                                <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <div className="text-xs font-bold uppercase tracking-widest text-primary/60">Gemini AI is Thinking</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-primary/10 rounded-full w-[40%] animate-pulse" />
                                        <div className="h-4 bg-primary/10 rounded-full w-full animate-pulse delay-75" />
                                        <div className="h-4 bg-primary/10 rounded-full w-[85%] animate-pulse delay-150" />
                                    </div>
                                </div>
                            )}

                            {/* Answer Box with Glassmorphism and Transitions */}
                            {!isLoading && customAnswer && (
                                <div className="mt-8 relative animate-in fade-in zoom-in-95 duration-500">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-indigo-400/30 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                    <div className="relative p-6 md:p-8 bg-white border border-slate-100 rounded-[1.8rem] shadow-xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🤖</div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">AI Assistant</h4>
                                                <p className="text-[10px] text-slate-400 font-medium">REAL-TIME RESPONSE</p>
                                            </div>
                                        </div>
                                        <div className="text-slate-600 leading-relaxed font-medium">
                                            {customAnswer}
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-300">ZENITHMIND AI CORE SDK 1.2.0</span>
                                            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest" onClick={() => setCustomAnswer('')}>Clear Answer</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20">
                <div className="container mx-auto max-w-2xl text-center px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to take control of your well-being?</h2>
                    <p className="text-muted-foreground mb-8">Join thousands of knowledge workers who use ZenithMind AI to build healthier, more productive workdays.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg">Create Free Account</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg">Log In</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <Footer />
        </div>
    )
}
