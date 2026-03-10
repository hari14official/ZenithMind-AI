'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function BenefitsPage() {
    const mainBenefits = [
        {
            title: "Improved Focus",
            desc: "Enhance concentration and mental clarity through regular practice.",
            research: "Research: Studies show meditation can increase attention span by up to 50%.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
            )
        },
        {
            title: "Stress Reduction",
            desc: "Lower cortisol levels and better stress management.",
            research: "Research: Regular meditation reduces stress hormone levels by 15-20%.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            )
        },
        {
            title: "Better Sleep",
            desc: "Fall asleep faster and enjoy higher quality rest.",
            research: "Research: Meditation improves sleep quality by addressing racing thoughts.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            )
        },
        {
            title: "Emotional Balance",
            desc: "Develop better emotional regulation and resilience.",
            research: "Research: Practitioners report 80% better emotional regulation.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
            )
        },
        {
            title: "Increased Energy",
            desc: "Feel more energized and focused throughout the day.",
            research: "Research: Regular meditation increases daily energy levels by 30%.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2" /><line x1="22" y1="11" x2="22" y2="13" /></svg>
            )
        },
        {
            title: "Enhanced Creativity",
            desc: "Boost creative thinking and problem-solving abilities.",
            research: "Research: Meditation increases creative problem-solving by 40%.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            )
        }
    ]

    const documentIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    )

    const scientificStudies = [
        {
            title: "Effects of Mindfulness on Psychological Health",
            authors: "Keng, S. L., Smoski, M. J., & Robins, C. J.",
            journal: "Clinical Psychology Review, 2011",
            findings: "Mindfulness promotes psychological well-being across various domains."
        },
        {
            title: "Meditation Programs for Psychological Stress and Well-being",
            authors: "Goyal, M., et al.",
            journal: "JAMA Internal Medicine, 2014",
            findings: "Meditation programs can reduce anxiety, depression, and pain."
        },
        {
            title: "The Effect of Mindfulness Meditation on Sleep Quality",
            authors: "Black, D. S., O'Reilly, G. A., Olmstead, R., Breen, E. C., & Irwin, M. R.",
            journal: "JAMA Internal Medicine, 2015",
            findings: "Mindfulness meditation improves sleep quality in older adults."
        }
    ]

    return (
        <div className="flex min-h-screen flex-col bg-[#fafafa]">
            <Navbar />

            <main className="flex-1 pb-24">
                <section className="pt-16 pb-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Benefits of <span className="text-primary">ZenithMind-AI</span>
                        </h1>
                        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            Discover the scientifically proven benefits of regular meditation practice and how it can<br />transform your life.
                        </p>
                    </div>
                </section>

                <section className="pb-16">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {mainBenefits.map((benefit) => (
                                <div key={benefit.title} className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-left flex flex-col hover:border-indigo-100 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50/80 flex items-center justify-center text-indigo-500 mb-5">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">{benefit.title}</h3>
                                    <p className="text-sm md:text-base text-slate-600 mb-5 leading-relaxed flex-1">
                                        {benefit.desc}
                                    </p>
                                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                                        {benefit.research}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="container mx-auto max-w-5xl px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-left">Scientific Research</h2>

                        <div className="space-y-4">
                            {scientificStudies.map((study) => (
                                <div key={study.title} className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex gap-5 items-start hover:border-indigo-100 transition-colors">
                                    <div className="mt-1">
                                        {documentIcon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{study.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4">
                                            {study.authors}<br />
                                            <span className="text-slate-400">{study.journal}</span>
                                        </p>
                                        <p className="text-sm md:text-base text-slate-800">
                                            <span className="font-bold">Key Finding:</span> {study.findings}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    )
}
