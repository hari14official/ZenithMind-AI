'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1 container mx-auto max-w-4xl py-20 px-4">
                <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Terms & Services</h1>

                <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using ZenithMind AI, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Privacy & Data Security</h2>
                        <p>ZenithMind AI utilizes a "Privacy-First" architecture. All video processing occurs locally on your device (Edge AI). We do not record, store, or transmit your video data to any external servers.</p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li><strong>Local Processing:</strong> Facial landmark detection and analysis happen entirely in your browser.</li>
                            <li><strong>Data Minimization:</strong> Only numerical biometric vectors (e.g., stress scores) are stored for your personal analytics.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Use of Services</h2>
                        <p>You agree to use ZenithMind AI only for its intended purpose of workplace wellness and stress management. You may not attempt to reverse engineer the AI models or bypass security measures.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Disclaimer</h2>
                        <p>ZenithMind AI is a wellness tool and is NOT a medical device. It does not provide medical diagnoses or healthcare advice. Always consult a medical professional for health concerns.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}
