import React from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  ClipboardList, 
  Settings, 
  ShieldCheck, 
  Bell, 
  User,
  Search,
  CheckCircle2,
  ChevronDown,
  Menu,
  HelpCircle,
  LogOut,
  Building2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  searchQuery, 
  onSearchChange,
  onLogout 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Intake Queue', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Referral', icon: FileUp },
    { id: 'referrals', label: 'Care Directory', icon: ClipboardList },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col shrink-0">
        <div className="p-6 pb-4 flex-1">
          <div className="flex items-center gap-3 px-2 mb-10 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-primary">CareBridge</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Operations AI</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 block">Navigation</span>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all group",
                      activeTab === item.id 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-slate-50/50 space-y-3">
          <div className="bg-white p-4 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-slate-900 truncate">Sarah Jenkins</span>
                <span className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tighter">Region 4 Director</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-tighter">
              <CheckCircle2 className="w-3 h-3" />
              HIPAA SECURE
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs font-bold uppercase tracking-wider group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <button className="lg:hidden p-2 text-slate-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search referrals, medical IDs, or sources..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl relative transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border flex items-center justify-center overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=f1f5f9&color=64748b" alt="SJ" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
