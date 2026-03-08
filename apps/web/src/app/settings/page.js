'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true)
    const [darkMode, setDarkMode] = useState(false)
    const [gender, setGender] = useState('Prefer not to say')
    const [age, setAge] = useState('')
    const [dob, setDob] = useState('')
    const [showAvatarPreview, setShowAvatarPreview] = useState(false)
    const [user, setUser] = useState(null)
    const [about, setAbout] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [saved, setSaved] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            try { setUser(JSON.parse(userData)) } catch { }
        }
        const savedAbout = localStorage.getItem('user_about') || ''
        setAbout(savedAbout)
        const savedAvatar = localStorage.getItem('user_avatar')
        setAvatar(savedAvatar)
        const savedGender = localStorage.getItem('user_gender') || 'Prefer not to say'
        setGender(savedGender)
        const savedAge = localStorage.getItem('user_age') || ''
        setAge(savedAge)
        const savedDob = localStorage.getItem('user_dob') || ''
        setDob(savedDob)
        const savedDark = localStorage.getItem('dark_mode') === 'true'
        setDarkMode(savedDark)
        if (savedDark) document.documentElement.classList.add('dark')
    }, [])

    const toggleDarkMode = () => {
        const next = !darkMode
        setDarkMode(next)
        localStorage.setItem('dark_mode', String(next))
        if (next) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    const handleSave = () => {
        localStorage.setItem('user_about', about)
        localStorage.setItem('user_gender', gender)
        localStorage.setItem('user_age', age)
        localStorage.setItem('user_dob', dob)
        if (avatar) localStorage.setItem('user_avatar', avatar)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        globalThis.location.reload()
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatar(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        globalThis.location.href = '/'
    }

    const confirmDelete = () => {
        localStorage.clear()
        globalThis.location.href = '/'
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto pb-12">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
                    <p className="text-slate-400 mt-1">Manage your account preferences and application settings.</p>
                </div>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>View and update your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Profile Picture at Top */}
                        <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div
                                onClick={() => avatar && setShowAvatarPreview(true)}
                                className={cn(
                                    "h-32 w-32 rounded-full ring-4 ring-indigo-500/20 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                                    !avatar && "border-2 border-dashed border-slate-300"
                                )}
                            >
                                {avatar ? (
                                    <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-4xl">👤</span>
                                )}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Profile Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-400">JPG/PNG/GIF. Click image to preview.</p>
                            </div>
                        </div>

                        {/* Full-Size Preview Modal */}
                        {showAvatarPreview && (
                            <div
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300"
                                onClick={() => setShowAvatarPreview(false)}
                            >
                                <div className="relative max-w-lg w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                                    <img src={avatar} alt="Large Avatar" className="w-full h-full object-cover" />
                                    <button
                                        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center text-xl transition-colors"
                                        onClick={() => setShowAvatarPreview(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium">First Name</label>
                                <Input id="first-name" placeholder="First name" defaultValue={user?.name?.split(' ')[0] || ''} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium">Last Name</label>
                                <Input id="last-name" placeholder="Last name" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow outline-none"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="age" className="text-sm font-medium">Age</label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="e.g. 25"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="dob" className="text-sm font-medium">Date of Birth</label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                {dob && (
                                    <p className="text-xs text-slate-400">
                                        Age: {Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))} years old
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="opacity-70 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-400">Locked for security purposes.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">About</label>
                            <textarea
                                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-shadow outline-none"
                                placeholder="Write something about yourself..."
                                value={about}
                                onChange={e => setAbout(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-start">
                            <Button onClick={handleSave} className="px-8 font-bold text-white bg-indigo-600 hover:bg-indigo-700 h-11">
                                {saved ? '✓ Changes Saved' : 'Save Profile'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your application experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-muted-foreground">Receive weekly summary reports.</p>
                            </div>
                            <div
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifications ? 'bg-primary' : 'bg-slate-200'}`}
                                onClick={() => setNotifications(v => !v)}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        {/* Dark Mode */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Dark Mode</h3>
                                <p className="text-sm text-muted-foreground">
                                    {darkMode ? '🌙 Dark theme is active.' : '☀️ Switch to dark theme.'}
                                </p>
                            </div>
                            <div
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                onClick={toggleDarkMode}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Log Out */}
                <Card className="border-amber-100">
                    <CardHeader>
                        <CardTitle className="text-amber-600 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Log Out
                        </CardTitle>
                        <CardDescription>Sign out of your ZenithMind AI account on this device.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleLogout}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 h-10 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-100">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setShowDeleteModal(true)} variant="destructive">Delete Account</Button>
                    </CardContent>
                </Card>

                {/* Custom Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4">
                        <div className="bg-background border rounded-xl p-6 shadow-2xl max-w-sm w-full space-y-4">
                            <h3 className="text-xl font-bold">Are you sure do you want to delete this account</h3>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>No</Button>
                                <Button variant="destructive" onClick={confirmDelete}>Yes</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
