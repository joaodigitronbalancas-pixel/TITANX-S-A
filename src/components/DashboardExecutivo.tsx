import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users2,
  CalendarDays,
  FileCheck2,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Download,
  Brain,
  CheckCircle,
  XCircle,
  Map,
  Activity,
  FileText,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Building,
  RefreshCw,
  Eye,
  Sliders,
  ChevronDown,
  BarChart3,
  Percent,
  Search,
  Check,
  X,
  PlusSquare,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import AdvancedFilters, { FilterState, initialFilters } from './AdvancedFilters';

export interface DashboardExecutivoProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

interface ApprovalAction {
  id: string;
  title: string;
  requester: string;
  department: string;
  amount?: string;
  type: 'Orçamento' | 'Contratação' | 'Segurança' | 'Processo';
  date: string;
  status: 'Pendente' | 'Aprovado' | 'Recusado';
}

export default function DashboardExecutivo({ searchText, onExport }: DashboardExecutivoProps) {
  // Advanced Filter state
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Executive mode states
  const [selectedView, setSelectedView] = useState<'ceo' | 'cfo' | 'coo' | 'chro'>('ceo');
  const [selectedKpiDetail, setSelectedKpiDetail] = useState<string | null>(null);
  
  // Dynamic list state for executive approvals workflow
  const [approvals, setApprovals] = useState<ApprovalAction[]>([
    { id: 'app-1', title: 'Verba Adicional de Marketing B2B - Agro', requester: 'Patrícia Sales', department: 'Marketing', amount: 'R$ 45.000,00', type: 'Orçamento', date: '25/05/2026', status: 'Pendente' },
    { id: 'app-2', title: 'Contratação Urgente: Engenheiro IoT Jr', requester: 'Adilson Silveira', department: 'RH / PCP', amount: 'R$ 8.500,00/mês', type: 'Contratação', date: '26/05/2026', status: 'Pendente' },
    { id: 'app-3', title: 'Autorização XML: Faturamento Especial Vale S.A', requester: 'Beatriz Vasconcelos', department: 'Financeiro', amount: 'R$ 1.250.000,00', type: 'Orçamento', date: '27/05/2026', status: 'Pendente' },
    { id: 'app-4', title: 'Chave de Bypass de Auditoria - Planta Sul', requester: 'Roberto Antunes', department: 'Produção', type: 'Segurança', date: '28/05/2026', status: 'Pendente' }
  ]);

  // AI-Insights simulation state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsightVersion, setAiInsightVersion] = useState(1);
  const [activeTabGoal, setActiveTabGoal] = useState<'SWOT' | 'Metas' | 'Riscos'>('SWOT');

  // Widget Order state to demonstrate reorganizable blocks
  const [widgetOrder, setWidgetOrder] = useState<string[]>(['kpis', 'mainGrid', 'approvals', 'strategic']);

  // Table drill, sort & pagination for enterprise logs
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logSortField, setLogSortField] = useState<'timestamp' | 'module' | 'action'>('timestamp');
  const [logSortDirection, setLogSortDirection] = useState<'asc' | 'desc'>('desc');
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  
  const mockActivityLogs = [
    { id: 'log-1', timestamp: '18:24:12', user: 'admin@titanxerp.com', module: 'Financeiro', action: 'Geração de PDF DRE Mensal S.A', ip: '192.168.0.84', status: 'Sucesso' },
    { id: 'log-2', timestamp: '18:15:33', user: 'admin@titanxerp.com', module: 'Industrial', action: 'Bypass de Trava Térmica Balança PCP', ip: '192.168.0.84', status: 'Sucesso' },
    { id: 'log-3', timestamp: '17:59:02', user: 'leonardo@titanxerp.com', module: 'Diretoria', action: 'Consulta Matriz SWOT de Riscos Globais', ip: '10.0.1.45', status: 'Sucesso' },
    { id: 'log-4', timestamp: '17:48:11', user: 'beatriz.v@titanxerp.com', module: 'Faturamento', action: 'Emissão de NFS-e #8540 Ambev S.A', ip: '172.16.8.210', status: 'Sucesso' },
    { id: 'log-5', timestamp: '16:30:55', user: 'admin@titanxerp.com', module: 'Parcerias', action: 'Tentativa de Login Inválido (Usuário Suspenso)', ip: '45.190.22.4', status: 'Bloqueado' },
    { id: 'log-6', timestamp: '15:20:10', user: 'mariana.s@titanxerp.com', module: 'RH', action: 'Aprovação de Dissídio Coletivo 2026', ip: '10.0.2.110', status: 'Sucesso' }
  ];

  // Dynamic values that responsive to filters
  const [dynamicMetrics, setDynamicMetrics] = useState({
    faturamento: 1845220,
    custoPcp: 684340,
    ativos: 354,
    eficiencia: 91.8,
    mrr: 145000,
    cac: 4500,
    ltv: 62000,
    churn: 2.1,
    sla: 98.4
  });

  // Dynamic metrics updates based on filters to act as live system
  useEffect(() => {
    let multiplier = 1.0;
    if (filters.empresa.length > 0) multiplier *= 0.85;
    if (filters.filial.length > 0) multiplier *= 0.92;
    if (filters.periodo === 'hoje') multiplier *= 0.08;
    if (filters.periodo === 'ontem') multiplier *= 0.09;
    if (filters.periodo === '7d') multiplier *= 0.35;
    
    setDynamicMetrics({
      faturamento: Math.round(1845220 * multiplier),
      custoPcp: Math.round(684340 * multiplier),
      ativos: filters.departamento.includes('RH') || filters.departamento.includes('Diretoria') ? 142 : Math.round(354 * (multiplier > 0.5 ? 1 : multiplier)),
      eficiencia: Math.min(99.9, Number((91.8 * (0.95 + Math.random() * 0.1)).toFixed(1))),
      mrr: Math.round(145000 * multiplier),
      cac: Math.round(4500 * (1 + (Math.random() - 0.5) * 0.1)),
      ltv: Math.round(62000 * (0.9 + Math.random() * 0.2)),
      churn: Number((2.15 + (Math.random() - 0.5) * 0.4).toFixed(2)),
      sla: Number((98.4 + (Math.random() - 0.5) * 1.5).toFixed(1))
    });
  }, [filters]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleRemoveFilterBadge = (key: keyof FilterState, value?: string) => {
    if (key === 'periodo') {
      setFilters(prev => ({ ...prev, periodo: '30d' }));
      return;
    }
    if (value) {
      setFilters(prev => ({
        ...prev,
        [key]: (prev[key] as string[]).filter(item => item !== value)
      }));
    }
  };

  // Reorganizing widgets callback
  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const index = widgetOrder.indexOf(id);
    if (index === -1) return;
    const newOrder = [...widgetOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    // Swap
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setWidgetOrder(newOrder);
  };

  const processApproval = (id: string, decision: 'Aprovado' | 'Recusado') => {
    setApprovals(prev => prev.map(app => app.id === id ? { ...app, status: decision } : app));
  };

  const triggerAiRefining = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setAiInsightVersion(prev => prev + 1);
    }, 900);
  };

  // CSV export function (Real download block)
  const executeRealCsvExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID;Timestamp;Usuario;Modulo;Acao;IP;Status\n";
    mockActivityLogs.forEach(row => {
      csvContent += `${row.id};${row.timestamp};${row.user};${row.module};${row.action};${row.ip};${row.status}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TITANX_AUDIT_LOG_EXPORT.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onExport('csv', 'Audit Logs Executive', mockActivityLogs);
  };

  const activeFiltersChips = () => {
    const chips: { key: keyof FilterState; val: string; displayField: string }[] = [];
    if (filters.periodo !== '30d') {
      chips.push({ key: 'periodo', val: filters.periodo, displayField: `Período: ${filters.periodo}` });
    }
    Object.entries(filters).forEach(([k, v]) => {
      if (k === 'periodo') return;
      const arr = v as string[];
      arr.forEach(val => {
        chips.push({ key: k as keyof FilterState, val, displayField: val });
      });
    });
    return chips;
  };

  // Render sorting for audit logs
  const sortedLogs = [...mockActivityLogs].sort((a, b) => {
    const valA = a[logSortField].toLowerCase();
    const valB = b[logSortField].toLowerCase();
    if (valA < valB) return logSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return logSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredLogs = sortedLogs.filter(log => {
    const term = logSearchQuery.toLowerCase();
    return log.user.toLowerCase().includes(term) ||
           log.module.toLowerCase().includes(term) ||
           log.action.toLowerCase().includes(term);
  });

  return (
    <div id="executive-hub" className="space-y-6">
      
      {/* GLOBAL ENTERPRISE TOP ROW FILTER BAR & QUICK ACTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 blur-2xl pointer-events-none rounded-full" />
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          {/* ADVANCED FILTER BUTTON */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="w-full md:w-auto bg-gradient-to-tr from-[#00E5FF]/10 via-[#00E5FF]/20 to-indigo-600/35 border border-[#00E5FF]/40 text-[#00E5FF] hover:border-[#00E5FF] px-4 py-2 rounded-xl text-xs font-bold leading-none cursor-pointer flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)] whitespace-nowrap"
          >
            <Sliders size={14} className="animate-pulse" />
            <span>Filtros Avançados S/A</span>
            <span className="p-0.5 px-1.5 bg-sky-500/25 text-white font-mono text-[9px] rounded-full">
              {activeFiltersChips().length || 'Padrão'}
            </span>
          </button>

          {/* ACTIVE CHIPS SUMMARY IN INNER CORNER */}
          {activeFiltersChips().length > 0 && (
            <div className="flex flex-wrap gap-1 max-w-sm md:max-w-md max-h-12 overflow-y-auto">
              {activeFiltersChips().map((chip, index) => (
                <span key={index} className="inline-flex items-center gap-1 bg-slate-950/80 text-xs px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-[10px] lowercase text-[#00E5FF] font-mono">#{chip.key}:</span>
                  <span className="font-semibold">{chip.displayField}</span>
                  <button onClick={() => handleRemoveFilterBadge(chip.key, chip.val)} className="text-rose-400 hover:text-rose-300 cursor-pointer text-[10px] ml-1">
                    <X size={10} />
                  </button>
                </span>
              ))}
              <button 
                onClick={() => setFilters(initialFilters)} 
                className="text-[10px] text-slate-400 hover:text-white cursor-pointer underline px-1"
              >
                Limpar Tudo
              </button>
            </div>
          )}
        </div>

        {/* SUITE NAV TABS PRESTIGE VIEW SELECTOR */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-1 rounded-xl flex items-center justify-center w-full md:w-auto gap-1">
          {(['ceo', 'cfo', 'coo', 'chro'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer block uppercase tracking-wider ${
                selectedView === view
                  ? 'bg-gradient-to-tr from-[#00E5FF] to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {view === 'ceo' ? '📈 CEO COCKPIT' : view === 'cfo' ? '💰 CFO LEDGER' : view === 'coo' ? '⚙ COO PCP' : '👥 Talent HR'}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER CUSTOM ORDER OF WIDGETS */}
      {widgetOrder.map((sectionId) => {
        
        // -----------------------------------------------------
        // KPI BLOCKS GRID WIDGET
        // -----------------------------------------------------
        if (sectionId === 'kpis') {
          return (
            <div key="kpis" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] font-black uppercase">Resultados Corporativos Integrados</span>
                <div className="flex gap-1.5">
                  <button onClick={() => moveWidget('kpis', 'down')} className="text-slate-500 hover:text-white text-xs cursor-pointer p-1">▼ Descer</button>
                </div>
              </div>

              {/* DYNAMIC KPI BENTO-GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* CARD 1: Revenue or MRR */}
                <div 
                  onClick={() => setSelectedKpiDetail('revenue')}
                  className="glass-card p-5 rounded-2xl hover:border-[#00E5FF]/60 hover:glow-cyan transition-all hover:scale-[1.02] cursor-pointer relative group flex justify-between items-center overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-[#00E5FF]/10 to-indigo-500/10 blur-xl rounded-full" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] to-transparent opacity-30" />
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">FATURAMENTO CONSOLIDADO</span>
                    <h3 className="text-2xl font-black text-white font-sans tracking-tight">
                      R$ {dynamicMetrics.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                      <TrendingUp size={13} />
                      <span className="font-mono bg-emerald-500/15 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold text-[10px]">+18.4% YoY</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-[#00E5FF]/20 to-indigo-950/40 text-[#00E5FF] border border-[#00E5FF]/20 rounded-xl group-hover:scale-110 transition-all z-10 shadow-[0_0_15px_rgba(0,E5,FF,0.15)]">
                    <DollarSign size={20} />
                  </div>
                </div>

                {/* CARD 2: Sales or CAC/LTV */}
                <div 
                  onClick={() => setSelectedKpiDetail(selectedView === 'cfo' ? 'mrr' : 'industrial')}
                  className="glass-card p-5 rounded-2xl hover:border-cyan-500/60 hover:glow-cyan transition-all hover:scale-[1.02] cursor-pointer relative group flex justify-between items-center overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-cyan-500/10 to-transparent blur-xl rounded-full" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-transparent opacity-30" />
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                      {selectedView === 'cfo' ? 'RECEITA RECORRENTE (MRR)' : 'CUSTO OPERACIONAL INDUSTRIAL'}
                    </span>
                    <h3 className="text-2xl font-black text-white font-sans tracking-tight">
                      {selectedView === 'cfo' 
                        ? `R$ ${dynamicMetrics.mrr.toLocaleString('pt-BR')},00` 
                        : `R$ ${dynamicMetrics.custoPcp.toLocaleString('pt-BR')},00`
                      }
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-sky-400 mt-1">
                      <TrendingUp size={13} />
                      <span className="font-mono bg-sky-500/15 border border-sky-550/20 px-1.5 py-0.5 rounded font-bold text-[10px]">-3% Meta Despesa</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-sky-500/20 to-indigo-950/40 text-sky-400 border border-sky-500/20 rounded-xl group-hover:scale-110 transition-all z-10">
                    {selectedView === 'cfo' ? <BarChart3 size={20} /> : <ShoppingCart size={20} />}
                  </div>
                </div>

                {/* CARD 3: Employees or LTV/CAC */}
                <div 
                  onClick={() => setSelectedKpiDetail('talent')}
                  className="glass-card p-5 rounded-2xl hover:border-purple-500/60 hover:glow-purple transition-all hover:scale-[1.02] cursor-pointer relative group flex justify-between items-center overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-purple-500/10 to-transparent blur-xl rounded-full" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 to-transparent opacity-30" />
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                      {selectedView === 'cfo' ? 'INDICE LTV : CAC RATIO' : 'CAPACIDADE OPERACIONAL TALENTOS'}
                    </span>
                    <h3 className="text-2xl font-black text-white font-sans tracking-tight">
                      {selectedView === 'cfo' 
                        ? `${(dynamicMetrics.ltv / dynamicMetrics.cac).toFixed(1)}x` 
                        : `${dynamicMetrics.ativos} Fte`
                      }
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-purple-400 mt-1">
                      <Activity size={13} />
                      <span className="font-mono bg-purple-500/15 border border-purple-500/20 px-1.5 py-0.5 rounded font-bold text-[10px]">LTV R$ {dynamicMetrics.ltv.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-950/40 text-purple-400 border border-purple-500/20 rounded-xl group-hover:scale-110 transition-all z-10">
                    <Users2 size={20} />
                  </div>
                </div>

                {/* CARD 4: Efficiency or SLA */}
                <div 
                  onClick={() => setSelectedKpiDetail('efficiency')}
                  className="glass-card p-5 rounded-2xl hover:border-emerald-500/60 hover:glow-emerald transition-all hover:scale-[1.02] cursor-pointer relative group flex justify-between items-center overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-emerald-500/10 to-transparent blur-xl rounded-full" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-transparent opacity-30" />
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                      {selectedView === 'coo' ? 'COMPLIANCE SLA OPERACIONAL' : 'EFICIENCIA GERAL DE PLANTA (OEE)'}
                    </span>
                    <h3 className="text-2xl font-black text-white font-sans tracking-tight">
                      {selectedView === 'coo' ? `${dynamicMetrics.sla}%` : `${dynamicMetrics.eficiencia}%`}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                      <TrendingUp size={13} />
                      <span className="font-mono bg-emerald-500/15 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold text-[10px]">+1.1% v3</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-indigo-950/40 text-emerald-400 border border-emerald-500/20 rounded-xl group-hover:scale-110 transition-all z-10">
                    <Award size={20} />
                  </div>
                </div>

              </div>
            </div>
          );
        }

        // -----------------------------------------------------
        // MAIN DATA GRID: CHART & AI ADVISOR COMBINED
        // -----------------------------------------------------
        if (sectionId === 'mainGrid') {
          return (
            <div key="mainGrid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* INTERACTIVE DYNAMIC CHART PANEL */}
              <div className="glass-card p-6 shadow-sm col-span-2 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-850 pb-4">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <BarChart3 size={16} className="text-[#00E5FF]" />
                      Análise Multidimensão Corporativa ({selectedView.toUpperCase()})
                    </h3>
                    <p className="text-[11px] text-slate-400">Clique e explore as dimensões via filtros inteligentes.</p>
                  </div>
                  
                  {/* CHART CONTROLS */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#00E5FF] inline-block"></span> Vendas Reais
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-600 inline-block"></span> Projeção Orgânica
                    </span>
                  </div>
                </div>

                {/* PREMIUM CUSTOM SCALABLE SVG VECTOR PLOTTING CHART */}
                <div className="relative w-full h-72 border-b border-l border-slate-800 flex items-end pt-5">
                  <div className="absolute inset-x-0 bottom-0 top-5 pointer-events-none flex flex-col justify-between">
                    {[1, 2, 3, 4].map(g => (
                      <div key={g} className="w-full border-t border-dashed border-slate-800/40"></div>
                    ))}
                  </div>

                  <svg className="w-full h-full absolute inset-0 pt-6 pr-2" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Vendas line / area */}
                    <path 
                      d="M 0,170 Q 75,130 150,140 T 300,80 T 425,60 T 500,45 L 500,200 L 0,200 Z" 
                      fill="url(#primaryGrad)" 
                    />
                    <path 
                      d="M 0,170 Q 75,130 150,140 T 300,80 T 425,60 T 500,45" 
                      fill="none" 
                      stroke="#00E5FF" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                    />

                    {/* Projecoes area */}
                    <path 
                      d="M 0,192 Q 100,165 200,122 T 350,105 T 500,88 L 500,200 L 0,200 Z" 
                      fill="url(#secondaryGrad)" 
                    />
                    <path 
                      d="M 0,192 Q 100,165 200,122 T 350,105 T 500,88" 
                      fill="none" 
                      stroke="#6366f1" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeDasharray="4 2" 
                    />

                    {/* Marker pins */}
                    <circle cx="300" cy="80" r="5" fill="#00E5FF" />
                    <circle cx="500" cy="45" r="5" fill="#00E5FF" />
                  </svg>

                  {/* VALUE LABELS ON AXIS */}
                  <div className="absolute left-[-22px] inset-y-0 flex flex-col justify-between text-[8px] font-mono text-slate-500 pointer-events-none">
                    <span>R$ 5M</span>
                    <span>R$ 3.5M</span>
                    <span>R$ 2M</span>
                    <span>R$ 1M</span>
                    <span>0</span>
                  </div>

                  <div className="absolute inset-x-0 bottom-[-22px] flex justify-between px-3 text-[9px] font-mono text-slate-400">
                    <span>Q2-2025</span>
                    <span>Q3-2025</span>
                    <span>Q4-2025</span>
                    <span>Q1-2026 (Fechado)</span>
                    <span>Q2-2026 (Corrente v3)</span>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl relative overflow-hidden group">
                    <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase">FUTURO PREVISTO (IA PREDICTIVE)</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      A tendência indica um aumento de <span className="text-emerald-400 font-bold">14.1%</span> no fechamento fiscal do próximo trimestre devido à aceleração da Filial EUA.
                    </p>
                  </div>
                  <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 block">EXPORTAR RELATÓRIO BI</span>
                      <p className="text-xs font-bold text-white mt-0.5">Visão consolidada atual</p>
                    </div>
                    <button 
                      onClick={() => onExport('xlsx', `Grafico_${selectedView}`, dynamicMetrics)}
                      className="p-2 py-1.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 rounded-lg text-[10px] text-emerald-400 font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Download size={11} /> Baixar Planilha
                    </button>
                  </div>
                </div>
              </div>

              {/* CO-PILOT ADVISOR IN REAL-TIME (TITANX CORE-AI) */}
              <div className="glass-card hover:border-purple-500/50 hover:glow-purple p-5 shadow-sm space-y-4 relative flex flex-col justify-between overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 blur-xl rounded-full" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 px-1.5 bg-[#00E5FF]/15 text-[#00E5FF] rounded-lg border border-[#00E5FF]/30 font-black text-xs font-mono">TX-AI</div>
                      <h4 className="text-xs font-black text-white">Análise Preditiva SaaS</h4>
                    </div>
                    <button 
                      onClick={triggerAiRefining} 
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Forçar Re-Análise de Filtro"
                    >
                      <RefreshCw size={12} className={isAiLoading ? 'animate-spin text-[#00E5FF]' : ''} />
                    </button>
                  </div>

                  {isAiLoading ? (
                    <div className="space-y-3 py-6">
                      <div className="h-4 bg-slate-850 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-slate-850 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-slate-850 rounded animate-pulse w-5/6"></div>
                      <div className="h-3 bg-slate-850 rounded animate-pulse w-1/2"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiInsightVersion % 2 === 1 ? (
                        <>
                          <div className="p-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-xl space-y-1">
                            <div className="flex items-center gap-1 font-bold text-[#00E5FF] text-[10px] tracking-wider uppercase">
                              <Sparkles size={11} /> Alerta de Custo PCP
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              O custo de produção atingiu <span className="font-bold text-white">37%</span> do faturamento bruto na fábrica do PR. Recomenda-se acionar negociação de compra em massa do chip Cortex-M4.
                            </p>
                          </div>

                          <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl space-y-1">
                            <div className="flex items-center gap-1 font-bold text-purple-400 text-[10px] tracking-wider uppercase">
                              <ShieldAlert size={11} /> Risco Tributário Identificado
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              O volume de notas pendentes da Ambev extrapola o limite diário da Sefaz regional. Sincronização automática programada para 22h.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1">
                            <div className="flex items-center gap-1 font-bold text-amber-400 text-[10px] tracking-wider uppercase">
                              <Brain size={11} /> Otimização de Liquidez Comercial
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Filtro ativo de <span className="text-white font-bold">Últimos 7 dias</span> demonstra pico de recebíveis pendentes. Liberação em lote recomendada.
                            </p>
                          </div>

                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1">
                            <div className="flex items-center gap-1 font-bold text-emerald-400 text-[10px] tracking-wider uppercase">
                              <CheckCircle size={11} /> Oportunidade Agronegócio
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              As exportações de balanças industriais para a LatAm estão com alta margem líquida. Considerar aumentar budget de captação B2B.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-850 pt-3">
                  <div className="flex gap-2 text-[10px]">
                    <button 
                      onClick={() => onExport('pdf', 'Análise Predict_TXAI', dynamicMetrics)}
                      className="flex-1 py-1 px-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-305 text-center font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Exportar Análise PDF
                    </button>
                    <button 
                      onClick={triggerAiRefining}
                      className="flex-grow flex items-center justify-center gap-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black shrink-0 transition-all cursor-pointer shadow-indigo-600/30 shadow-lg"
                    >
                      <Activity size={10} /> Otimizar KPIs Hoje
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // -----------------------------------------------------
        // APPROVALS ACTIONS WORKFLOW WIDGET
        // -----------------------------------------------------
        if (sectionId === 'approvals') {
          return (
            <div key="approvals" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* WORKFLOW DE APROVAÇÕES DO DIRETOR */}
              <div className="glass-card p-6 shadow-sm col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <FileCheck2 size={16} className="text-[#00E5FF]" />
                      Workflow Integrado de Aprovações Executivas
                    </h3>
                    <p className="text-[11px] text-slate-400">Processos de Diretoria S/A exigindo liberação imediata via super-senha.</p>
                  </div>
                  <span className="p-1 px-2 bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-bold rounded-full font-mono">
                    {approvals.filter(a => a.status === 'Pendente').length} Pendentes
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                  {approvals.map((app) => (
                    <div 
                      key={app.id} 
                      className={`p-3.5 bg-slate-950/60 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        app.status === 'Aprovado' ? 'border-emerald-500/30 bg-emerald-950/5' :
                        app.status === 'Recusado' ? 'border-rose-500/30 bg-rose-950/5' :
                        'border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 px-1.5 rounded text-[8px] font-mono font-bold leading-none uppercase ${
                            app.type === 'Orçamento' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            app.type === 'Contratação' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20'
                          }`}>
                            {app.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium font-mono">{app.date} - {app.requester}</span>
                        </div>
                        <h4 className="text-xs font-black text-white">{app.title}</h4>
                        {app.amount && (
                          <p className="text-xs font-mono text-[#00E5FF] font-bold">Valor Base: {app.amount}</p>
                        )}
                      </div>

                      {/* ACTIONS OF APPROVALS */}
                      <div className="flex items-center gap-2 shrink-0">
                        {app.status === 'Pendente' ? (
                          <>
                            <button
                              onClick={() => processApproval(app.id, 'Recusado')}
                              className="p-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20 cursor-pointer flex items-center gap-1 transition-all"
                            >
                              <XCircle size={12} /> Rejeitar
                            </button>
                            <button
                              onClick={() => processApproval(app.id, 'Aprovado')}
                              className="p-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500 text-white text-[10px] font-extrabold rounded-lg border border-emerald-500/30 cursor-pointer flex items-center gap-1 transition-all"
                            >
                              <CheckCircle size={12} /> Autorizar S/A
                            </button>
                          </>
                        ) : (
                          <span className={`inline-flex items-center gap-1 p-1 px-3.5 rounded-lg text-xs font-mono font-black ${
                            app.status === 'Aprovado' ? 'bg-emerald-505/10 text-emerald-400 border border-emerald-500/25' : 'bg-rose-505/10 text-rose-400 border border-rose-500/25'
                          }`}>
                            {app.status === 'Aprovado' ? '✓ AUTORIZADO' : '✗ REJEITADO'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TEAMS RANKINGS & PERFORMANCE */}
              <div className="glass-card hover:border-cyan-500/30 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-black text-white tracking-wider flex items-center gap-1.5 uppercase">
                    🏆 Ranking de Performance Comercial & Industrial
                  </h4>
                  <span className="text-[10px] font-mono text-purple-400 font-bold">META Q2</span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[9px] font-bold text-slate-400">
                      <span>1. Agro-Scale Vendas US</span>
                      <span className="text-emerald-400">98% da Meta (R$ 840k)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00E5FF] to-sky-500 rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-slate-800/50 pt-2">
                    <div className="flex justify-between font-mono text-[9px] font-bold text-slate-400">
                      <span>2. Metalurgia PCP PR</span>
                      <span className="text-[#00E5FF]">91.8% OEE</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00E5FF] rounded-full" style={{ width: '91.8%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-slate-800/50 pt-2">
                    <div className="flex justify-between font-mono text-[9px] font-bold text-slate-400">
                      <span>3. Logística Marítima Global</span>
                      <span className="text-amber-400">84% SLA Entregas</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-slate-800/50 pt-2">
                    <div className="flex justify-between font-mono text-[9px] font-bold text-slate-400">
                      <span>4. Integração Cloud Devs</span>
                      <span className="text-[#00E5FF]">99.8% Uptime</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-600 rounded-full" style={{ width: '99.8%' }} />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          );
        }

        // -----------------------------------------------------
        // STRATEGIC PLANNING, GOVERNANCE & SWOT MODULE
        // -----------------------------------------------------
        if (sectionId === 'strategic') {
          return (
            <div key="strategic" className="glass-card hover:border-[#00E5FF]/30 p-6 shadow-sm space-y-4 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-850 pb-4">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Map size={16} className="text-[#00E5FF]" />
                    Planejamento Estratégico, Governança & SWOT Matrix
                  </h3>
                  <p className="text-[11px] text-slate-400">Ferramenta integrada sob conformidade ESG e LGPD ativa.</p>
                </div>

                {/* SWOT METAS GOALS BUTTONS */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-850 rounded-xl text-xs">
                  {(['SWOT', 'Metas', 'Riscos'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTabGoal(tab)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        activeTabGoal === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* SWOT TAB */}
              {activeTabGoal === 'SWOT' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                    <h4 className="font-mono font-black text-emerald-400 text-xs">⚡ FORÇAS (Strengths)</h4>
                    <p className="text-slate-350 leading-relaxed text-[11px]">Tecnologia proprietária de telemetria das balanças rodoviárias TitanX IoT com conexão Cloud integral.</p>
                  </div>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                    <h4 className="font-mono font-black text-amber-400 text-xs">📉 FRAQUEZAS (Weaknesses)</h4>
                    <p className="text-slate-350 leading-relaxed text-[11px]">Altos custos iniciais de importação de processadores ARM Cortex, impactando margens de PCP bruto.</p>
                  </div>
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl space-y-2">
                    <h4 className="font-mono font-black text-[#00E5FF] text-xs">📈 OPORTUNIDADES (Opps)</h4>
                    <p className="text-slate-350 leading-relaxed text-[11px]">Demanda crescente por integração com ERPs de faturamento no agronegócio (Matogrosso/Sul).</p>
                  </div>
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2">
                    <h4 className="font-mono font-black text-rose-400 text-xs">🚨 AMEAÇAS (Threats)</h4>
                    <p className="text-slate-350 leading-relaxed text-[11px]">Imprevisibilidade nas taxas cambiais para faturamento em filiais LatAm e exportações de equipamentos.</p>
                  </div>
                </div>
              )}

              {/* STRATEGIC GOALS TAB */}
              {activeTabGoal === 'Metas' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-400">Faturamento Anual TitanX</span>
                        <span className="text-[10px] p-0.5 bg-sky-500/10 text-sky-400 rounded">CC-101</span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-1">R$ 18.235.400 / R$ 45.000.000</h4>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Progresso Geral S/A</span>
                        <span className="text-[#00E5FF] font-bold">40.5%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00E5FF]" style={{ width: '40.5%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-400">Internacionalização de Canal</span>
                        <span className="text-[10px] p-0.5 bg-purple-500/10 text-purple-400 rounded">US-95</span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-1">12 Parceiros / 15 Parceiros</h4>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Progresso de Distribuição</span>
                        <span className="text-purple-400 font-bold">80%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: '80%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-400">OEE Eficiência Metalúrgica</span>
                        <span className="text-[10px] p-0.5 bg-emerald-500/10 text-emerald-400 rounded">IND-02</span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-1">91.8% OEE / Meta: 95%</h4>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Eficiência de Planta PCP</span>
                        <span className="text-emerald-400 font-bold">96.6%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: '96.6%' }} />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* RISKS COMPLIANCE TABS */}
              {activeTabGoal === 'Riscos' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/20">
                    <span className="p-1 px-1.5 bg-rose-500/15 text-rose-500 text-[10px] font-bold rounded">ALTO RISCO</span>
                    <h4 className="text-white font-extrabold mt-2">Dificuldade cambial em commodities</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-1">Exposição forte das receitas operacionais para o porto de faturamento internacional nos EUA.</p>
                  </div>
                  <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
                    <span className="p-1 px-1.5 bg-amber-500/15 text-amber-400 text-[10px] font-bold rounded">RISCO MODERADO</span>
                    <h4 className="text-white font-extrabold mt-2">Uptime de Webhooks SEFAZ Nacional</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-1">Instabilidades recorrentes no servidor do governo de faturamento do PR podem congelar frotas.</p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                    <span className="p-1 px-1.5 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold rounded">RISCO BAIXO</span>
                    <h4 className="text-white font-extrabold mt-2">Rotatividade Geral de Talentos (Churn)</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-1">Processos internos consolidados e plano de carreira estruturado estabilizaram o headcount.</p>
                  </div>
                </div>
              )}

            </div>
          );
        }

        return null;
      })}

      {/* ENTERPRISE LOG AUDITING TABLE SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-850 pb-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <FileText size={16} className="text-[#00E5FF]" />
              Painel Avançado de Auditoria & Logs de TI (Enterprise S/A)
            </h3>
            <p className="text-[11px] text-slate-400">Rastreabilidade ponta a ponta em tempo real de todas as ações de administradores.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
              <input
                type="text"
                placeholder="Pesquisar nos logs..."
                value={logSearchQuery}
                onChange={e => setLogSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-1.5 pl-8 rounded-lg text-[10px] focus:outline-none focus:border-[#00E5FF]/60 text-slate-200"
              />
            </div>
            
            <button
              onClick={executeRealCsvExport}
              className="p-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <FileSpreadsheet size={11} />
              <span>Exportar Excel/CSV</span>
            </button>
          </div>
        </div>

        {/* COMPACT TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-850">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-850 font-mono text-[9px] uppercase tracking-wider text-slate-400 select-none">
                <th className="p-3 text-center w-12">Det.</th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-900"
                  onClick={() => {
                    setLogSortField('timestamp');
                    setLogSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Horário {logSortField === 'timestamp' && (logSortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th className="p-3">Usuário Autenticado</th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-900"
                  onClick={() => {
                    setLogSortField('module');
                    setLogSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Módulo ERP {logSortField === 'module' && (logSortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th className="p-3">Ação Executada</th>
                <th className="p-3">Endereço IP</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                    Nenhum registro de auditoria corresponde aos critérios de busca.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-950/45 text-[11px] text-slate-300">
                    <td className="p-2 text-center">
                      <button 
                        onClick={() => setSelectedKpiDetail(`audit-${log.id}`)}
                        className="p-1 px-1.5 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 text-[9px] rounded-md font-bold cursor-pointer"
                      >
                        Ver
                      </button>
                    </td>
                    <td className="p-3 font-mono font-bold">{log.timestamp}</td>
                    <td className="p-3 text-slate-400 font-mono">{log.user}</td>
                    <td className="p-3">
                      <span className="p-0.5 px-2 bg-slate-950 border border-slate-850 rounded text-[10px] font-mono leading-none">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-white">{log.action}</td>
                    <td className="p-3 font-mono text-slate-500">{log.ip}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block py-0.5 px-2 rounded-full text-[9px] font-bold font-mono ${
                        log.status === 'Sucesso' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DYNAMIC DRILL-DOWN MODAL / DETAIL DRAWER PORTAL */}
      {selectedKpiDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedKpiDetail(null)} />
          <div className="relative w-full max-w-md bg-slate-950 border-l border-[#00E5FF]/20 text-slate-100 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            
            {/* COMPONENT DRIL DOWN HEADER */}
            <div className="p-6 border-b border-slate-900 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#00E5FF]" />
                <div>
                  <h3 className="text-sm font-extrabold">Explorador de Dados S/A</h3>
                  <p className="text-[9px] font-mono tracking-widest text-[#00E5FF]">DRILL-DOWN ENTERPRISE ATIVO</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedKpiDetail(null)} 
                className="p-1 px-1.5 bg-slate-950 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* EXPLORE FOR EACH CATEGORY */}
            <div className="p-6 flex-grow overflow-y-auto space-y-4">
              {selectedKpiDetail === 'revenue' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Abertura de Margem do Faturamento</h4>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <p className="text-xs text-slate-350 leading-relaxed">
                      Este detalhamento consolida contratos comerciais recorrentes e faturamento SEFAZ B2B das últimas 4 semanas.
                    </p>
                    <div className="space-y-2 border-t border-slate-800 pt-2 text-[11px] font-mono">
                      <div className="flex justify-between">
                        <span>Faturamento Físico PR:</span>
                        <span className="text-white font-bold">R$ 650.000,00</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-950 pt-1.5">
                        <span>Faturamento EUA Export:</span>
                        <span className="text-white font-bold">R$ 845.220,00</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-950 pt-1.5 text-[#00E5FF]">
                        <span>Lucro Bruto Consolidado (74%):</span>
                        <span className="font-bold">R$ 1.365.462,80</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onExport('pdf', 'DRE_Deep_Analysis', dynamicMetrics)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-colors"
                  >
                    Baixar Relatório Executivo Detalhado
                  </button>
                </div>
              )}

              {selectedKpiDetail === 'mrr' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Estatísticas SaaS: MRR, Churn & LTV</h4>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5 text-xs">
                    <p className="text-slate-300">KPIs avançados que atestam a saúde financeira da licença TitanX Cloud.</p>
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="p-2.5 bg-slate-950 rounded-lg">
                        <span className="text-[9px] text-slate-500">MRR GROWTH</span>
                        <p className="text-sm font-bold text-white mt-1">+14.2%</p>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg">
                        <span className="text-[9px] text-slate-500">CHURN RATE</span>
                        <p className="text-sm font-bold text-rose-450 mt-1">{dynamicMetrics.churn}%</p>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg">
                        <span className="text-[9px] text-slate-500">CAC CLIENTES</span>
                        <p className="text-sm font-bold text-amber-400 mt-1">R$ {dynamicMetrics.cac}</p>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-lg">
                        <span className="text-[9px] text-slate-500">LTV MÉDIO</span>
                        <p className="text-sm font-bold text-emerald-400 mt-1">R$ {dynamicMetrics.ltv}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedKpiDetail === 'industrial' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Insumos Críticos Metalúrgicos (COO-PCP)</h4>
                  <p className="text-xs text-slate-400">Detalhamento dos componentes necessários de hardware das balanças:</p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-900 rounded-lg flex justify-between">
                      <span>Placa Integrada Cortex M4:</span>
                      <span className="text-rose-400 font-bold">Estoque Baixo (15 un)</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg flex justify-between">
                      <span>Sensores de Compressão IP68:</span>
                      <span className="text-emerald-400 font-bold">Estoque Seguro (340 un)</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg flex justify-between">
                      <span>Display Titan Touch T500:</span>
                      <span className="text-[#00E5FF] font-bold">Reserva em Trânsito</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedKpiDetail === 'talent' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Estrutura e Custos de Headcount</h4>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
                    <p className="text-slate-300">Gráfico de funcionários ativos por departamento S/A:</p>
                    <div className="space-y-2 font-mono text-[11px]">
                      <div>
                        <div className="flex justify-between mb-1 text-[10px]">
                          <span>PCP Metalúrgica & Engenharia:</span>
                          <span>185 funcionários (52.2%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded bg-slate-950">
                          <div className="h-full bg-sky-500 rounded" style={{ width: '52.2%' }} />
                        </div>
                      </div>
                      <div className="pt-1">
                        <div className="flex justify-between mb-1 text-[10px]">
                          <span>Comercial, Pré-vendas & B2B:</span>
                          <span>94 funcionários (26.5%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded">
                          <div className="h-full bg-purple-500 rounded" style={{ width: '26.5%' }} />
                        </div>
                      </div>
                      <div className="pt-1">
                        <div className="flex justify-between mb-1 text-[10px]">
                          <span>Administração, TI & Compliance:</span>
                          <span>75 funcionários (21.3%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded">
                          <div className="h-full bg-[#00E5FF] rounded" style={{ width: '21.3%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedKpiDetail === 'efficiency' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Cálculos OEE e SLA Operacional</h4>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5 text-xs leading-relaxed">
                    <p className="text-slate-305">Projetado com base técnica da fundição automatizada das balanças e suporte de chamados de TI.</p>
                    <div className="space-y-2 border-t border-slate-850 pt-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span>Disponibilidade Mecânica:</span>
                        <span className="text-emerald-400 font-bold">94.8%</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-950 pt-2">
                        <span>Eficiência de Cadência:</span>
                        <span className="text-[#00E5FF] font-bold">97.2%</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-950 pt-2">
                        <span>Índice de Qualidade (IP69):</span>
                        <span className="text-emerald-400 font-bold">99.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AUDIT LOG DRILL-DOWN BLOCK */}
              {selectedKpiDetail.startsWith('audit-') && (
                <div className="space-y-4">
                  <h4 className="text-sm font-extrabold text-white">Inspeção Detalhada de Transação de Auditoria</h4>
                  {(() => {
                    const matched = mockActivityLogs.find(l => `audit-${l.id}` === selectedKpiDetail);
                    if (!matched) return <p className="text-xs text-rose-450 font-mono">Erro: Log não correspondido.</p>;
                    return (
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-mono text-xs text-slate-300">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">HASH UUID REGISTRO</span>
                          <span className="text-white font-bold">{matched.id}-SEC-X9</span>
                        </div>
                        <div className="border-t border-slate-850 pt-2">
                          <span className="text-[10px] text-slate-500 uppercase block">AUTOR / OPERADOR</span>
                          <span className="text-[#00E5FF] font-black">{matched.user}</span>
                        </div>
                        <div className="border-t border-slate-850 pt-2">
                          <span className="text-[10px] text-slate-500 uppercase block">AÇÃO CRIPTOGRAFADA</span>
                          <span className="text-white">{matched.action}</span>
                        </div>
                        <div className="border-t border-slate-850 pt-2">
                          <span className="text-[10px] text-slate-500 uppercase block">PROVEDOR IP AUDITÁVEL</span>
                          <span className="text-white">{matched.ip}</span>
                        </div>
                        <div className="border-t border-slate-850 pt-2">
                          <span className="text-[10px] text-slate-500 uppercase block">COMPLIANCE REGULATÓRIO</span>
                          <span className="text-emerald-400 font-bold">Aprovado sob auditoria interna de conformidade</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-[10px] text-amber-500/80 leading-relaxed font-mono flex items-center gap-1.5">
                <ShieldAlert size={14} className="shrink-0 animate-bounce" />
                Esta visualização conta com proteção de telemetria TitanX ActiveGuard.
              </div>

            </div>

            {/* CLOSING BUTTON */}
            <div className="p-4 border-t border-slate-900 bg-slate-900 flex justify-end">
              <button 
                onClick={() => setSelectedKpiDetail(null)}
                className="p-2 px-5 bg-gradient-to-r from-sky-505 to-indigo-600 bg-indigo-600 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-transform"
              >
                Retornar ao Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FILTER DRAWER PANEL BINDING */}
      <AdvancedFilters 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

    </div>
  );
}
