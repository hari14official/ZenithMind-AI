'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { API_BASE_URL } from '@/lib/api-config'

// Pages where "Log In" and "Get Started" are always shown
const PUBLIC_AUTH_PAGES = new Set(['/', '/about', '/terms'])

// Pages where NOTHING extra should appear in the navbar (clean)
const CLEAN_PAGES = new Set(['/login', '/register'])

// Service cards for the Services dropdown
const SERVICES = [
    { icon: '👁️', title: 'Detects Stress', desc: 'Analyses 468 facial landmarks — blink rate, eye aspect ratio, head pose — in real-time at up to 30 FPS.' },
    { icon: '🧘', title: 'Triggers Relief', desc: 'Suggests gamified micro-breaks (Zen Breath, Whack-a-Mole, Memory Matrix) when stress spikes above your threshold.' },
    { icon: '📈', title: 'Tracks Trends', desc: 'Historical charts and session timelines let you spot patterns in your weekly stress curve and improve over time.' },
    { icon: '🔒', title: 'Stays Private', desc: 'Edge AI ensures no video ever leaves your device. GDPR & HIPAA compliant by design — privacy-first architecture.' },
]

// Build real-time notifications from stress session data
function buildNotifications(sessions, reports) {
    const notifs = []

    if (sessions && sessions.length > 0) {
        const latest = sessions[0]
        const avg = Math.round(latest.avg_stress ?? 0)
        const level = avg < 40 ? '🟢 Calm' : avg < 70 ? '🟡 Moderate' : '🔴 High'
        notifs.push({
            id: `sess-${latest.id}`,
            icon: '🧠',
            text: `Last session: stress score ${avg}/100 — ${level}`,
            time: latest.created_at
                ? new Date(latest.created_at).toLocaleString()
                : 'Recent',
        })

        if (sessions.length >= 2) {
            const prev = sessions[1]
            const diff = Math.round((latest.avg_stress ?? 0) - (prev.avg_stress ?? 0))
            if (Math.abs(diff) >= 5) {
                notifs.push({
                    id: `trend-${latest.id}`,
                    icon: diff < 0 ? '📉' : '📈',
                    text: `Stress ${diff < 0 ? 'decreased' : 'increased'} by ${Math.abs(diff)} pts since your last session`,
                    time: 'Trend alert',
                })
            }
        }
    }

    if (reports && reports.reports && reports.reports.length > 0) {
        const r = reports.reports[0]
        notifs.push({
            id: `report-${r.id}`,
            icon: '📄',
            text: `Wellness report ready — Stress level: ${r.stress_level}`,
            time: r.created_at ? new Date(r.created_at).toLocaleString() : 'Available',
        })
    }

    // Always include a system notification
    notifs.push({
        id: 'system',
        icon: '✅',
        text: 'System operational — AI neural net is active and monitoring.',
        time: 'Now',
    })

    return notifs
}

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [showServices, setShowServices] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState([
        { id: 'welcome', icon: '👋', text: 'Welcome to ZenithMind AI! Start a session to begin tracking.', time: 'Now' },
        { id: 'system', icon: '✅', text: 'System operational — AI neural net is active and monitoring.', time: 'Now' },
    ])
    const [unreadCount, setUnreadCount] = useState(0)
    const [lastSeenCount, setLastSeenCount] = useState(0)
    const servicesRef = useRef(null)
    const notifRef = useRef(null)
    const intervalRef = useRef(null)

    // Normalize path — strip trailing slash so /about/ === /about
    const normalizedPath = pathname.endsWith('/') && pathname.length > 1
        ? pathname.slice(0, -1)
        : pathname

    // Home & About ALWAYS show Log In + Get Started
    const showAuthButtons = PUBLIC_AUTH_PAGES.has(normalizedPath)

    // Notifications + Help only on non-public, non-login/register pages when logged in
    const showLoggedInButtons = isLoggedIn && !PUBLIC_AUTH_PAGES.has(normalizedPath) && !CLEAN_PAGES.has(normalizedPath)

    // Features link: shows when logged in, hidden on login/register pages
    const showFeaturesLink = isLoggedIn && !CLEAN_PAGES.has(normalizedPath)

    // Brand Link Check: always show on all pages
    const showBrand = true

    // Fetch real-time notifications from backend
    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        if (!token || !userData) return
        try {
            const u = JSON.parse(userData)
            const userId = u?.id
            if (!userId) return

            const [sessRes, repRes] = await Promise.allSettled([
                fetch(`${API_BASE_URL}/api/v1/stress/user/${userId}/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE_URL}/api/v1/reports/user/${userId}/reports`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ])

            const sessions = sessRes.status === 'fulfilled' && sessRes.value.ok
                ? await sessRes.value.json()
                : null
            const reports = repRes.status === 'fulfilled' && repRes.value.ok
                ? await repRes.value.json()
                : null

            const built = buildNotifications(sessions, reports)
            setNotifications(built)
            setUnreadCount(prev => {
                const newCount = built.length
                if (newCount > lastSeenCount) return newCount - lastSeenCount
                return prev
            })
        } catch {
            // keep defaults on error
        }
    }, [lastSeenCount])

    // Detect login state + kick off polling
    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        const loggedIn = !!token
        setIsLoggedIn(loggedIn)
        if (userData) {
            try { setUser(JSON.parse(userData)) } catch { }
        }

        if (loggedIn) {
            fetchNotifications()
            intervalRef.current = setInterval(fetchNotifications, 30000) // poll every 30s
        }
        return () => clearInterval(intervalRef.current)
    }, [pathname, fetchNotifications])

    // Set unread badge when notifications load
    useEffect(() => {
        setUnreadCount(notifications.length)
    }, [notifications])

    // Listen to local custom notifications
    useEffect(() => {
        const handleNewNotification = (e) => {
            const notif = e.detail;
            setNotifications(prev => [notif, ...prev]);
        }
        window.addEventListener('new-notification', handleNewNotification);
        return () => window.removeEventListener('new-notification', handleNewNotification);
    }, [])

    // Mark all as read
    const markAllRead = () => {
        setLastSeenCount(notifications.length)
        setUnreadCount(0)
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (servicesRef.current && !servicesRef.current.contains(e.target)) {
                setShowServices(false)
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false)
                setLastSeenCount(notifications.length)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [notifications.length])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center relative">

                {/* LEFT: Logo — Link to home on public pages, hidden on others */}
                {showBrand ? (
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="30" height="30" fill="none" aria-label="ZenithMind Brain Logo">
                            <defs>
                                <radialGradient id="navBrainLeft" cx="35%" cy="40%" r="60%">
                                    <stop offset="0%" stopColor="#60d0ff" />
                                    <stop offset="50%" stopColor="#a78bfa" />
                                    <stop offset="100%" stopColor="#f472b6" />
                                </radialGradient>
                                <radialGradient id="navBrainRight" cx="65%" cy="40%" r="60%">
                                    <stop offset="0%" stopColor="#fb923c" />
                                    <stop offset="50%" stopColor="#facc15" />
                                    <stop offset="100%" stopColor="#4ade80" />
                                </radialGradient>
                                <linearGradient id="navStem" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f472b6" />
                                    <stop offset="100%" stopColor="#a78bfa" />
                                </linearGradient>
                            </defs>
                            <path d="M32 10 C22 10 14 16 14 24 C14 28 15.5 31.5 18 34 C15 36 13 39.5 13 43 C13 49 18 53 24 53 L32 53 L32 10Z" fill="url(#navBrainLeft)" opacity="0.92" />
                            <path d="M32 10 C42 10 50 16 50 24 C50 28 48.5 31.5 46 34 C49 36 51 39.5 51 43 C51 49 46 53 40 53 L32 53 L32 10Z" fill="url(#navBrainRight)" opacity="0.92" />
                            <line x1="32" y1="11" x2="32" y2="53" stroke="white" strokeWidth="1.2" opacity="0.5" />
                            <path d="M20 22 Q26 25 30 22" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
                            <path d="M17 33 Q23 37 30 33" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
                            <path d="M19 43 Q25 46 30 42" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
                            <path d="M44 22 Q38 25 34 22" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
                            <path d="M47 33 Q41 37 34 33" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
                            <path d="M45 43 Q39 46 34 42" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
                            <line x1="28" y1="53" x2="25" y2="60" stroke="url(#navStem)" strokeWidth="1.4" strokeLinecap="round" />
                            <line x1="32" y1="53" x2="32" y2="61" stroke="url(#navStem)" strokeWidth="1.4" strokeLinecap="round" />
                            <line x1="36" y1="53" x2="39" y2="60" stroke="url(#navStem)" strokeWidth="1.4" strokeLinecap="round" />
                            <circle cx="11" cy="18" r="2" fill="#60d0ff" opacity="0.85" />
                            <circle cx="8" cy="26" r="1.5" fill="#f472b6" opacity="0.8" />
                            <circle cx="53" cy="20" r="2" fill="#facc15" opacity="0.85" />
                            <circle cx="55" cy="30" r="1.3" fill="#4ade80" opacity="0.8" />
                            <circle cx="14" cy="48" r="1.5" fill="#a78bfa" opacity="0.8" />
                            <circle cx="50" cy="48" r="1.5" fill="#fb923c" opacity="0.8" />
                        </svg>
                        <span className="hidden font-bold sm:inline-block text-foreground">ZenithMind.AI</span>
                    </div>
                ) : (
                    <div className="flex-shrink-0 w-24" /> // placeholder for spacing
                )}

                {/* CENTER: Nav links */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-8 text-sm font-semibold">
                    {/* Home — always navigates to home page */}
                    <Link href="/" className="text-foreground/70 hover:text-primary transition-colors">Home</Link>

                    {/* About — always navigates to about page */}
                    <Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">About</Link>

                    {/* Services dropdown */}
                    <div className="relative" ref={servicesRef}>
                        <button
                            onClick={() => setShowServices(v => !v)}
                            className={`flex items-center gap-1 transition-colors ${showServices ? 'text-primary' : 'text-foreground/70 hover:text-primary'}`}
                        >
                            Services
                            <svg className={`w-3 h-3 transition-transform duration-200 ${showServices ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showServices && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 w-[520px]">
                                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-slate-800">What ZenithMind Does</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">A holistic solution for workplace wellness</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SERVICES.map((s) => (
                                            <div key={s.title} className="flex items-start gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors">
                                                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                                                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-xs text-slate-400">Powered by Edge AI · Privacy-first</span>
                                        <Link href="/about#services" onClick={() => setShowServices(false)} className="text-xs font-semibold text-indigo-600 hover:underline">
                                            Learn more →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Features — only when logged in → goes to Dashboard */}
                    {showFeaturesLink && (
                        <Link href="/dashboard" className="text-foreground/70 hover:text-primary transition-colors">
                            Features
                        </Link>
                    )}

                    {/* Contact us dropdown */}
                    <div className="relative group">
                        <button className="text-foreground/70 group-hover:text-primary transition-colors flex items-center gap-1 focus:outline-none">
                            Contact us
                            <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block z-50">
                            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex gap-4 min-w-[180px]">
                                <a href="https://github.com/hari14official" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-50 rounded-xl transition-colors group/icon" title="GitHub">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-600 group-hover/icon:text-indigo-600">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                                <a href="mailto:hari14official@gmail.com" className="p-2 hover:bg-slate-50 rounded-xl transition-colors group/icon" title="Gmail">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="group-hover/icon:scale-110 transition-transform">
                                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.573l8.073-6.08c1.618-1.214 3.927-.059 3.927 1.964z" fill="#EA4335" />
                                    </svg>
                                </a>
                                <Link href="/contact" className="p-2 hover:bg-slate-50 rounded-xl transition-colors group/icon" title="Message">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="group-hover/icon:scale-110 transition-transform">
                                        <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#4285F4" />
                                        <path d="M7 9h10M7 13h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                </nav>

                {/* RIGHT: buttons */}
                <div className="ml-auto flex items-center gap-2">

                    {/* === LOGGED IN on non-public pages: Notifications + Help === */}
                    {showLoggedInButtons && (
                        <>
                            {/* Notifications — real-time polled */}
                            <div ref={notifRef} className="relative">
                                <button
                                    onClick={() => {
                                        setShowNotifications(v => !v)
                                        setShowHelp(false)
                                    }}
                                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
                                    title="Notifications"
                                    id="navbar-notifications-btn"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                    <span className="hidden sm:inline">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center -translate-y-0.5 translate-x-0.5 animate-pulse">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">🔔 Notifications</h3>
                                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
                                        </div>
                                        <div className="space-y-1 max-h-72 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                                    <span className="text-xl flex-shrink-0">{n.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-slate-700 font-medium leading-snug">{n.text}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={markAllRead}
                                            className="w-full mt-3 text-xs font-semibold text-indigo-600 hover:underline py-1 border-t border-slate-100 pt-3"
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Help — Navigates to About Page Q&A section */}
                            <Link
                                href="/about#qa-section"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
                                title="Help"
                                id="navbar-help-btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                <span className="hidden sm:inline">Help</span>
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={async () => {
                                    try {
                                        const { auth } = await import('@/lib/firebase');
                                        const { signOut } = await import('firebase/auth');
                                        await signOut(auth);
                                    } catch (e) {
                                        console.error('Logout error', e);
                                    }
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                title="Log out"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span className="hidden sm:inline">Log out</span>
                            </button>
                        </>
                    )}

                    {/* === Public pages: Log In + Get Started === */}
                    {showAuthButtons && (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Log In</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
