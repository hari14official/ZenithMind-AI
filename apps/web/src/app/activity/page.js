'use client'
import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const ACTIVITIES = [
    {
        id: 1,
        name: 'Box Breathing',
        emoji: '🌬️',
        duration: '4 minutes',
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        steps: [
            'Sit comfortably with your back straight.',
            'Breathe IN slowly for 4 counts.',
            'HOLD your breath for 4 counts.',
            'Breathe OUT slowly for 4 counts.',
            'HOLD empty for 4 counts.',
            'Repeat this cycle 4–6 times.',
        ],
        tip: 'Used by Navy SEALs to stay calm under pressure. Works in under 2 minutes.'
    },
    {
        id: 2,
        name: 'Breathing',
        emoji: '🧘',
        duration: '3 minutes',
        color: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/30',
        steps: [
            'Place the tip of your tongue on your upper front teeth.',
            'Exhale completely through your mouth.',
            'Close your mouth and inhale through your nose for 4 counts.',
            'Hold your breath for 7 counts.',
            'Exhale completely through your mouth for 8 counts.',
            'Repeat this cycle 3–4 times.',
        ],
        tip: 'a natural tranquiliser for the nervous system.'
    },
    {
        id: 3,
        name: 'Progressive Muscle Relaxation',
        emoji: '💪',
        duration: '5 minutes',
        color: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        steps: [
            'Sit or lie down in a comfortable position.',
            'Tense the muscles in your feet — squeeze for 5 seconds.',
            'Release and notice the relaxation for 10 seconds.',
            'Move up: calves , thighs , abdomen , hands , arms , shoulders , face.',
            'Tense each group for 5 seconds, release for 10 seconds.',
            'Finish with three slow, deep breaths.',
        ],
        tip: 'Reduces physical tension stored from stress within 5 minutes.'
    },
    {
        id: 4,
        name: 'Mindful Body Scan',
        emoji: '🌊',
        duration: '5 minutes',
        color: 'from-pink-500 to-rose-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/30',
        steps: [
            'Close your eyes and take 3 deep breaths slowly.',
            'Bring attention to the top of your head.',
            'Slowly move attention downward — notice any tension without judgement.',
            'Continue: face , neck , shoulders , chest , arms , hands.',
            'Continue: belly , lower back , hips , legs ,feet.',
            'Take a final deep breath and open your eyes slowly.',
        ],
        tip: 'Reconnects mind and body, breaking the stress response cycle.'
    },
    {
        id: 5,
        name: 'Gratitude Journalling',
        emoji: '📝',
        duration: '3 minutes',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        steps: [
            'Open a notes app or grab a piece of paper.',
            'Write "Today I am grateful for:" at the top.',
            'List 3 specific things — big or small.',
            'For each item, write one sentence about WHY you\'re grateful.',
            'Read all three items aloud slowly.',
            'Take a deep breath and feel the shift in mood.',
        ],
        tip: 'Studies show gratitude journalling lowers cortisol levels within 10 minutes.'
    },
    {
        id: 6,
        name: 'Eye Rest ',
        emoji: '👁️',
        duration: '2 minutes',
        color: 'from-sky-500 to-indigo-500',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/30',
        steps: [
            'Stop looking at your screen.',
            'Find a point at least 20 feet (6m) away from you.',
            'Focus on that point for 20 seconds.',
            'Slowly blink 10 times to moisten your eyes.',
            'Close your eyes and gently cup your palms over them.',
            'Rest for 30 seconds, then slowly open your eyes.',
        ],
        tip: 'Recommended by optometrists for every 20 minutes of screen time.'
    },
    {
        id: 7,
        name: 'Hand & Wrist Stretch',
        emoji: '🖐️',
        duration: '2 minutes',
        color: 'from-lime-500 to-green-600',
        bg: 'bg-lime-500/10',
        border: 'border-lime-500/30',
        steps: [
            'Extend one arm in front of you, palm up.',
            'With your other hand, gently pull your fingers back toward you.',
            'Hold for 15 seconds. Switch hands.',
            'Make fists with both hands, squeeze for 5 seconds, then spread fingers wide.',
            'Rotate your wrists in circles — 5 times each direction.',
            'Shake your hands loosely for 10 seconds.',
        ],
        tip: 'Relieves tension from typing and mouse use — great every 30 minutes.'
    },
    {
        id: 8,
        name: 'Cold Water Splash',
        emoji: '💧',
        duration: '1 minute',
        color: 'from-cyan-500 to-blue-500',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        steps: [
            'Walk to the nearest sink.',
            'Turn on cold water.',
            'Splash cold water on your face 3–5 times.',
            'Let the water drip for a moment — don\'t instantly dry.',
            'Pat your face dry gently with a clean towel.',
            'Return to your desk and take one slow deep breath.',
        ],
        tip: 'Activates the "dive reflex" — instantly slows heart rate and calms the nervous system.'
    },
    {
        id: 9,
        name: 'Shoulder & Neck Release',
        emoji: '🔄',
        duration: '3 minutes',
        color: 'from-fuchsia-500 to-pink-600',
        bg: 'bg-fuchsia-500/10',
        border: 'border-fuchsia-500/30',
        steps: [
            'Sit upright in your chair with both feet on the floor.',
            'Slowly drop your right ear toward your right shoulder.',
            'Hold for 15 seconds, breathing deeply.',
            'Return to centre, then tilt to the left. Hold 15 seconds.',
            'Roll your shoulders backward 5 times, then forward 5 times.',
            'Let your shoulders drop and relax completely.',
        ],
        tip: 'The neck and shoulders hold most stress-related tension. This releases it instantly.'
    },
    {
        id: 10,
        name: 'Mindful Walking Break',
        emoji: '🚶',
        duration: '5 minutes',
        color: 'from-teal-500 to-emerald-600',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/30',
        steps: [
            'Leave your desk and find a short path to walk.',
            'Walk at a slow, comfortable pace.',
            'Pay attention to each footstep — the contact, lift, and placement.',
            'Notice 5 things you can see, 3 you can hear, 1 you can smell.',
            'Take slow, deep breaths in sync with your steps.',
            'Return to your desk feeling grounded.',
        ],
        tip: 'A 5-minute walk reduces anxiety by 18% — more effective than sitting breaks.'
    },
]

