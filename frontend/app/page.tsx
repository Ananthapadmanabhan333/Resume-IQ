"use client";
import React, { useState } from "react";
import axios from "axios";
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Briefcase, Mail, Phone, User, ShieldAlert, MessageCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDesc, setJobDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!file || !jobDesc) {
            setError("Please provide both a resume and a job description.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("job_description", jobDesc);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const resp = await axios.post(`${apiUrl}/api/v1/analyze`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResults(resp.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "An error occurred during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-6 lg:p-16 flex flex-col items-center relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-7xl relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold tracking-wide mb-6 shadow-sm">
                        Enterprise Grade AI Screening
                    </div>
                    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 mb-6 drop-shadow-sm">
                        ResumeIQ Platform
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Upload a candidate's resume and job description. Our system runs NLP embeddings, fraud checks, and deep skill analysis to rank fitness perfectly.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!results ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl mx-auto glass-panel rounded-3xl p-10 flex flex-col gap-8 shadow-2xl relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-3xl pointer-events-none border border-white/5" />

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-center gap-3">
                                    <AlertCircle size={24} className="text-red-400" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <FileText size={16} className="text-indigo-400" />
                                        1. Candidate Resume
                                    </label>
                                    <label className="flex-1 border-2 border-dashed border-slate-600/50 hover:border-indigo-400/50 bg-slate-800/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group hover:bg-slate-800/40 relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf,.docx,.txt"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center mb-4 transition-colors">
                                            <Upload size={28} className="text-indigo-400" />
                                        </div>
                                        {file ? (
                                            <span className="text-indigo-300 font-medium text-lg truncate w-full px-4">{file.name}</span>
                                        ) : (
                                            <>
                                                <span className="text-slate-300 font-medium text-lg">Click to upload or drag & drop</span>
                                                <span className="text-slate-500 text-sm mt-2">PDF, DOCX, or TXT up to 5MB</span>
                                            </>
                                        )}
                                    </label>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Briefcase size={16} className="text-emerald-400" />
                                        2. Job Description
                                    </label>
                                    <textarea
                                        className="flex-1 bg-slate-800/30 border border-slate-600/50 rounded-2xl p-5 text-slate-200 focus:outline-none focus:border-emerald-400/50 transition-all resize-none shadow-inner"
                                        placeholder="Paste the target job description here..."
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze} disabled={loading}
                                className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Executing Analysis...
                                    </span>
                                ) : (
                                    <>
                                        Run Deep Analysis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full grid grid-cols-1 xl:grid-cols-4 gap-8 pb-32"
                        >
                            {/* Left Column - Applicant Overview & Score */}
                            <div className="xl:col-span-1 flex flex-col gap-6">

                                {/* Score Card */}
                                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />

                                    <h2 className="text-xl font-bold text-slate-200 mb-6 z-10">Overall Fit Score</h2>
                                    <div className="relative w-48 h-48 flex items-center justify-center z-10 mb-2">
                                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                            <circle cx="96" cy="96" r="88" strokeWidth="12" className="text-slate-800/80 stroke-current" fill="none" />
                                            <circle
                                                cx="96" cy="96" r="88" strokeWidth="12" fill="none" strokeLinecap="round"
                                                strokeDasharray="552.9" strokeDashoffset={552.9 - (552.9 * results.scores.overall_score) / 100}
                                                className={`${results.scores.overall_score > 75 ? 'text-emerald-400' : results.scores.overall_score > 50 ? 'text-yellow-400' : 'text-red-400'} stroke-current drop-shadow-[0_0_10px_currentColor] transition-all duration-[1.5s] ease-out`}
                                            />
                                        </svg>
                                        <span className="text-6xl font-black text-white">{Math.round(results.scores.overall_score)}</span>
                                    </div>

                                    <div className="flex flex-col w-full gap-3 mt-4 z-10">
                                        <div className="flex justify-between items-center text-sm p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                            <span className="text-slate-400">Skill Match</span>
                                            <span className="font-bold text-indigo-400">{results.scores.skill_match_percentage}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                            <span className="text-slate-400">Semantic Match</span>
                                            <span className="font-bold text-indigo-400">{results.scores.similarity_score}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                                            <span className="text-slate-400">ATS Structure</span>
                                            <span className="font-bold text-indigo-400">{results.scores.ats_compatibility_score}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Candidate Info */}
                                <div className="glass-panel p-6 rounded-3xl">
                                    <h3 className="font-bold text-slate-200 mb-4 px-2 uppercase text-sm tracking-wider">Extracted Details</h3>
                                    <div className="space-y-4 px-2">
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <User size={18} className="text-slate-500" />
                                            <span className="font-medium truncate">{results.candidate_info.name || "Name not found"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <Mail size={18} className="text-slate-500" />
                                            <span className="text-sm truncate">{results.candidate_info.email || "Email not found"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <Phone size={18} className="text-slate-500" />
                                            <span className="text-sm">{results.candidate_info.phone || "Phone not found"}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setResults(null)}
                                        className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-600/50 shadow-sm"
                                    >
                                        Scan Another Candidate
                                    </button>
                                </div>

                            </div>

                            {/* Middle & Right Columns - Deep Analysis */}
                            <div className="xl:col-span-3 flex flex-col gap-6">

                                {/* High Level Indicators Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Interview Prob */}
                                    <div className="glass-panel rounded-3xl p-6 flex flex-col justify-center border-l-4 border-emerald-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                                Pass Probability
                                            </h3>
                                            <div className="text-2xl font-black text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-lg">
                                                {results.ai_analysis.Interview_Probability || "N/A"}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">LLM estimated candidate success rate during technical screen.</p>
                                    </div>

                                    {/* Fraud Detection */}
                                    {results.fraud_analysis && (
                                        <div className={`glass-panel rounded-3xl p-6 flex flex-col justify-center border-l-4 ${results.fraud_analysis.is_suspicious ? 'border-red-500 bg-red-500/5' : 'border-emerald-500'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className={`${results.fraud_analysis.is_suspicious ? 'text-red-400' : 'text-emerald-400'} font-bold text-sm uppercase tracking-wider flex items-center gap-2`}>
                                                    <ShieldAlert size={18} /> Authenticity Check
                                                </h3>
                                                <span className="text-lg font-bold text-slate-200 px-3 py-1 bg-slate-800 rounded-lg">
                                                    {results.fraud_analysis.is_suspicious ? <span className="text-red-400">FLAGGED</span> : <span className="text-emerald-400">CLEAR</span>}
                                                </span>
                                            </div>
                                            {results.fraud_analysis.warnings?.length > 0 ? (
                                                <p className="text-xs text-red-300 mt-1 line-clamp-2">{results.fraud_analysis.warnings[0]}</p>
                                            ) : (
                                                <p className="text-xs text-slate-400 mt-1">No exaggerated metrics detected in wording.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Skills Section */}
                                <div className="glass-panel p-8 rounded-3xl">
                                    <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-3">
                                        <CheckCircle className="text-indigo-400" /> Skill Matrix (Compared to DB)
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">Matched Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {results.skills.detected?.length > 0 ? results.skills.detected.map((s: string) => (
                                                    <span key={s} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg text-sm font-medium">
                                                        {s}
                                                    </span>
                                                )) : <span className="text-slate-500 text-sm italic">No specific hard skills mapped.</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wider">Missing Required Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {results.skills.missing?.map((s: string) => (
                                                    <span key={s} className="px-3 py-1.5 bg-red-500/10 text-red-300 border border-red-500/30 rounded-lg text-sm font-medium">
                                                        {s}
                                                    </span>
                                                ))}
                                                {results.skills.missing?.length === 0 && <span className="text-emerald-500 text-sm font-medium">Candidate has all required skills!</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Text Analysis */}
                                <div className="glass-panel p-8 rounded-3xl grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-4 text-lg">
                                            <TrendingUp size={20} /> Key Strengths
                                        </h3>
                                        <ul className="space-y-3">
                                            {results.ai_analysis.Strengths?.map((s: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-sm text-slate-300 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 leading-relaxed">
                                                    <span className="text-emerald-500 mt-0.5 font-bold">✓</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-red-400 font-bold flex items-center gap-2 mb-4 text-lg">
                                            <AlertCircle size={20} /> Weaknesses
                                        </h3>
                                        <ul className="space-y-3">
                                            {results.ai_analysis.Weaknesses?.map((w: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-sm text-slate-300 bg-red-500/5 p-4 rounded-xl border border-red-500/10 leading-relaxed">
                                                    <span className="text-red-500 mt-0.5 font-bold">✕</span> {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Interview Generator & Suggestions */}
                                <div className="glass-panel p-8 rounded-3xl grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-indigo-400 font-bold flex items-center gap-2 mb-4 text-lg">
                                            <MessageCircle size={20} /> AI Generated Interview Questions
                                        </h3>
                                        <p className="text-xs text-slate-400 mb-4">Tailored specifically to probe the candidate's reported experience against the job reqs.</p>
                                        <ul className="space-y-3">
                                            {results.ai_analysis.Interview_Questions?.map((q: string, i: number) => (
                                                <li key={i} className="text-sm text-indigo-200 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 font-medium">
                                                    {q}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-4 text-lg">
                                            <Briefcase size={20} /> Suggestions & Next Steps
                                        </h3>
                                        <p className="text-xs text-slate-400 mb-4">Feedback to provide if rejecting, or areas to clarify if advancing.</p>
                                        <ul className="space-y-3">
                                            {results.ai_analysis.Suggestions?.map((s: string, i: number) => (
                                                <li key={i} className="flex gap-3 text-sm text-slate-300 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                                                    <div className="bg-blue-500/20 text-blue-400 rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0 text-xs mt-0.5">
                                                        {i + 1}
                                                    </div>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}
