'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Brain logo for sidebar
function BrainLogo({ size = 30 }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none">
            <defs>
                <radialGradient id="dbBrainLeft" cx="35%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#60d0ff" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#f472b6" />
                </radialGradient>
                <radialGradient id="dbBrainRight" cx="65%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#4ade80" />
                </radialGradient>
                <linearGradient id="dbStem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
            </defs>
            <path d="M32 10 C22 10 14 16 14 24 C14 28 15.5 31.5 18 34 C15 36 13 39.5 13 43 C13 49 18 53 24 53 L32 53 L32 10Z" fill="url(#dbBrainLeft)" opacity="0.92" />
            <path d="M32 10 C42 10 50 16 50 24 C50 28 48.5 31.5 46 34 C49 36 51 39.5 51 43 C51 49 46 53 40 53 L32 53 L32 10Z" fill="url(#dbBrainRight)" opacity="0.92" />
            <line x1="32" y1="11" x2="32" y2="53" stroke="white" strokeWidth="1.2" opacity="0.5" />
            <path d="M20 22 Q26 25 30 22" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M17 33 Q23 37 30 33" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M19 43 Q25 46 30 42" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M44 22 Q38 25 34 22" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M47 33 Q41 37 34 33" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M45 43 Q39 46 34 42" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <line x1="28" y1="53" x2="25" y2="60" stroke="url(#dbStem)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="32" y1="53" x2="32" y2="61" stroke="url(#dbStem)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="36" y1="53" x2="39" y2="60" stroke="url(#dbStem)" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="11" cy="18" r="2" fill="#60d0ff" opacity="0.85" />
            <circle cx="8" cy="26" r="1.5" fill="#f472b6" opacity="0.8" />
            <circle cx="53" cy="20" r="2" fill="#facc15" opacity="0.85" />
            <circle cx="55" cy="30" r="1.3" fill="#4ade80" opacity="0.8" />
            <circle cx="14" cy="48" r="1.5" fill="#a78bfa" opacity="0.8" />
            <circle cx="50" cy="48" r="1.5" fill="#fb923c" opacity="0.8" />
        </svg>
    )
}

export function DashboardLayout({ children }) {
    const pathname = usePathname()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            try {
                const parsed = JSON.parse(userData)
                const storedAvatar = localStorage.getItem('user_avatar')
                setUser({ ...parsed, avatar: storedAvatar })
            } catch { }
        }
    }, [])

    const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

    return (
        <div className="min-h-screen flex flex-col">
            {/* Shared Navbar at the very top */}
            <Navbar />

            <div className="flex flex-1 mesh-bg text-slate-800 font-sans selection:bg-indigo-500/30">
                {/* Sidebar */}
                <aside className="hidden w-64 flex-col border-r border-white/20 bg-white/40 backdrop-blur-xl md:flex shadow-2xl z-20">
                    {/* Sidebar Nav (Logo removed) */}

                    {/* Nav */}
                    <div className="flex-1 overflow-auto py-4">
                        <nav className="grid items-start px-4 text-sm font-medium gap-2">
                            <NavLink href="/dashboard" icon="📊">Dashboard</NavLink>
                            <NavLink href="/play" icon="🎮">Start Session</NavLink>
                            <NavLink href="/activity" icon="🧘">Activity</NavLink>
                            <NavLink href="/report" icon="📄">Reports</NavLink>
                            <NavLink href="/settings" icon="⚙️">Settings</NavLink>
                        </nav>

                        {/* Live Status */}
                        <div className="mt-8 mx-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-md">
                            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">Live Status</h4>
                            <div className="flex items-center gap-2 text-xs text-indigo-900/70">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                System Operational
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-4 border-t border-white/20 bg-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="h-10 w-10 rounded-full object-cover shadow-lg ring-2 ring-white/60 flex-shrink-0" />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/60 flex-shrink-0">
                                    {initials}
                                </div>
                            )}
                            <div className="text-sm min-w-0">
                                <p className="font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                    {/* Space Theme Stars */}
                    <div className="stars-container">
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="star"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 3}px`,
                                    height: `${Math.random() * 3}px`,
                                    animationDelay: `${Math.random() * 3}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Background Blobs */}
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-blob pointer-events-none mix-blend-multiply dark:mix-blend-screen overflow-hidden"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none mix-blend-multiply dark:mix-blend-screen overflow-hidden"></div>
                    <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000 pointer-events-none mix-blend-multiply"></div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}

function NavLink({ href, icon, children }) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href))

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 font-medium group relative overflow-hidden",
                isActive ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-600 hover:bg-white/50 hover:text-indigo-600"
            )}
        >
            <span className={cn("text-lg transition-transform duration-300 group-hover:scale-110", isActive && "animate-pulse-slow")}>{icon}</span>
            <span className="relative z-10">{children}</span>
            {!isActive && <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-colors duration-300" />}
        </Link>
    )
}
