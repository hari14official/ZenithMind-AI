'use client'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { API_BASE_URL } from '@/lib/api-config'

export default function AdminDashboardPage() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/reports/admin/all`)
            if (!res.ok) throw new Error('Failed to fetch user activity data')
            const data = await res.json()
            setReports(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const downloadPDF = async (reportId, userEmail, userName) => {
        try {
            const params = new URLSearchParams()
            if (userEmail) params.append('email', userEmail)
            if (userName) params.append('name', userName)

            const urlWithParams = `${API_BASE_URL}/api/v1/reports/${reportId}/pdf?${params.toString()}`

            const response = await fetch(urlWithParams)
            if (!response.ok) throw new Error('Failed to download PDF')
            
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `stress_report_${reportId}_${new Date().toISOString().split('T')[0]}.pdf`
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(url)
            a.remove()
        } catch (error) {
            console.error('Error downloading PDF:', error)
            alert('Failed to download PDF')
        }
    }

    const getStressBadge = (level) => {
        if (level === 'Low') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        if (level === 'Medium') return 'bg-amber-100 text-amber-700 border-amber-200'
        return 'bg-red-100 text-red-700 border-red-200'
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-500/30">
                        🛡️ Administration
                    </div>
                    <h2 className="text-3xl font-extrabold text-white">Admin Dashboard</h2>
                    <p className="text-slate-400 mt-1">Monitor all user activities and stress reports.</p>
                </div>

                <Card variant="neo" className="overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/10">
                        <CardTitle className="text-lg font-bold text-slate-200">User Activity & Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="relative w-12 h-12">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse" />
                                    <div className="absolute inset-1.5 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            </div>
                        ) : error ? (
                            <div className="p-6 text-center text-red-400 font-medium">
                                Error: {error}
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                No user stress reports found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider text-left border-b border-white/10">
                                        <tr>
                                            <th className="p-4">User</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Stress Score</th>
                                            <th className="p-4">Trend</th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {reports.map((report) => (
                                            <tr key={report.id} className="hover:bg-white/5 transition-colors text-slate-300 group">
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{report.user_name || 'Anonymous'}</div>
                                                    <div className="text-xs text-slate-500">{report.user_email}</div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">
                                                    {new Date(report.created_at).toLocaleString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold border inline-block w-fit ${getStressBadge(report.stress_level)}`}>
                                                            {Number(report.overall_stress || 0).toFixed(0)} - {report.stress_level}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm font-medium">
                                                    <span className={
                                                        report.stress_trend === 'Increasing' ? 'text-red-400' :
                                                        report.stress_trend === 'Decreasing' ? 'text-emerald-400' :
                                                        'text-slate-400'
                                                    }>
                                                        {report.stress_trend === 'Increasing' && '📈 Rising'}
                                                        {report.stress_trend === 'Decreasing' && '📉 Falling'}
                                                        {report.stress_trend !== 'Increasing' && report.stress_trend !== 'Decreasing' && '➡️ Stable'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => downloadPDF(report.id, report.user_email, report.user_name)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg opacity-80 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Download PDF
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
