import React, { useState } from 'react';
import type { Referral } from '../data/mockData';
import { Card, Button } from './ui';
import { 
  X, 
  AlertCircle, 
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  User as UserIcon,
  MapPin,
  ArrowRight,
  Shield,
  FileSearch,
  Zap,
  ChevronDown,
  ChevronUp,
  Terminal,
  FileText,
  Database,
  Building2,
  ListChecks,
  Quote
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferralDetailsProps {
  referral: Referral | null;
  onClose: () => void;
  onApprove: (id: string) => void;
}

export const ReferralDetails: React.FC<ReferralDetailsProps> = ({ referral, onClose, onApprove }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'source'>('analysis');

  if (!referral) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-6xl bg-slate-50 h-full shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Header / Row 1: Snapshot */}
          <div className="bg-white border-b px-8 py-6 shrink-0 z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <Shield className="w-5 h-5" />
                 </div>
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Referral Intake Decision Support</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Snapshot Info */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  <img src={referral.patient_avatar} alt={referral.patient_name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{referral.patient_name}</h3>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {referral.date_of_birth}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {referral.referral_source}</span>
                  </div>
                </div>
              </div>

              {/* Urgency Badge */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urgency Level</span>
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold border w-fit transition-all duration-500",
                  referral.urgency_level === 'High' ? "text-rose-600 bg-rose-50 border-rose-100 shadow-sm shadow-rose-100" : 
                  referral.urgency_level === 'Medium' ? "text-amber-600 bg-amber-50 border-amber-100" :
                  "text-emerald-600 bg-emerald-50 border-emerald-100"
                )}>
                  <Zap className={cn("w-4 h-4", referral.urgency_level === 'High' ? "animate-pulse" : "")} />
                  {referral.urgency_level} Priority Intake
                </div>
              </div>

              {/* Suggested Placement */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested Care Type</span>
                <div className={cn(
                  "inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-lg font-extrabold border shadow-sm w-fit transition-all duration-500",
                  referral.suggested_placement === 'Residential' ? "bg-indigo-600 text-white border-indigo-500 shadow-indigo-200" :
                  referral.suggested_placement === 'Supported Living' ? "bg-sky-500 text-white border-sky-400 shadow-sky-200" :
                  "bg-emerald-500 text-white border-emerald-400 shadow-emerald-200"
                )}>
                  <MapPin className="w-5 h-5" />
                  {referral.suggested_placement}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 bg-white border-b flex gap-8 shrink-0">
             {[
               { id: 'analysis', label: 'AI Referral Analysis', icon: Database },
               { id: 'source', label: 'Source Documents', icon: FileText }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={cn(
                   "py-4 text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all",
                   activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
                 )}
               >
                 <tab.icon className="w-4 h-4" />
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-8 bg-slate-50/30">
            {activeTab === 'analysis' ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Middle Row: Summary, Needs, Flags */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Summary Card */}
                  <Card className="lg:col-span-6 p-8 border-none shadow-soft bg-white rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-5 h-5 text-primary" />
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intake Summary</h4>
                    </div>
                    <p className="text-xl font-bold text-slate-800 leading-relaxed italic border-l-4 border-primary/20 pl-6 py-1">
                      "{referral.patient_summary}"
                    </p>
                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Extraction Confidence</span>
                          <div className="flex items-center gap-2">
                             <div className="flex gap-1">
                                {[1,2,3].map(i => (
                                   <div key={i} className={cn("w-3 h-1 rounded-full", 
                                      referral.extraction_confidence === 'High' ? 'bg-emerald-500' :
                                      referral.extraction_confidence === 'Medium' && i < 3 ? 'bg-amber-500' :
                                      referral.extraction_confidence === 'Low' && i === 1 ? 'bg-rose-500' : 'bg-slate-200'
                                   )}></div>
                                ))}
                             </div>
                             <span className="text-[10px] font-bold text-slate-600">{referral.extraction_confidence} Match</span>
                          </div>
                       </div>
                    </div>
                  </Card>

                  {/* Needs Card */}
                  <Card className="lg:col-span-3 p-8 border-none shadow-soft bg-white rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                      <ListChecks className="w-5 h-5 text-sky-500" />
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Needs</h4>
                    </div>
                    <div className="space-y-4">
                      {referral.top_needs.map((need, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                          <span className="text-xs font-bold text-slate-700">{need}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Flags Card */}
                  <Card className="lg:col-span-3 p-8 border-none shadow-soft bg-white rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Flags</h4>
                    </div>
                    <div className="space-y-4">
                      {referral.key_flags.map((flag, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
                          <Zap className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-xs font-bold text-rose-700">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Bottom Row: Rationale, Next Step, Evidence */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Rationale Card */}
                  <Card className={cn(
                    "lg:col-span-8 p-10 border-none shadow-2xl rounded-[3rem] overflow-hidden relative transition-all duration-700",
                    referral.urgency_level === 'High' ? "bg-slate-900 text-white" : 
                    referral.urgency_level === 'Medium' ? "bg-white text-slate-900 border border-slate-100" :
                    "bg-emerald-50/30 text-slate-900 border border-emerald-100"
                  )}>
                    <div className="relative z-10 flex flex-col md:flex-row gap-12">
                       <div className="flex-1 space-y-8">
                          <div className={cn(
                            "flex items-center gap-3",
                            referral.urgency_level === 'High' ? "text-primary" : "text-emerald-600"
                          )}>
                            <TrendingUp className="w-6 h-6" />
                            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Operational Rationale</h4>
                          </div>
                          <div className="space-y-5">
                            {referral.placement_rationale.map((line, i) => (
                              <div key={i} className="flex gap-4 group">
                                 <div className={cn(
                                   "mt-1.5 w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors",
                                   referral.urgency_level === 'High' ? "bg-white/10" : "bg-slate-100"
                                 )}>{i+1}</div>
                                 <p className={cn(
                                   "text-lg font-medium leading-relaxed",
                                   referral.urgency_level === 'High' ? "text-slate-300" : "text-slate-600"
                                 )}>{line}</p>
                              </div>
                            ))}
                          </div>
                       </div>
                       
                       <div className="w-full md:w-64 space-y-6 shrink-0">
                          <div className={cn(
                            "rounded-3xl p-6 border transition-all",
                            referral.urgency_level === 'High' ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-sm"
                          )}>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Recommended Next Step</span>
                            <p className={cn(
                              "text-sm font-bold mb-6 leading-relaxed",
                              referral.urgency_level === 'High' ? "text-white" : "text-slate-800"
                            )}>
                              {referral.recommended_next_step}
                            </p>
                            <Button 
                              onClick={() => onApprove(referral.id)}
                              className={cn(
                                "w-full h-12 rounded-xl text-xs font-extrabold shadow-lg transition-all",
                                referral.urgency_level === 'High' ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" : "bg-slate-900 hover:bg-slate-800 text-white"
                              )}
                            >
                              Approve Decision
                            </Button>
                          </div>
                       </div>
                    </div>
                  </Card>

                  {/* Evidence Snippets */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Quote className="w-4 h-4 text-slate-400" />
                        <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Document Evidence</h4>
                      </div>
                      {referral.evidence_snippets.map((snippet, i) => (
                        <Card key={i} className="p-5 bg-white border-none shadow-soft rounded-2xl italic text-xs font-bold text-slate-500 leading-relaxed border-l-2 border-l-primary/30">
                          "...{snippet}..."
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
                 <Card className="p-10 border-none shadow-soft bg-white rounded-3xl min-h-[600px]">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-slate-900">Extracted Document Content</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verifying original referral records</p>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">
                          HIPAA COMPLIANT VIEW
                       </div>
                    </div>
                    <div className="prose prose-slate max-w-none">
                       <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-600 bg-slate-50 p-8 rounded-2xl border">
                          {referral.raw_extracted_text}
                       </div>
                    </div>
                 </Card>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-white border-t px-8 py-6 flex items-center justify-between shrink-0 shadow-2xl z-10">
            <Button variant="outline" onClick={onClose} className="h-11 px-8 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
              Discard Changes
            </Button>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('source')}
                className={cn(
                  "h-11 px-6 rounded-xl font-bold transition-all flex gap-2",
                  activeTab === 'source' ? "bg-slate-100 text-slate-900 border-slate-300" : "border-primary/20 text-primary hover:bg-primary/5"
                )}
              >
                 <FileSearch className="w-4 h-4" />
                 Source Documents
              </Button>
              <Button 
                onClick={onClose}
                className="h-11 px-10 bg-primary text-white rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 font-extrabold transition-all flex gap-3"
              >
                 Return to Queue
                 <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
