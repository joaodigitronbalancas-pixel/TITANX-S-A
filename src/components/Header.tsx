import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Building,
  User,
  CheckCircle,
  HelpCircle,
  Menu,
  Moon,
  Sun,
  ShieldCheck,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

export interface HeaderProps {
  searchText: string;
  setSearchText: (text: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeCompany: string;
  setActiveCompany: (company: string) => void;
  sidebarCollapsed: boolean;
  onMenuToggle: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  userEmail: string;
}

export default function Header({
  searchText,
  setSearchText,
  activeRole,
  setActiveRole,
  activeCompany,
  setActiveCompany,
  sidebarCollapsed,
  onMenuToggle,
  darkMode,
  setDarkMode,
  userEmail
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showCompanySelector, setShowCompanySelector] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Emissão de NF-e Autorizada',
      desc: 'NFE-00010942 do cliente Ambev consolidada.',
      time: 'Justamente agora',
      type: 'success'
    },
    {
      id: 2,
      title: 'Estoque Baixo - Alumínio T6',
      desc: 'Quantidade de liga fundida abaixo do nível crítico.',
      time: '15 min atrás',
      type: 'alert'
    },
    {
      id: 3,
      title: 'Aprovação de SLA Solicitada',
      desc: 'Ticket HDP-04910 exige atenção prioritária de TI.',
      time: '1h atrás',
      type: 'info'
    }
  ]);

  const companies = [
    'TitanX Holding S/A',
    'TitanX S/A - Indústria',
    'TitanX Logística Global Ltda',
    'TitanX Agronegócio S/A'
  ];

  const roles: UserRole[] = [
    'Super Admin',
    'Diretoria',
    'Financeiro',
    'RH',
    'Comercial',
    'Marketing',
    'Logística',
    'Industrial',
    'Produção',
    'TI',
    'Desenvolvimento',
    'Projetos',
    'Usuário Comum'
  ];

  return (
    <header className="h-16 shrink-0 bg-[#020512]/90 backdrop-blur-md border-b border-[#00E5FF]/15 px-4 flex items-center justify-between z-10 transition-all select-none relative">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent pointer-events-none" />

      {/* LEFT SECTION: TOGGLE & COMPANAY */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* TENANT COMPANY DROPDOWN SELECTOR */}
        <div className="relative">
          <button
            id="company-selector-btn"
            onClick={() => {
              setShowCompanySelector(!showCompanySelector);
              setShowRoleSelector(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer transition-all"
          >
            <Building size={14} className="text-sky-500 shrink-0" />
            <span className="hidden sm:inline truncate max-w-[150px]">{activeCompany}</span>
            <ChevronDown size={12} className="text-slate-400 shrink-0" />
          </button>
          
          {showCompanySelector && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 shadow-lg py-1.5 z-50 text-xs animate-in fade-in duration-100">
              <div className="px-3 py-1 border-b border-slate-100 dark:border-slate-900 text-[10px] uppercase font-mono text-slate-400 select-none">
                Mudança de Filial / Empresa
              </div>
              {companies.map((co) => (
                <button
                  key={co}
                  onClick={() => {
                    setActiveCompany(co);
                    setShowCompanySelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900/80 cursor-pointer flex items-center justify-between ${
                    activeCompany === co ? 'text-sky-500 bg-sky-50/20 dark:bg-sky-950/20 font-semibold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{co}</span>
                  {activeCompany === co && <CheckCircle size={12} className="text-sky-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DEVELOPER SIMULATOR FOR RBAC */}
        <div className="relative hidden md:block">
          <button
            id="role-simulator-btn"
            onClick={() => {
              setShowRoleSelector(!showRoleSelector);
              setShowCompanySelector(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-950/80 bg-indigo-50/40 dark:bg-indigo-950/15 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/30 cursor-pointer transition-all animate-pulse"
            title="Simulador de Perfil de Acesso (RBAC)"
          >
            <ShieldCheck size={14} className="text-indigo-500" />
            <span>Perfil: {activeRole}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {showRoleSelector && (
            <div className="absolute left-0 mt-2 w-56 max-h-96 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 shadow-lg py-1.5 z-50 text-xs shadow-indigo-500/5">
              <div className="px-3 py-1 border-b border-slate-100 dark:border-slate-900 text-[10px] uppercase font-mono text-slate-400 select-none">
                Simular Permissões de Cargo
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setShowRoleSelector(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900/80 cursor-pointer flex items-center justify-between ${
                    activeRole === r ? 'text-indigo-500 font-semibold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{r}</span>
                  {activeRole === r && <CheckCircle size={12} className="text-indigo-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: SEARCH BAR */}
      <div className="flex-1 max-w-md mx-6 relative hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          id="global-search-input"
          type="text"
          placeholder="Pesquisar registros, notas fiscais, etc..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full text-xs pl-9 pr-14 py-2 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/30 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-inner"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 pointer-events-none text-[8.5px] font-mono bg-slate-200 dark:bg-slate-800/80 text-slate-505 dark:text-slate-400 p-1 px-1.5 rounded-md border border-slate-300 dark:border-slate-750 font-bold select-none leading-none">
          <span>Ctrl</span>
          <span>+</span>
          <span>K</span>
        </div>
      </div>

      {/* RIGHT SECTION: CONFIG & UTILS */}
      <div className="flex items-center gap-3">
        {/* THEME TOGGLE */}
        <button
          id="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Alternar Tema"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* NOTIFICATIONS CONTAINER */}
        <div className="relative">
          <button
            id="notifications-toggle"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSelector(false);
              setShowCompanySelector(false);
            }}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#00E5FF] shadow-glow"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 shadow-xl py-1.5 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between font-semibold">
                <span className="text-slate-850 dark:text-slate-200">Notificações Recentes</span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-[10px] text-sky-500 hover:underline"
                >
                  Limpar tudo
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">
                  Sem novas notificações.
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 border-b border-slate-100 dark:border-slate-900 last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        {notif.type === 'success' && <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />}
                        {notif.type === 'alert' && <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />}
                        {notif.type === 'info' && <HelpCircle size={14} className="text-[#00E5FF] shrink-0 mt-0.5" />}
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{notif.title}</span>
                          <span className="text-slate-500 text-[11px] leading-tight mt-0.5">{notif.desc}</span>
                          <span className="text-slate-400 text-[9px] mt-1 font-mono">{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CISA USER BADGE */}
        <div className="hidden border-l border-slate-200 dark:border-slate-850 pl-3 h-8 md:flex items-center gap-2">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">TITANX USER</span>
            <span className="text-[10px] text-slate-400 font-mono font-medium max-w-[120px] truncate">{userEmail}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800">
            <User size={15} className="text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