export default function ActivityPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [completedIds, setCompletedIds] = useState([])
    const [animating, setAnimating] = useState(false)
    const [isStarted, setIsStarted] = useState(false)
    const [allCompleted, setAllCompleted] = useState(false)
    const synthRef = useRef(null)
    const encourageIntervalRef = useRef(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis
            // Pre-load voices
            const loadVoices = () => synthRef.current.getVoices()
            loadVoices()
            if (synthRef.current.onvoiceschanged !== undefined) {
                synthRef.current.onvoiceschanged = loadVoices
            }
        }
        return () => {
            if (synthRef.current) synthRef.current.cancel()
            if (encourageIntervalRef.current) clearInterval(encourageIntervalRef.current)
        }
    }, [])

    const playAudioForActivity = (activity) => {
        if (!synthRef.current) return
        synthRef.current.cancel()
        if (encourageIntervalRef.current) clearInterval(encourageIntervalRef.current)

        const voices = synthRef.current.getVoices()
        // Try to find a female voice
        let femaleVoice = voices.find(v =>
            v.name.includes('Zira') ||
            v.name.includes('Female') ||
            v.name.includes('female') ||
            v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Google UK English Female')
        )
        if (!femaleVoice) femaleVoice = voices.find(v => v.lang.startsWith('en'))

        const speak = (text, rateStr) => {
            const utterance = new SpeechSynthesisUtterance(text)
            if (femaleVoice) utterance.voice = femaleVoice
            utterance.pitch = 1.1
            // Use provided rate, or default to a calming pace
            utterance.rate = rateStr || 0.9
            synthRef.current.speak(utterance)
        }

        speak(`Activity: ${activity.name}.`)
        speak(`Duration: ${activity.duration}.`)
        speak("Follow these steps:")
        activity.steps.forEach((step, index) => {
            if (index === 0) {
                speak(`Step 1. ${step}`)
            } else {
                speak(`Okay, now Step ${index + 1}. ${step}`)
            }

            // Look for patterns like "for 4 counts" or "for 5 seconds"
            const match = step.match(/for (\d+) (count|second)/i);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > 0 && num <= 10) {
                    for (let i = 1; i <= num; i++) {
                        // Slow down the rate considerably for counting out loud
                        speak(i.toString(), 0.5)
                    }
                }
            }
        })
        speak(`Tip: ${activity.tip}`)
        speak(`Okay, now go to next activity.`)

        const encouragements = [
            "You are doing well.",
            "Great job focusing on your well-being.",
            "Take your time, you are doing wonderfully.",
            "Stay relaxed and feel the stress melting away.",
            "You are doing great. Keep up the good work."
        ];

        encourageIntervalRef.current = setInterval(() => {
            if (synthRef.current && !synthRef.current.speaking) {
                const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
                speak(randomMsg);
            }
        }, 15000); // Every 15 seconds
    }

    const handleStart = () => {
        setIsStarted(true)
        playAudioForActivity(ACTIVITIES[currentIndex])
    }

    const replayAudio = () => {
        playAudioForActivity(ACTIVITIES[currentIndex])
    }

    const activity = ACTIVITIES[currentIndex]
    const isCompleted = completedIds.includes(activity.id)

    const goNext = () => {
        if (animating) return
        setAnimating(true)
        setTimeout(() => {
            const nextIdx = (currentIndex + 1) % ACTIVITIES.length
            setCurrentIndex(nextIdx)
            playAudioForActivity(ACTIVITIES[nextIdx])
            setAnimating(false)
        }, 300)
    }

    const goPrev = () => {
        if (animating) return
        setAnimating(true)
        setTimeout(() => {
            const prevIdx = (currentIndex - 1 + ACTIVITIES.length) % ACTIVITIES.length
            setCurrentIndex(prevIdx)
            playAudioForActivity(ACTIVITIES[prevIdx])
            setAnimating(false)
        }, 300)
    }

    const markDone = () => {
        if (!isCompleted) {
            const newIds = [...completedIds, activity.id];
            setCompletedIds(newIds);

            if (newIds.length === ACTIVITIES.length) {
                setAllCompleted(true);

                // Dispatch notification for Navbar
                const detail = {
                    id: `activity-done-${Date.now()}`,
                    icon: '🎉',
                    text: 'You completed your activity successfully. I hope that I reduced your stress level.',
                    time: 'Just now'
                };
                window.dispatchEvent(new CustomEvent('new-notification', { detail }));

                // Play completion audio
                if (synthRef.current) {
                    synthRef.current.cancel();
                    if (encourageIntervalRef.current) clearInterval(encourageIntervalRef.current);

                    const voices = synthRef.current.getVoices();
                    let femaleVoice = voices.find(v =>
                        v.name.includes('Zira') ||
                        v.name.includes('Female') ||
                        v.name.includes('female') ||
                        v.name.includes('Samantha') ||
                        v.name.includes('Victoria') ||
                        v.name.includes('Google UK English Female')
                    );
                    if (!femaleVoice) femaleVoice = voices.find(v => v.lang.startsWith('en'));

                    const utterance = new SpeechSynthesisUtterance("you completed your activity successfully. I hope that I reduced your stress level.");
                    if (femaleVoice) utterance.voice = femaleVoice;
                    utterance.pitch = 1.1;
                    utterance.rate = 0.7;
                    synthRef.current.speak(utterance);
                }
            }
        }
    }

    return (
        <DashboardLayout>
            {allCompleted ? (
                <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl animate-in fade-in duration-1000">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay blur-[2px]"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8 p-8">
                        <div className="w-32 h-32 bg-emerald-500/20 backdrop-blur-xl rounded-full flex items-center justify-center text-7xl border border-emerald-500/40 shadow-2xl animate-bounce">
                            🎉
                        </div>
                        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 text-center drop-shadow-lg">
                            Activities Completed!
                        </h2>
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-lg w-full transform hover:scale-105 transition-transform duration-500">
                            <p className="text-emerald-50 text-center text-xl font-medium leading-relaxed">
                                You completed your activity successfully. I hope that I reduced your stress level.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xl shadow-xl shadow-emerald-500/30 transition-all hover:scale-110 border border-white/20 uppercase tracking-wider"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            ) : !isStarted ? (
                <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center text-5xl border border-indigo-500/30 shadow-2xl">
                        🧘
                    </div>
                    <h2 className="text-4xl font-extrabold text-white text-center">Ready to Destress?</h2>
                    <p className="text-slate-400 text-center max-w-lg mb-8 leading-relaxed">
                        Follow guided, science-backed activities carefully curated to help you relax and regain focus. Real-time audio instructions will guide you step-by-step.
                    </p>
                    <button
                        onClick={handleStart}
                        className="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all hover:scale-105"
                    >
                        Start Activity
                    </button>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
                    {/* Header */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-500/30">
                            🧘 AI Stress Relief
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">Stress Relief Activities</h2>
                        <p className="text-slate-400 mt-1">
                            Follow each activity one at a time. Complete them at your own pace.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {ACTIVITIES.map((a, i) => (
                            <button
                                key={a.id}
                                onClick={() => {
                                    setAnimating(true);
                                    setTimeout(() => {
                                        setCurrentIndex(i);
                                        playAudioForActivity(ACTIVITIES[i]);
                                        setAnimating(false);
                                    }, 200)
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-indigo-400' :
                                    completedIds.includes(a.id) ? 'w-4 bg-emerald-400' : 'w-4 bg-white/20'
                                    }`}
                                title={a.name}
                            />
                        ))}
                        <span className="text-xs text-slate-400 ml-2 font-medium">
                            {currentIndex + 1} / {ACTIVITIES.length}
                        </span>
                        {completedIds.length > 0 && (
                            <span className="text-xs text-emerald-400 font-bold ml-1">
                                · {completedIds.length} done ✓
                            </span>
                        )}
                    </div>

                    {/* Activity Card */}
                    <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        <div className={`rounded-3xl border ${activity.border} ${activity.bg} backdrop-blur-sm p-8 shadow-2xl`}>
                            {/* Card header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {activity.emoji}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">{activity.name}</h3>
                                        <span className="text-sm text-slate-400 font-medium">⏱️ {activity.duration}</span>
                                    </div>
                                </div>
                                {isCompleted && (
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                                        ✓ Done
                                    </span>
                                )}
                                <button
                                    onClick={replayAudio}
                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-full border border-white/10 transition-colors ml-2"
                                    title="Replay Audio"
                                >
                                    🔊 Replay Audio
                                </button>
                            </div>

                            {/* Steps */}
                            <div className="space-y-3 mb-6">
                                {activity.steps.map((step, i) => (
                                    <div key={i} className="flex gap-4 items-start p-3 rounded-xl bg-white/5 border border-white/10">
                                        <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${activity.color} text-white text-xs font-black flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                            {i + 1}
                                        </span>
                                        <p className="text-slate-200 font-medium leading-relaxed text-sm">{step}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Tip */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-3 mb-6">
                                <span className="text-xl">💡</span>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed italic">{activity.tip}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <button
                                    onClick={markDone}
                                    disabled={isCompleted}
                                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isCompleted
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isCompleted ? '✓ Completed' : '✅ Mark as Done'}
                                </button>
                                <button
                                    onClick={goNext}
                                    className={`px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r ${activity.color} text-white shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
                                >
                                    Next Activity →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation arrows */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={goPrev}
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white/10"
                        >
                            ← Previous
                        </button>
                        <div className="text-xs text-slate-500 text-center">
                            AI-curated activities · Science-backed stress reduction
                        </div>
                        <button
                            onClick={goNext}
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white/10"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
