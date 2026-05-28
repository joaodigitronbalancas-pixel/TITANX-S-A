import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Command,
  Sun,
  Moon,
  LogOut,
  FolderOpen,
  User,
  LayoutDashboard,
  Wallet,
  Cpu,
  Lock,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveModule: (module: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  currentTheme: 'light' | 'dark';
  onLogout: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  setActiveModule,
  setTheme,
  currentTheme,
  onLogout
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Command list matching modules & system actions
  const commands = [
    { id: 'dash', title: 'Ir para BI Executive Master', category: 'Navegação', icon: LayoutDashboard, action: () => { setActiveModule('dashboard'); onClose(); } },
    { id: 'dir', title: 'Ir para Diretoria & Riscos S/A', category: 'Navegação', icon: Lock, action: () => { setActiveModule('diretoria'); onClose(); } },
    { id: 'fin', title: 'Ir para Contabilidade & Caixa', category: 'Navegação', icon: Wallet, action: () => { setActiveModule('financeiro'); onClose(); } },
    { id: 'fat', title: 'Ir para Sefaz Faturamento NF-e', category: 'Navegação', icon: FolderOpen, action: () => { setActiveModule('faturamento'); onClose(); } },
    { id: 'pcp', title: 'Ir para Plantas Realtime IoT (PCP)', category: 'Navegação', icon: Cpu, action: () => { setActiveModule('producao'); onClose(); } },
    { id: 'theme', title: `Alternar Tema para ${currentTheme === 'light' ? 'Escuro' : 'Claro'}`, category: 'Configurações', icon: currentTheme === 'light' ? Moon : Sun, action: () => { setTheme(currentTheme === 'light' ? 'dark' : 'light'); onClose(); } },
    { id: 'logout', title: 'Destruir Sessão (Logout)', category: 'Segurança', icon: LogOut, action: () => { onLogout(); onClose(); } }
  ];

  const filtered = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 overflow-hidden flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Frame panel */}
      <div id="command-palette-panel" className="relative w-full max-w-lg bg-slate-900 border border-slate-805 text-slate-100 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] z-10 overflow-hidden flex flex-col max-h-[420px] divide-y divide-slate-800">
        
        {/* Input box */}
        <div className="p-4 flex items-center gap-3">
          <Command size={18} className="text-[#00E5FF] shrink-0" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Digite um comando executivo ou módulo..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
            className="flex-grow bg-transparent border-0 outline-none focus:ring-0 text-sm text-slate-200 placeholder-slate-500 font-sans"
          />
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white roundedcursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-72 p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-xs">
              Nenhum comando TitanX correspondido.
            </div>
          ) : (
            filtered.map((cmd, index) => {
              const CmdIcon = cmd.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected ? 'bg-gradient-to-r from-[#00E5FF]/10 to-indigo-950/60 border border-[#00E5FF]/20 text-white' : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CmdIcon size={16} className={isSelected ? 'text-[#00E5FF]' : 'text-slate-500'} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{cmd.title}</span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mt-0.5">{cmd.category}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`text-slate-600 transition-transform ${isSelected ? 'translate-x-1 text-[#00E5FF]' : ''}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Shortcut legends */}
        <div className="p-3 px-4 bg-slate-950/40 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-0.5 px-1.5 bg-slate-800 rounded">⇅ Navegar</span>
            <span className="p-0.5 px-1.5 bg-slate-800 rounded">↵ Confirmar</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> Criptografia de console ativa
          </div>
        </div>

      </div>
    </div>
  );
}
