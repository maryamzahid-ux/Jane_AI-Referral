import React, { useState, useRef } from 'react';
import { Card, Button } from './ui';
import { Upload, FileText, CheckCircle2, Loader2, Brain, Shield, Info, ArrowRight, History, List, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromFile, analyzeReferralText, type AnalysisResult } from '../lib/analysis';

interface UploadSectionProps {
  onUploadComplete: (result: AnalysisResult) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    await startUploadFlow(selectedFile);
  };

  const startUploadFlow = async (selectedFile: File) => {
    try {
      setState('uploading');
      
      // Stage 1: Extraction
      const extractedText = await extractTextFromFile(selectedFile);
      
      setState('processing');
      // Artificial delay for UI/UX feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stage 2: AI Analysis
      const analysisResult = analyzeReferralText(extractedText, selectedFile.name);
      
      setState('completed');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUploadComplete(analysisResult);
      setFile(null);
      setState('idle');
    } catch (err) {
      console.error(err);
      setError("Failed to process document. Please ensure it is a valid PDF, DOCX, or Image.");
      setState('error');
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/10 text-[10px] font-bold uppercase tracking-widest mb-6">
          <Shield className="w-3 h-3" />
          HIPAA-Ready Intake
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-4 leading-tight">
          Ingest Referral Documents
        </h1>
        <p className="text-slate-500 text-center max-w-xl text-lg font-medium leading-relaxed">
          Securely upload patient referral packets for dynamic clinical summarization and risk analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className={cn(
            "relative overflow-hidden transition-all duration-500 border-2 border-dashed p-12 flex flex-col items-center justify-center min-h-[520px] bg-white rounded-[2.5rem]",
            isDragging ? "border-primary bg-primary/[0.02] scale-[1.01] shadow-2xl shadow-primary/10" : "border-slate-200 shadow-soft",
            (state !== 'idle' && state !== 'error') && "border-solid shadow-xl"
          )}>
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center w-full cursor-pointer"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFileSelection(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-10 group-hover:bg-primary/5 transition-all duration-500 shadow-inner">
                    <Upload className="w-10 h-10 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">Drop clinical files here</h3>
                  <p className="text-slate-400 mb-10 max-w-sm text-center font-medium">
                    Support for PDF, DOCX, and high-res images. Every document is analyzed independently.
                  </p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                  />
                  <Button 
                    className="h-14 px-10 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 font-bold flex gap-3"
                  >
                    Select Documents
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <div className="mt-12 flex gap-8">
                    {['PDF', 'DOCX', 'JPEG', 'PNG'].map(type => (
                      <span key={type} className="text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-primary/30 transition-colors cursor-default">
                        {type}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {state === 'error' && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Extraction Failed</h3>
                  <p className="text-slate-500 text-center mb-8 max-w-xs">{error}</p>
                  <Button onClick={() => setState('idle')} variant="outline" className="rounded-xl border-slate-200">
                    Try Another File
                  </Button>
                </motion.div>
              )}

              {(state === 'uploading' || state === 'processing') && (
                <motion.div 
                  key="active"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center w-full max-w-sm"
                >
                  <div className="w-32 h-32 relative mb-12">
                    <div className="absolute inset-0 rounded-[2.5rem] bg-primary/5 animate-ping opacity-20"></div>
                    {state === 'uploading' ? (
                      <div className="w-full h-full rounded-[2.5rem] bg-white border shadow-card flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-[2.5rem] bg-white border shadow-card flex items-center justify-center">
                        <Brain className="w-12 h-12 text-primary animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight text-center leading-tight">
                    {state === 'uploading' ? 'Extracting Text' : 'AI Analysis'}
                  </h3>
                  <p className="text-slate-500 mb-10 text-center font-medium leading-relaxed px-4">
                    {state === 'uploading' 
                      ? `Running OCR and text extraction on ${file?.name}...`
                      : "Identifying medical, behavioral, and urgency patterns..."}
                  </p>

                  <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border p-0.5">
                    <motion.div 
                      className="bg-primary h-full rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{ width: state === 'uploading' ? "40%" : "95%" }}
                      transition={{ duration: 3 }}
                    />
                  </div>

                  <div className="mt-8 flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">
                      {file?.name}
                    </span>
                  </div>
                </motion.div>
              )}

              {state === 'completed' && (
                <motion.div 
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-2xl shadow-emerald-200">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Sync Complete</h3>
                  <p className="text-slate-500 mb-6 font-medium">Insights generated from document content.</p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-bold uppercase tracking-widest">
                    Dynamic Output Ready
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-8 bg-white border-none shadow-soft rounded-[2rem] h-full flex flex-col">
            <h4 className="text-lg font-extrabold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Dynamic Protocol
            </h4>
            <div className="space-y-8 flex-1">
              {[
                { title: 'Per-File Analysis', desc: 'No templates. Every upload triggers a fresh clinical scan.', icon: Shield, color: 'text-emerald-500 bg-emerald-50' },
                { title: 'OCR & Extraction', desc: 'Automated text recovery from PDFs, Docs, and Scans.', icon: Brain, color: 'text-sky-500 bg-sky-50' },
                { title: 'Urgency Engine', desc: 'Prioritizes placement based on discharge and safety keywords.', icon: List, color: 'text-indigo-500 bg-indigo-50' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-current opacity-20", item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block mb-1">{item.title}</span>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
