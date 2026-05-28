import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Truck,
  Wallet,
  FileSpreadsheet,
  Users,
  Megaphone,
  UserCheck,
  Factory,
  Cpu,
  KanbanSquare,
  Wrench,
  Code2,
  Lock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  ShieldAlert,
  Search,
  Star,
  ChevronDown,
  Bell,
  Sparkles,
  GripVertical,
  Coins,
  TrendingUp
} from 'lucide-react';
import { UserRole } from '../types';

export interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  role: UserRole;
  userName: string;
  onLogout: () => void;
}

interface ModuleMenuItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: UserRole[];
  color: string;
  category: 'Executivo & Estratégia' | 'Finanças & Fiscal' | 'Crescimento' | 'Operações & PCP' | 'Gestão & TI';
  badge?: string;
  badgeCls?: string;
}

export default function Sidebar({
  activeModule,
  setActiveModule,
  collapsed,
  setCollapsed,
  role,
  userName,
  onLogout
}: SidebarProps) {
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [favoriteModules, setFavoriteModules] = useState<string[]>(['dashboard', 'financeiro', 'faturamento']);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Executivo & Estratégia': true,
    'Finanças & Fiscal': true,
    'Crescimento': true,
    'Operações & PCP': true,
    'Gestão & TI': true
  });

  const menuItems: ModuleMenuItem[] = [
    {
      id: 'dashboard',
      label: 'BI Executive Master',
      icon: LayoutDashboard,
      allowedRoles: ['Super Admin', 'Diretoria', 'Financeiro', 'RH', 'Comercial', 'Marketing', 'Logística', 'Industrial', 'Produção', 'TI', 'Desenvolvimento', 'Projetos', 'Usuário Comum'],
      color: 'text-sky-400',
      category: 'Executivo & Estratégia',
      badge: 'BI Ativo',
      badgeCls: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      id: 'diretoria',
      label: 'Diretoria & Riscos S/A',
      icon: Lock,
      allowedRoles: ['Super Admin', 'Diretoria'],
      color: 'text-rose-450',
      category: 'Executivo & Estratégia',
      badge: 'Certificado',
      badgeCls: 'bg-rose-500/10 text-rose-400'
    },
    {
      id: 'financeiro',
      label: 'Contabilidade & Caixa',
      icon: Wallet,
      allowedRoles: ['Super Admin', 'Diretoria', 'Financeiro'],
      color: 'text-emerald-450',
      category: 'Finanças & Fiscal',
      badge: '98.8%',
      badgeCls: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'invest_ai',
      label: 'TITANX INVEST AI',
      icon: Coins,
      allowedRoles: ['Super Admin', 'Diretoria', 'Financeiro', 'RH', 'Comercial', 'Marketing', 'Logística', 'Industrial', 'Produção', 'TI', 'Desenvolvimento', 'Projetos', 'Usuário Comum'],
      color: 'text-cyan-400',
      category: 'Finanças & Fiscal',
      badge: 'PRO AI',
      badgeCls: 'bg-cyan-500/20 text-cyan-300 animate-pulse border border-cyan-500/30 font-black'
    },
    {
      id: 'faturamento',
      label: 'Sefaz Faturamento NF-e',
      icon: FileSpreadsheet,
      allowedRoles: ['Super Admin', 'Diretoria', 'Financeiro'],
      color: 'text-purple-400',
      category: 'Finanças & Fiscal',
      badge: 'Ativo',
      badgeCls: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'comercial',
      label: 'Comercial & Pipelines',
      icon: Users,
      allowedRoles: ['Super Admin', 'Diretoria', 'Comercial'],
      color: 'text-pink-400',
      category: 'Crescimento',
      badge: '24 Leads',
      badgeCls: 'bg-pink-500/10 text-pink-400'
    },
    {
      id: 'marketing',
      label: 'Marketing & ROI Funnels',
      icon: Megaphone,
      allowedRoles: ['Super Admin', 'Diretoria', 'Marketing', 'Comercial'],
      color: 'text-orange-400',
      category: 'Crescimento'
    },
    {
      id: 'logistica',
      label: 'Logística & Frotas',
      icon: Truck,
      allowedRoles: ['Super Admin', 'Diretoria', 'Logística'],
      color: 'text-amber-450',
      category: 'Operações & PCP'
    },
    {
      id: 'industrial',
      label: 'Metalurgia PCP',
      icon: Factory,
      allowedRoles: ['Super Admin', 'Diretoria', 'Industrial'],
      color: 'text-cyan-400',
      category: 'Operações & PCP',
      badge: 'PCP',
      badgeCls: 'bg-cyan-500/10 text-cyan-400'
    },
    {
      id: 'producao',
      label: 'Plantas Realtime IoT',
      icon: Cpu,
      allowedRoles: ['Super Admin', 'Diretoria', 'Produção', 'Industrial'],
      color: 'text-indigo-400',
      category: 'Operações & PCP',
      badge: 'Online',
      badgeCls: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'projetos',
      label: 'Kanban & Squads',
      icon: KanbanSquare,
      allowedRoles: ['Super Admin', 'Diretoria', 'Projetos', 'TI', 'Desenvolvimento', 'Financeiro', 'RH'],
      color: 'text-lime-400',
      category: 'Operações & PCP'
    },
    {
      id: 'rh',
      label: 'Recursos Humanos',
      icon: UserCheck,
      allowedRoles: ['Super Admin', 'Diretoria', 'RH'],
      color: 'text-teal-450',
      category: 'Gestão & TI'
    },
    {
      id: 'ti',
      label: 'Central Service Desk',
      icon: Wrench,
      allowedRoles: ['Super Admin', 'TI'],
      color: 'text-violet-400',
      category: 'Gestão & TI',
      badge: '4 aberto',
      badgeCls: 'bg-violet-500/25 text-violet-300 font-mono'
    },
    {
      id: 'desenvolvimento',
      label: 'Release Hub & DevOps',
      icon: Code2,
      allowedRoles: ['Super Admin', 'Desenvolvimento', 'TI'],
      color: 'text-fuchsia-400',
      category: 'Gestão & TI'
    },
    {
      id: 'usuarios',
      label: 'Central de Usuários',
      icon: UserCheck,
      allowedRoles: ['Super Admin', 'Diretoria'],
      color: 'text-[#00E5FF]',
      category: 'Gestão & TI',
      badge: 'PRO ACCESS',
      badgeCls: 'bg-[#00E5FF]/20 text-[#00E5FF] font-extrabold border border-[#00E5FF]/20'
    }
  ];

  const allowedMenuItems = menuItems.filter(
    (item) => item.allowedRoles.includes(role) || role === 'Super Admin'
  );

  const searchedMenuItems = allowedMenuItems.filter((item) =>
    item.label.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteModules(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Grouped Menu List
  const groupedItems = searchedMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ModuleMenuItem[]>);

  return (
    <aside
      id="titanx-sidebar"
      className={`relative flex flex-col bg-[#030712] border-r border-[#00E5FF]/15 text-slate-100 transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-72'
      } h-screen shadow-[5px_0_30px_rgba(3,7,18,0.95)] z-20`}
    >
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-[#00E5FF]/20 to-transparent pointer-events-none" />

      
      {/* BRAND HEADER BANNER */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#00E5FF] via-indigo-650 to-purple-600 shadow-md shadow-[#00E5FF]/20 relative overflow-hidden group">
            <span className="font-mono font-black text-white text-xs tracking-wider z-10">TX</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest bg-gradient-to-r from-white via-slate-205 to-[#00E5FF] bg-clip-text text-transparent">TITANX S/A</span>
              <span className="text-[8px] font-mono tracking-widest text-[#00E5FF] font-bold">ENTERPRISE SYSTEM</span>
            </div>
          )}
        </div>
        <button
          id="toggle-sidebar"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 text-[#00E5FF] transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* INTERNAL SEARCH FILTER SECTION */}
      {!collapsed && (
        <div className="p-3 border-b border-slate-800 bg-slate-950/20">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
            <input
              type="text"
              placeholder="Pesquisar módulo..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 focus:border-[#00E5FF]/50 p-1.5 pl-7 rounded-lg text-[10px] focus:outline-none text-slate-350"
            />
          </div>
        </div>
      )}

      {/* CHANNELS CONTAINER */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        
        {/* FAVORITES CAROUSEL */}
        {!collapsed && favoriteModules.length > 0 && (
          <div className="px-4 mb-4">
            <span className="text-[9px] font-mono font-black text-amber-500 uppercase flex items-center gap-1 mb-1.5">
              <Star size={10} fill="currentColor" /> Favoritos S/A
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {allowedMenuItems
                .filter(item => favoriteModules.includes(item.id))
                .slice(0, 4)
                .map(item => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      className={`p-2 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer truncate ${
                        isActive
                          ? 'border-[#00E5FF]/40 bg-slate-950/40 text-[#00E5FF]'
                          : 'border-slate-850 bg-slate-950/10 text-slate-400 hover:text-white hover:border-slate-800'
                      }`}
                    >
                      <Icon size={14} className={item.color} />
                      <span className="text-[10px] font-bold mt-1.5 truncate leading-none">{item.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* GROUPED ACCORDION MENU ITEMS */}
        {Object.entries(groupedItems).map(([category, items]) => {
          const isCategoryExpanded = expandedCategories[category];
          return (
            <div key={category} className="mb-2">
              {/* Category banner */}
              {!collapsed && (
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 py-1 flex items-center justify-between text-[9px] font-mono font-black uppercase text-slate-500 tracking-wider hover:text-slate-300"
                >
                  <span>{category}</span>
                  <ChevronDown size={10} className={`transform transition-transform ${isCategoryExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* Items listing with sub-menus animation */}
              {isCategoryExpanded && (
                <div className="space-y-0.5 mt-1 px-2.5">
                  {items.map((item) => {
                    const isActive = activeModule === item.id;
                    const isFav = favoriteModules.includes(item.id);
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className={`w-full flex items-center justify-between rounded-xl py-2 px-3 transition-all cursor-pointer relative overflow-hidden group ${
                          isActive
                            ? 'bg-gradient-to-r from-[#00E5FF]/15 via-indigo-950/20 to-transparent border border-[#00E5FF]/25 text-white font-bold glow-cyan/10'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent hover:border-slate-800/50'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <Icon size={16} className={`shrink-0 ${isActive ? item.color : 'text-slate-400 group-hover:scale-105 transition-transform'}`} />
                          {!collapsed && (
                            <span className="text-[11px] font-semibold truncate tracking-wide">{item.label}</span>
                          )}
                        </div>

                        {/* Badges and Favorite triggers */}
                        {!collapsed && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {item.badge && (
                              <span className={`p-0.5 px-1.5 rounded-full text-[8.5px] font-mono font-bold leading-none ${item.badgeCls}`}>
                                {item.badge}
                              </span>
                            )}
                            <button
                              onClick={(e) => toggleFavorite(item.id, e)}
                              className="opacity-0 group-hover:opacity-105 p-0.5 text-slate-500 hover:text-amber-400 transition-all cursor-pointer"
                              title="Marcar Favorito"
                            >
                              <Star size={10} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-amber-400" : ""} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* COMPACT GENERAL SECURITY NOTIFY CARD */}
      {!collapsed && (
        <div className="p-3 mx-3 my-2 rounded-xl bg-slate-950/35 border border-slate-850">
          <div className="flex items-start gap-2">
            <ShieldAlert size={13} className="text-[#00E5FF] shrink-0 mt-0.5" />
            <div className="flex flex-col text-[9px] leading-tight">
              <span className="font-extrabold text-[#00E5FF]">Criptografia TitanX v3</span>
              <span className="text-slate-500">Privacidade LGPD de conformidade monitorada.</span>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className={`flex items-center gap-2.5 rounded-xl bg-slate-950 p-2 border border-slate-850 ${collapsed ? 'justify-center' : ''}`}>
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-sky-505 via-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow">
            {role.substring(0, 2).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="truncate text-[10px] font-bold text-white">{userName}</span>
              <span className="text-[8.5px] truncate font-mono text-[#00E5FF] font-bold">{role}</span>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[10px] font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-950/15 cursor-pointer transition-all border border-transparent"
        >
          <LogOut size={11} />
          {!collapsed && <span>Destruir Sessão</span>}
        </button>
      </div>

    </aside>
  );
}
