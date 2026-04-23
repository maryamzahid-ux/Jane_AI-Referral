import React from 'react';
import type { Referral, PlacementType } from '../data/mockData';
import { formatDate, cn } from '../lib/utils';
import { ArrowRight, User as UserIcon, Building2, MapPin, SearchX, FileText, Zap } from 'lucide-react';

interface ReferralTableProps {
  referrals: Referral[];
  onSelect: (referral: Referral) => void;
}

const getUrgencyStyles = (urgency: string) => {
  switch (urgency) {
    case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
    case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
    case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    default: return 'text-slate-600 bg-slate-50 border-slate-100';
  }
};

const getPlacementStyles = (placement: PlacementType) => {
  switch (placement) {
    case 'Residential': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    case 'Supported Living': return 'text-sky-600 bg-sky-50 border-sky-100';
    case 'Community-Based': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    default: return 'text-slate-600 bg-slate-50 border-slate-100';
  }
};

export const ReferralTable: React.FC<ReferralTableProps> = ({ referrals, onSelect }) => {
  return (
    <div className="w-full bg-white rounded-[1.25rem] border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Patient Info</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Urgency & Doc</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Suggested Placement</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Source</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Updated</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {referrals.map((referral) => (
              <tr 
                key={referral.id} 
                className="hover:bg-slate-50/50 transition-all cursor-pointer group relative"
                onClick={() => onSelect(referral)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm group-hover:shadow-md transition-all duration-300">
                      <img 
                        src={referral.patient_avatar} 
                        alt={referral.patient_name}
                        className="w-full h-full object-crop"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(referral.patient_name)}&background=random`;
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 leading-none mb-1.5 group-hover:text-primary transition-colors">{referral.patient_name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <UserIcon className="w-3 h-3" /> {referral.date_of_birth}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    <div className={cn(
                      "inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border uppercase tracking-tight",
                      getUrgencyStyles(referral.urgency_level)
                    )}>
                      <Zap className="w-2.5 h-2.5" />
                      {referral.urgency_level}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      <FileText className="w-2.5 h-2.5" />
                      {referral.document_type}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm",
                    getPlacementStyles(referral.suggested_placement)
                  )}>
                    <MapPin className="w-3.5 h-3.5" />
                    {referral.suggested_placement}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {referral.referral_source}
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col text-[10px] font-bold">
                      <span className="text-slate-700">{formatDate(referral.lastUpdated).split(' at ')[0]}</span>
                      <span className="text-slate-400">{formatDate(referral.lastUpdated).split(' at ')[1]}</span>
                    </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end">
                    <div className="px-4 py-2 text-primary bg-primary/5 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 border border-primary/10 shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Review Detail</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {referrals.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
             <SearchX className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No referrals found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};
