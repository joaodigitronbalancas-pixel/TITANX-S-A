import { useState, useEffect } from 'react';
import { UserRole } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import ErrorBoundary from './components/ErrorBoundary';
import CommandPalette from './components/CommandPalette';

// Import All modules
import DashboardExecutivo from './components/DashboardExecutivo';
import Logistica from './components/Logistica';
import Financeiro from './components/Financeiro';
import Faturamento from './components/Faturamento';
import Comercial from './components/Comercial';
import Marketing from './components/Marketing';
import RH from './components/RH';
import Industrial from './components/Industrial';
import Producao from './components/Producao';
import Projetos from './components/Projetos';
import TI from './components/TI';
import Desenvolvimento from './components/Desenvolvimento';
import DiretoriaGovernanca from './components/DiretoriaGovernanca';
import InvestAI from './components/InvestAI';

// Elegant Enterprise Skeleton Loading State
function ModuleLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Skeleton Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-2 flex-grow">
          <div className="h-7 bg-slate-250 dark:bg-slate-800 rounded-lg w-1/3"></div>
          <div className="h-3 bg-slate-150 dark:bg-slate-850 rounded w-2/3"></div>
        </div>
        <div className="h-8 bg-slate-250 dark:bg-slate-800 rounded-lg w-32 shrink-0"></div>
      </div>

      {/* Skeleton Top KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-855 rounded-2xl p-5 h-24 flex items-center justify-between">
            <div className="space-y-3 flex-grow">
              <div className="h-3 bg-slate-250 dark:bg-slate-805 rounded w-1/2"></div>
              <div className="h-5 bg-slate-300 dark:bg-slate-750 rounded w-3/4"></div>
            </div>
            <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0"></div>
          </div>
        ))}
      </div>

      {/* Skeleton Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-855 rounded-2xl p-5 h-80 col-span-2 space-y-4">
          <div className="h-4 bg-slate-250 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="w-full h-56 bg-slate-200/50 dark:bg-slate-850 rounded-xl"></div>
        </div>
        <div className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-855 rounded-2xl p-5 h-80 space-y-4 flex flex-col">
          <div className="h-4 bg-slate-250 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex gap-2.5 items-start">
                <div className="h-5 w-5 bg-slate-250 dark:bg-slate-850 rounded-full shrink-0"></div>
                <div className="space-y-1.5 flex-grow">
                  <div className="h-3.5 bg-slate-250 dark:bg-slate-800 rounded w-5/6"></div>
                  <div className="h-2.5 bg-slate-150 dark:bg-slate-850 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>('Super Admin');
  const [activeCompany, setActiveCompany] = useState<string>('TitanX Holding S.A.');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [searchText, setSearchText] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isModuleLoading, setIsModuleLoading] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Global listener for Ctrl+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast notifications trigger simulation
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleExportSimulation = (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => {
    triggerToast(
      `Relatório corporativo "${moduleName}" exportado com sucesso no formato .${format.toUpperCase()}!`,
      'success'
    );
  };

  const handleLoginSuccess = (role: string) => {
    setActiveRole(role as UserRole);
    setIsAuthenticated(true);
    triggerToast('Acesso de Super Administrador autorizado. Criptografia ativa.', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    triggerToast('Desconectado do sistema. Sessão destruída com segurança.', 'info');
  };

  // Sync state transitions or permissions constraints
  useEffect(() => {
    // If permission role is restricted, force tab adjustment to avoid void screens
    if (activeRole !== 'Super Admin' && activeRole !== 'Diretoria') {
      const lowerRole = activeRole.toLowerCase();
      if (lowerRole.includes('finan')) {
        setActiveModule('financeiro');
      } else if (lowerRole.includes('rh') || lowerRole.includes('recurs')) {
        setActiveModule('rh');
      } else if (lowerRole.includes('comerc')) {
        setActiveModule('comercial');
      } else if (lowerRole.includes('market')) {
        setActiveModule('marketing');
      } else if (lowerRole.includes('logis')) {
        setActiveModule('logistica');
      } else if (lowerRole.includes('indust')) {
        setActiveModule('industrial');
      } else if (lowerRole.includes('produ')) {
        setActiveModule('producao');
      } else if (lowerRole.includes('ti')) {
        setActiveModule('ti');
      } else if (lowerRole.includes('desenv')) {
        setActiveModule('desenvolvimento');
      } else if (lowerRole.includes('proj')) {
        setActiveModule('projetos');
      }
    }
  }, [activeRole]);

  // Handle CSS Class list injection for theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Loading transition for module switching simulation
  useEffect(() => {
    setIsModuleLoading(true);
    const timer = setTimeout(() => {
      setIsModuleLoading(false);
    }, 380);
    return () => clearTimeout(timer);
  }, [activeModule]);

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${
      theme === 'dark' ? 'bg-[#020512] text-[#f1f5f9]' : 'bg-[#fafafa] text-[#1e293b]'
    }`}>
      {/* GLOBAL BACKGROUND ELEMENTS (High style premium decor) */}
      <div className="absolute top-0 left-[20%] right-0 h-[500px] bg-gradient-to-tr from-[#a855f7]/5 via-[#00E5FF]/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[-100px] h-[350px] w-[350px] bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />


      {/* RENDER VIEW LAYOUT */}
      <div className="flex h-screen overflow-hidden relative">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          role={activeRole}
          userName="Leonardo Albuquerque"
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            searchText={searchText}
            setSearchText={setSearchText}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            activeCompany={activeCompany}
            setActiveCompany={setActiveCompany}
            sidebarCollapsed={sidebarCollapsed}
            onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            darkMode={theme === 'dark'}
            setDarkMode={(dark) => setTheme(dark ? 'dark' : 'light')}
            userEmail="admin@titanxerp.com"
          />

          {/* INNER CORE DENSE CONTENT COMPONENT PORTAL */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <ErrorBoundary>
              {isModuleLoading ? (
                <ModuleLoadingSkeleton />
              ) : (
                <>
                  {/* RENDER BY SELECTED MODULE */}
                  {activeModule === 'dashboard' && (
                    <DashboardExecutivo searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'invest_ai' && (
                    <InvestAI searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'logistica' && (
                    <Logistica searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'financeiro' && (
                    <Financeiro searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'faturamento' && (
                    <Faturamento searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'comercial' && (
                    <Comercial searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'marketing' && (
                    <Marketing searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'rh' && (
                    <RH searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'industrial' && (
                    <Industrial searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'producao' && (
                    <Producao searchText={searchText} />
                  )}
                  {activeModule === 'projetos' && (
                    <Projetos searchText={searchText} />
                  )}
                  {activeModule === 'ti' && (
                    <TI searchText={searchText} onExport={handleExportSimulation} />
                  )}
                  {activeModule === 'desenvolvimento' && (
                    <Desenvolvimento searchText={searchText} />
                  )}
                  {activeModule === 'diretoria' && (
                    <DiretoriaGovernanca searchText={searchText} />
                  )}
                </>
              )}
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {/* NOTIFICATIONS FLOATING TOAST BAR */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-55 flex items-center gap-3 p-4 bg-slate-900 border border-[#00E5FF]/20 text-white rounded-xl shadow-2xl animate-bounce">
          <span className="h-2 w-2 rounded-full bg-[#00E5FF] shadow-lg shadow-[#00E5FF]"></span>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* DYNAMIC GLOBAL COMMAND PALETTE */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveModule={setActiveModule}
        setTheme={setTheme}
        currentTheme={theme}
        onLogout={handleLogout}
      />
    </div>
  );
}
