import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { ReferralTable } from './components/ReferralTable';
import { ReferralDetails } from './components/ReferralDetails';
import { UploadSection } from './components/UploadSection';
import { MOCK_REFERRALS } from './data/mockData';
import type { Referral } from './data/mockData';
import type { AnalysisResult } from './lib/analysis';
import { Card, Button } from './components/ui';
import { 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Lock,
  ArrowRight,
  Building2,
  X,
  Search,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { cn } from './lib/utils';

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">CareBridge Operations</h1>
          <p className="text-slate-500 font-medium text-center italic">Operations & Referral Decision Support</p>
        </div>

        <Card className="p-10 border-none shadow-2xl bg-white rounded-[2.5rem]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  defaultValue="sarah.jenkins@carebridge.org"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  placeholder="Enter work email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Secure PIN</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  placeholder="Enter secure PIN"
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 font-extrabold transition-all flex gap-3 text-base"
            >
              {loading ? "Verifying Credentials..." : "Authenticate System"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-3 grayscale opacity-50">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FIPS 140-2 Validated Encryption</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

const DashboardStats = ({ referrals }: { referrals: Referral[] }) => {
  const highPriorityCount = referrals.filter(r => r.urgency_level === 'High').length;
  const readyForReviewCount = referrals.filter(r => r.status === 'Ready for Review').length;

  const stats = [
    { label: 'Total Referrals', value: referrals.length.toString(), icon: Users, trend: '+12%', color: 'text-primary bg-primary/10' },
    { label: 'High Priority', value: highPriorityCount.toString(), icon: AlertCircle, trend: 'Action Required', color: 'text-rose-600 bg-rose-50' },
    { label: 'Ready for Review', value: readyForReviewCount.toString(), icon: CheckCircle2, trend: 'Verified', color: 'text-emerald-600 bg-emerald-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
      {stats.map((stat, i) => (
        <Card key={i} className="p-8 relative overflow-hidden border-none shadow-soft bg-white group hover:shadow-lg transition-all duration-300 rounded-[2rem]">
          <div className="flex justify-between items-start mb-6">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-black/5", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold border border-slate-100 uppercase tracking-tighter">
              {stat.trend}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-1.5 tracking-tight">{stat.value}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
      <Inbox className="w-10 h-10" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">No referrals match your filters</h3>
    <p className="text-slate-500 max-w-xs mb-8">Try adjusting your selection or search query to find the records you're looking for.</p>
    <Button onClick={onClear} variant="outline" className="h-11 px-8 rounded-xl font-bold gap-2">
      <RefreshCw className="w-4 h-4" />
      Clear All Filters
    </Button>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFER_REFERRALS);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  
  // Advanced Filter State
  const [filters, setFilters] = useState({
    urgency: 'all',
    status: 'all',
    placement: 'all'
  });

  const clearFilters = () => {
    setFilters({ urgency: 'all', status: 'all', placement: 'all' });
    setSearchQuery('');
  };

  const filteredReferrals = useMemo(() => {
    let result = [...referrals];

    // Apply Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.patient_name.toLowerCase().includes(q) || 
        r.referral_source.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }

    // Apply Urgency
    if (filters.urgency !== 'all') {
      result = result.filter(r => r.urgency_level === filters.urgency);
    }

    // Apply Status
    if (filters.status !== 'all') {
      result = result.filter(r => r.status === filters.status);
    }

    // Apply Placement
    if (filters.placement !== 'all') {
      result = result.filter(r => r.suggested_placement === filters.placement);
    }

    return result;
  }, [referrals, filters, searchQuery]);

  const handleUploadComplete = (result: AnalysisResult) => {
    const newReferral: Referral = {
      ...result,
      id: `REF-${Math.floor(Math.random() * 900) + 100}`,
      status: 'Ready for Review',
      lastUpdated: new Date().toISOString()
    };
    
    setReferrals([newReferral, ...referrals]);
    setActiveTab('dashboard');
    setSelectedReferral(newReferral);
  };

  const handleApprove = (id: string) => {
    setReferrals(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'Approved' as any, lastUpdated: new Date().toISOString() } : r
    ));
    setSelectedReferral(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const isFiltered = searchQuery !== '' || filters.urgency !== 'all' || filters.status !== 'all' || filters.placement !== 'all';

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      searchQuery={searchQuery} 
      onSearchChange={setSearchQuery}
      onLogout={() => setIsAuthenticated(false)}
    >
      <div className="w-full">
        {(activeTab === 'dashboard' || activeTab === 'referrals') && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 px-1">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">CareBridge Operational Portal</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'dashboard' ? 'Referral & Decision Queue' : 'Care Directory'}
                </h1>
              </div>
              <Button 
                onClick={() => setActiveTab('upload')} 
                className="h-12 px-8 bg-primary text-white rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 font-extrabold transition-all flex gap-3"
              >
                <Plus className="w-5 h-5" />
                New Referral Intake
              </Button>
            </div>

            {activeTab === 'dashboard' && <DashboardStats referrals={filteredReferrals} />}

            {/* Advanced Filter Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8 space-y-6">
               <div className="flex flex-col lg:flex-row items-center gap-6">
                  {/* Search Group */}
                  <div className="flex-1 w-full space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search Patient or Source</label>
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                           type="text"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pl-12 pr-10 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                           placeholder="Search by name, ID, or source..."
                        />
                        {searchQuery && (
                           <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                              <X className="w-4 h-4" />
                           </button>
                        )}
                     </div>
                  </div>

                  {/* Filter Group: Urgency */}
                  <div className="w-full lg:w-48 space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Urgency</label>
                     <select 
                        value={filters.urgency}
                        onChange={(e) => setFilters({...filters, urgency: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer font-bold text-slate-700"
                     >
                        <option value="all">All Priorities</option>
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                     </select>
                  </div>

                  {/* Filter Group: Status */}
                  <div className="w-full lg:w-48 space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                     <select 
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer font-bold text-slate-700"
                     >
                        <option value="all">All Statuses</option>
                        <option value="Ready for Review">Ready for Review</option>
                        <option value="Needs Follow-up">Needs Follow-up</option>
                        <option value="Approved">Approved</option>
                        <option value="Reviewed">Reviewed</option>
                     </select>
                  </div>

                  {/* Filter Group: Placement */}
                  <div className="w-full lg:w-56 space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Suggested Placement</label>
                     <select 
                        value={filters.placement}
                        onChange={(e) => setFilters({...filters, placement: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer font-bold text-slate-700"
                     >
                        <option value="all">All Care Types</option>
                        <option value="Residential">Residential</option>
                        <option value="Supported Living">Supported Living</option>
                        <option value="Community-Based">Community-Based</option>
                     </select>
                  </div>
               </div>

               {/* Active Filters Metadata */}
               <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                     <div className="text-[11px] font-bold text-slate-500">
                        Showing <span className="text-primary">{filteredReferrals.length}</span> of <span className="text-slate-900">{referrals.length}</span> referrals
                     </div>
                     {isFiltered && (
                        <div className="h-4 w-[1px] bg-slate-200"></div>
                     )}
                     {isFiltered && (
                        <button 
                          onClick={clearFilters}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                        >
                           <RefreshCw className="w-3.5 h-3.5" />
                           Clear All Filters
                        </button>
                     )}
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <Clock className="w-3.5 h-3.5" />
                     Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
               </div>
            </div>

            {filteredReferrals.length > 0 ? (
              <ReferralTable 
                key={`queue-${JSON.stringify(filters)}-${searchQuery}`}
                referrals={filteredReferrals} 
                onSelect={setSelectedReferral} 
              />
            ) : (
              <EmptyState onClear={clearFilters} />
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out max-w-4xl mx-auto pt-10">
            <UploadSection onUploadComplete={handleUploadComplete} />
          </div>
        )}

        <ReferralDetails 
          referral={selectedReferral} 
          onClose={() => setSelectedReferral(null)} 
          onApprove={handleApprove}
        />
      </div>
    </Layout>
  );
}

// Fixed MOCK_REFERRALS to avoid "not found" error if referenced differently
const MOCK_REFER_REFERRALS = MOCK_REFERRALS;

export default App;
