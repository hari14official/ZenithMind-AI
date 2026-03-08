'use client'
import { useState, useRef, useEffect } from 'react'

const BrainLogo = ({ size = 28 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none">
        <defs>
            <radialGradient id="footerBrainLeft" cx="35%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#60d0ff" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#f472b6" />
            </radialGradient>
            <radialGradient id="footerBrainRight" cx="65%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#4ade80" />
            </radialGradient>
            <linearGradient id="footerStem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
        </defs>
        <path d="M32 10 C22 10 14 16 14 24 C14 28 15.5 31.5 18 34 C15 36 13 39.5 13 43 C13 49 18 53 24 53 L32 53 L32 10Z" fill="url(#footerBrainLeft)" opacity="0.92" />
        <path d="M32 10 C42 10 50 16 50 24 C50 28 48.5 31.5 46 34 C49 36 51 39.5 51 43 C51 49 46 53 40 53 L32 53 L32 10Z" fill="url(#footerBrainRight)" opacity="0.92" />
        <line x1="32" y1="11" x2="32" y2="53" stroke="white" strokeWidth="1.2" opacity="0.5" />
        <path d="M20 22 Q26 25 30 22" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M17 33 Q23 37 30 33" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M19 43 Q25 46 30 42" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M44 22 Q38 25 34 22" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M47 33 Q41 37 34 33" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M45 43 Q39 46 34 42" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
        <line x1="28" y1="53" x2="25" y2="60" stroke="url(#footerStem)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="32" y1="53" x2="32" y2="61" stroke="url(#footerStem)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="36" y1="53" x2="39" y2="60" stroke="url(#footerStem)" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="11" cy="18" r="2" fill="#60d0ff" opacity="0.85" />
        <circle cx="8" cy="26" r="1.5" fill="#f472b6" opacity="0.8" />
        <circle cx="53" cy="20" r="2" fill="#facc15" opacity="0.85" />
        <circle cx="55" cy="30" r="1.3" fill="#4ade80" opacity="0.8" />
        <circle cx="14" cy="48" r="1.5" fill="#a78bfa" opacity="0.8" />
        <circle cx="50" cy="48" r="1.5" fill="#fb923c" opacity="0.8" />
    </svg>
)

const TERMS_SECTIONS = [
    {
        title: '1. Acceptance of Terms',
        content: 'By accessing or using ZenithMind AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.',
    },
    {
        title: '2. Privacy & Data Security',
        content: 'ZenithMind AI utilizes a "Privacy-First" architecture. All video processing occurs locally on your device (Edge AI). We do not record, store, or transmit your video data to any external servers.',
        bullets: [
            'Local Processing: Facial landmark detection and analysis happen entirely in your browser.',
            'Data Minimization: Only numerical biometric vectors (e.g., stress scores) are stored for your personal analytics.',
            'GDPR & HIPAA Compliant: We follow international data privacy standards by design.',
        ],
    },
    {
        title: '3. Use of Services',
        content: 'You agree to use ZenithMind AI only for its intended purpose of workplace wellness and stress management. You may not attempt to reverse engineer the AI models or bypass security measures.',
    },
    {
        title: '4. Disclaimer',
        content: 'ZenithMind AI is a wellness tool and is NOT a medical device. It does not provide medical diagnoses or healthcare advice. Always consult a medical professional for health concerns.',
    },
    {
        title: '5. Intellectual Property',
        content: 'ZenithMind AI and its associated logos, designs, interfaces, and software are the intellectual property of ZenithMind AI and its contributors. Unauthorized reproduction or distribution is strictly prohibited.',
    },
]

export function Footer() {
    const [showMessageBox, setShowMessageBox] = useState(false)
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)
    const [showCopyright, setShowCopyright] = useState(false)
    const [showTerms, setShowTerms] = useState(false)
    const [showContact, setShowContact] = useState(false)

    const contactRef = useRef(null)
    const msgRef = useRef(null)

    useEffect(() => {
        const handleClick = (e) => {
            if (contactRef.current && !contactRef.current.contains(e.target)) {
                setShowContact(false)
            }
            if (msgRef.current && !msgRef.current.contains(e.target)) {
                setShowMessageBox(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handleSendMessage = () => {
        if (!message.trim()) return
        setSent(true)
        setTimeout(() => {
            setSent(false)
            setMessage('')
            setShowMessageBox(false)
            setShowContact(false)
        }, 2000)
    }

    return (
        <>
            <footer className="border-t bg-slate-50/50 backdrop-blur-sm py-10">
                <div className="container px-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

                        {/* LEFT: Logo + Copyright (clickable) */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => setShowCopyright(true)}
                                className="flex items-center gap-2 group hover:opacity-80 transition-opacity text-left"
                                title="View copyright information"
                            >
                                <BrainLogo size={28} />
                                <div>
                                    <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">ZenithMind.AI</p>
                                    <p className="text-xs text-slate-400">© 2026 ZenithMind AI. All rights reserved.</p>
                                </div>
                            </button>
                            <p className="text-xs text-slate-400 pl-9">Empowering workplace well-being.</p>
                        </div>

                        {/* RIGHT: Nav buttons */}
                        <div className="flex items-center gap-3">


                            {/* Terms & Services button */}
                            <button
                                onClick={() => { setShowTerms(true); setShowContact(false) }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Terms & Services
                            </button>
                        </div>



                    </div>
                </div>
            </footer>

            {/* Copyright Modal */}
            {showCopyright && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowCopyright(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-lg w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <BrainLogo size={36} />
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">ZenithMind.AI</h2>
                                <p className="text-xs text-slate-400">Legal & Copyright Information</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p><span className="font-semibold text-slate-800">© 2026 ZenithMind AI.</span> All rights reserved.</p>
                            <p>ZenithMind AI and its associated logos, designs, interfaces, and software are the intellectual property of ZenithMind AI and its contributors. Unauthorized reproduction, distribution, or modification of any part of this product is strictly prohibited without written permission.</p>
                            <p>This software is provided for personal and enterprise use under the ZenithMind AI End-User License Agreement (EULA). Use of this platform constitutes acceptance of our Terms of Service and Privacy Policy.</p>
                            <p>ZenithMind AI is built with privacy-first principles. All biometric data is processed locally on device and is never transmitted to external servers without explicit user consent.</p>
                            <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                                Version 0.2.1 Beta &nbsp;·&nbsp; Built with ❤️ for healthier workplaces &nbsp;·&nbsp; 2026
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCopyright(false)}
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Terms & Services Modal */}
            {showTerms && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setShowTerms(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Terms & Services</h2>
                                    <p className="text-xs text-slate-400">ZenithMind AI · Last updated 2026</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTerms(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Please read these terms carefully before using ZenithMind AI. By accessing our platform, you agree to the following terms.
                            </p>

                            {TERMS_SECTIONS.map((section) => (
                                <div key={section.title} className="space-y-2">
                                    <h3 className="text-base font-bold text-slate-800">{section.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                                    {section.bullets && (
                                        <ul className="mt-2 space-y-1.5 pl-2">
                                            {section.bullets.map((b, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}

                            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                                For questions about these terms, contact us at{' '}
                                <a href="mailto:hari14official@gmail.com" className="text-indigo-500 hover:underline">
                                    hari14official@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 pb-8 pt-4 border-t border-slate-50">
                            <button
                                onClick={() => setShowTerms(false)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
