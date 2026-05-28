import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Settings,
  Sparkles,
  Eye,
  RefreshCw,
  Sliders,
  BookmarkCheck
} from 'lucide-react';

export interface FilterState {
  empresa: string[];
  filial: string[];
  departamento: string[];
  centroCusto: string[];
  periodo: string;
  status: string[];
  regiao: string[];
  projeto: string[];
  responsavel: string[];
  categoria: string[];
  cliente: string[];
  produto: string[];
  equipe: string[];
  tipoOperacao: string[];
}

export const initialFilters: FilterState = {
  empresa: [],
  filial: [],
  departamento: [],
  centroCusto: [],
  periodo: '30d',
  status: [],
  regiao: [],
  projeto: [],
  responsavel: [],
  categoria: [],
  cliente: [],
  produto: [],
  equipe: [],
  tipoOperacao: []
};

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const companyOptions = ['TitanX Holding S/A', 'TitanX S/A - Indústria', 'TitanX Logística Global Ltda', 'TitanX Agronegócio S/A'];
const branchOptions = ['Matriz SP', 'Filial RJ', 'Filial Sul (Blumenau)', 'Filial PR (Curitiba)', 'Global Delaware (USA)', 'LatAm Hub (Bogotá)'];
const deptOptions = ['Diretoria', 'Financeiro', 'RH', 'Comercial', 'Marketing', 'Logística', 'Industrial', 'Produção', 'TI', 'Projetos'];
const costCenters = ['CC-101 Industrial', 'CC-202 Administrativo', 'CC-303 Comercial', 'CC-404 P&D', 'CC-505 Logística'];
const statusOptions = ['Ativo', 'Inativo', 'Pendente', 'Concluído', 'Crítico', 'Suficiente', 'Alerta', 'Aprovado', 'Rejeitado'];
const regionOptions = ['Sudeste', 'Sul', 'Nordeste', 'Norte', 'Centro-Oeste', 'EUA', 'Europa', 'LatAm'];
const projectOptions = ['SaaS TitanX Cloud IoT', 'Migração Nuvem Infra', 'Plataforma Web ERP v2', 'Automação Balança Integrada'];
const ownerOptions = ['Leonardo Albuquerque', 'Beatriz Vasconcelos', 'Patrícia Sales', 'Adilson Silveira', 'Roberto Antunes', 'Mariana Souza'];
const categoryOptions = ['Estoque de Vendas', 'Custos de Produção', 'Vendas Corporativas', 'Salários e Encargos', 'Infraestrutura Cloud', 'Suplementação B2B'];
const clientOptions = ['Ambev', 'Vale S/A', 'Gerdau', 'Petrobras', 'Stara Máquinas', 'Usiminas'];
const productOptions = ['Balança Rodoviária TitanX-V3', 'Balança Industrial TitanX X500', 'Indicador Digital TitanX Touch T500', 'Firmware IoT Core'];
const teamOptions = ['Metalurgia Team', 'Devs Cloud', 'Vendas Internas', 'Sucesso do Cliente', 'RH Consultivo'];
const operationOptions = ['Faturamento Nacional', 'Importação Insumos', 'Exportação Equipamento', 'Prestação de Serviço'];

export default function AdvancedFilters({ onApplyFilters, isOpen, onClose }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeSection, setActiveSection] = useState<string | null>('geral');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedFavorites, setSavedFavorites] = useState<{name: string, filter: FilterState}[]>([
    {
      name: 'Painel CFO - Auditoria Consolidada',
      filter: {
        ...initialFilters,
        empresa: ['TitanX Holding S/A'],
        departamento: ['Financeiro'],
        periodo: '30d',
        status: ['Aprovado']
      }
    },
    {
      name: 'PCP Fábrica - Status Crítico',
      filter: {
        ...initialFilters,
        empresa: ['TitanX S/A - Indústria'],
        departamento: ['Industrial', 'Produção'],
        status: ['Crítico', 'Alerta'],
        periodo: '7d'
      }
    }
  ]);
  const [newFavoriteName, setNewFavoriteName] = useState('');

  const toggleMultiSelect = (key: keyof FilterState, value: string) => {
    // periods are single select, other fields are multi select arrays
    if (key === 'periodo') {
      setFilters(prev => ({ ...prev, periodo: value }));
      return;
    }

    const currentArray = filters[key] as string[];
    if (currentArray.includes(value)) {
      setFilters(prev => ({
        ...prev,
        [key]: currentArray.filter(item => item !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: [...currentArray, value]
      }));
    }
  };

  const handleClearAll = () => {
    setFilters(initialFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const savePreset = () => {
    if (!newFavoriteName.trim()) return;
    setSavedFavorites(prev => [...prev, { name: newFavoriteName, filter: { ...filters } }]);
    setNewFavoriteName('');
  };

  const loadPreset = (preset: FilterState) => {
    setFilters(preset);
  };

  const filterList = (options: string[]) => {
    if (!searchTerm) return options;
    return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* BACKDROP GLASS */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* FILTER DRAWER PANEL */}
      <div className="relative w-full max-w-lg bg-slate-900 border-l border-[#00E5FF]/20 text-slate-100 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#00E5FF]/15 border border-[#00E5FF]/30 rounded-xl text-[#00E5FF]">
              <Filter size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Filtros Inteligentes S/A</h2>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#00E5FF]/80">TITANX CORPORATE ENGINE</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-white transition-all text-slate-400 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* INTEGRATED INTELLIGENT AUTO-CHIPS VIEW */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 text-xs flex flex-wrap gap-1.5 items-center max-h-24 overflow-y-auto">
          <span className="text-[10px] font-mono uppercase text-slate-505 font-bold tracking-wider">Ativos:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (key === 'periodo') {
              return (
                <span key={key} className="inline-flex items-center gap-1 bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 rounded-full text-[10px] border border-[#00E5FF]/20 font-mono">
                  Período: {value}
                </span>
              );
            }
            const arr = value as string[];
            return arr.map(val => (
              <span key={val} className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full text-[10px] border border-indigo-500/20 font-sans">
                {val}
                <button onClick={() => toggleMultiSelect(key as keyof FilterState, val)} className="hover:text-white cursor-pointer ml-0.5">
                  <X size={8} />
                </button>
              </span>
            ));
          })}
          {Object.values(filters).every(v => v === '30d' || (Array.isArray(v) && v.length === 0)) && (
            <span className="text-slate-500 italic text-[10px]">Utilizando visão padrão dos últimos 30 dias</span>
          )}
        </div>

        {/* SEARCH FILTER BOX */}
        <div className="px-6 py-3 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Pesquisar opções em tempo real..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-[#00E5FF]/50 p-2 pl-9 rounded-xl focus:outline-none text-xs text-slate-200 placeholder-slate-600 transition-all font-sans"
            />
          </div>
        </div>

        {/* MAIN BODY SCROLLABLE OPTIONS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* QUICK FAVORITE CONFIG PRESETS */}
          <div>
            <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-1 rounded text-slate-400 font-bold border border-slate-850">Visões Favoritas & Perfil de Diretor</span>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {savedFavorites.map((fav, index) => (
                <button
                  key={index}
                  onClick={() => loadPreset(fav.filter)}
                  className="flex items-center justify-between p-2.5 bg-slate-950/20 border border-slate-800/80 hover:border-[#00E5FF]/30 rounded-xl cursor-pointer text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <BookmarkCheck size={14} className="text-amber-500" />
                    <span className="text-[11px] font-medium text-slate-300 group-hover:text-[#00E5FF] transition-colors">{fav.name}</span>
                  </div>
                  <Sparkles size={11} className="text-indigo-500" />
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center mt-3">
              <input 
                type="text" 
                placeholder="Título da sua Visão..." 
                value={newFavoriteName}
                onChange={e => setNewFavoriteName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-850 p-1.5 px-3 rounded-lg text-[10px] focus:outline-none focus:border-[#00E5FF]/50 text-slate-200"
              />
              <button 
                onClick={savePreset}
                className="p-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
              >
                <Star size={10} fill="currentColor" /> Salvar Filtro
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Filtros Operacionais Gerais</span>
            
            {/* ACCORDION ITEMS */}
            <div className="space-y-2 mt-2">
              
              {/* TIMEFRAME */}
              <div className="border border-slate-800 bg-slate-950/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveSection(activeSection === 'periodo' ? null : 'periodo')}
                  className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-300 hover:bg-slate-950/40"
                >
                  <span className="flex items-center gap-1.5">⏰ Período e Horizonte Temporal</span>
                  {activeSection === 'periodo' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {activeSection === 'periodo' && (
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px]">
                    {['hoje', 'ontem', '7d', '30d', 'ano_corrente'].map((p) => (
                      <button
                        key={p}
                        onClick={() => toggleMultiSelect('periodo', p)}
                        className={`p-2 rounded-lg border text-left font-bold cursor-pointer transition-all ${
                          filters.periodo === p 
                            ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]' 
                            : 'border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        {p === 'hoje' ? 'Hoje' : p === 'ontem' ? 'Ontem' : p === '7d' ? 'Últimos 7 dias' : p === '30d' ? 'Últimos 30 dias' : 'Ano de Exercício'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CORPORATE COMPANIES OR HOLDRING */}
              <div className="border border-slate-800 bg-slate-950/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveSection(activeSection === 'empresa' ? null : 'empresa')}
                  className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-300 hover:bg-slate-950/40"
                >
                  <span className="flex items-center gap-1.5">🏢 Empresas TitanX</span>
                  {activeSection === 'empresa' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {activeSection === 'empresa' && (
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 space-y-1 max-h-48 overflow-y-auto">
                    {filterList(companyOptions).map((co) => (
                      <button
                        key={co}
                        onClick={() => toggleMultiSelect('empresa', co)}
                        className="w-full text-left p-1.5 hover:bg-slate-900 rounded flex items-center gap-2 text-[10px]"
                      >
                        <div className={`h-3 w-3 rounded font-mono font-black text-[8px] flex items-center justify-center ${
                          filters.empresa.includes(co) ? 'bg-[#00E5FF]/25 border border-[#00E5FF] text-[#00E5FF]' : 'border border-slate-850 text-transparent'
                        }`}>✔</div>
                        <span className={filters.empresa.includes(co) ? 'text-white font-bold' : 'text-slate-400'}>{co}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* BRANCHES (FILIAIS) */}
              <div className="border border-slate-800 bg-slate-950/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveSection(activeSection === 'filial' ? null : 'filial')}
                  className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-300 hover:bg-slate-950/40"
                >
                  <span className="flex items-center gap-1.5">📍 Filiais Ativas</span>
                  {activeSection === 'filial' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {activeSection === 'filial' && (
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 space-y-1 max-h-48 overflow-y-auto">
                    {filterList(branchOptions).map((br) => (
                      <button
                        key={br}
                        onClick={() => toggleMultiSelect('filial', br)}
                        className="w-full text-left p-1.5 hover:bg-slate-900 rounded flex items-center gap-2 text-[10px]"
                      >
                        <div className={`h-3 w-3 rounded font-mono font-black text-[8px] flex items-center justify-center ${
                          filters.filial.includes(br) ? 'bg-[#00E5FF]/25 border border-[#00E5FF] text-[#00E5FF]' : 'border border-slate-850 text-transparent'
                        }`}>✔</div>
                        <span className={filters.filial.includes(br) ? 'text-white font-bold' : 'text-slate-400'}>{br}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DEPARTMENTS */}
              <div className="border border-slate-800 bg-slate-950/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveSection(activeSection === 'dept' ? null : 'dept')}
                  className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-300 hover:bg-slate-950/40"
                >
                  <span className="flex items-center gap-1.5">⚙ Departamentos & Centro de Custo</span>
                  {activeSection === 'dept' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {activeSection === 'dept' && (
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider">Departamentos:</p>
                      {filterList(deptOptions).map((dp) => (
                        <button
                          key={dp}
                          onClick={() => toggleMultiSelect('departamento', dp)}
                          className="w-full text-left p-1 rounded flex items-center gap-2 text-[10px]"
                        >
                          <div className={`h-3 w-3 rounded flex items-center justify-center ${
                            filters.departamento.includes(dp) ? 'bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF]' : 'border border-slate-850'
                          }`}>✔</div>
                          <span className={filters.departamento.includes(dp) ? 'text-white font-bold' : 'text-slate-405'}>{dp}</span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1 border-t border-slate-900 pt-2">
                      <p className="text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider">Centro de Custo:</p>
                      {filterList(costCenters).map((cc) => (
                        <button
                          key={cc}
                          onClick={() => toggleMultiSelect('centroCusto', cc)}
                          className="w-full text-left p-1 rounded flex items-center gap-2 text-[10px]"
                        >
                          <div className={`h-3 w-3 rounded flex items-center justify-center ${
                            filters.centroCusto.includes(cc) ? 'bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF]' : 'border border-slate-850'
                          }`}>✔</div>
                          <span className={filters.centroCusto.includes(cc) ? 'text-white font-bold' : 'text-slate-405'}>{cc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* REGION */}
              <div className="border border-slate-800 bg-slate-950/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveSection(activeSection === 'regiao' ? null : 'regiao')}
                  className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-300 hover:bg-slate-950/40"
                >
                  <span className="flex items-center gap-1.5">🌐 Escopo Geográfico (Região)</span>
                  {activeSection === 'regiao' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {activeSection === 'regiao' && (
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 space-y-1 max-h-48 overflow-y-auto">
                    {filterList(regionOptions).map((rg) => (
                      <button
                        key={rg}
                        onClick={() => toggleMultiSelect('regiao', rg)}
                        className="w-full text-left p-1.5 hover:bg-slate-900 rounded flex items-center gap-2 text-[10px]"
                      >
                        <div className={`h-3 w-3 rounded flex items-center justify-center ${
                          filters.regiao.includes(rg) ? 'bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF]' : 'border border-slate-850'
                        }`}>✔</div>
                        <span className={filters.regiao.includes(rg) ? 'text-white font-bold' : 'text-slate-400'}>{rg}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DETAILED FILTERS ACCORDION */}
              <div className="border border-slate-800 bg-slate-950/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveSection(activeSection === 'suprimentos' ? null : 'suprimentos')}
                  className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-300 hover:bg-slate-950/40"
                >
                  <span className="flex items-center gap-1.5">📦 Suprimentos, Cliente & Produto</span>
                  {activeSection === 'suprimentos' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {activeSection === 'suprimentos' && (
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono uppercase text-[#00E5FF] font-bold">Clientes Holding:</p>
                      {filterList(clientOptions).map((cl) => (
                        <button key={cl} onClick={() => toggleMultiSelect('cliente', cl)} className="w-full text-left p-1 rounded flex items-center gap-2 text-[10px]">
                          <div className={`h-3 w-3 rounded flex items-center justify-center ${filters.cliente.includes(cl) ? 'bg-sky-500/20 border border-sky-500 text-sky-400' : 'border border-slate-850'}`}>✔</div>
                          <span>{cl}</span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1 border-t border-slate-900 pt-2">
                      <p className="text-[9px] font-mono uppercase text-[#00E5FF] font-bold">Produtos Fabricados:</p>
                      {filterList(productOptions).map((pr) => (
                        <button key={pr} onClick={() => toggleMultiSelect('produto', pr)} className="w-full text-left p-1 rounded flex items-center gap-2 text-[10px]">
                          <div className={`h-3 w-3 rounded flex items-center justify-center ${filters.produto.includes(pr) ? 'bg-sky-500/20 border border-sky-500 text-sky-400' : 'border border-slate-850'}`}>✔</div>
                          <span>{pr}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SYSTEM STATUS */}
              <div className="border border-slate-800 bg-slate-950/20 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveSection(activeSection === 'status' ? null : 'status')}
                  className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-300 hover:bg-slate-950/40"
                >
                  <span className="flex items-center gap-1.5">⚖ Status Operacional / Alertas</span>
                  {activeSection === 'status' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {activeSection === 'status' && (
                  <div className="p-3 bg-slate-950/40 border-t border-slate-800 space-y-1 max-h-48 overflow-y-auto">
                    {filterList(statusOptions).map((st) => (
                      <button
                        key={st}
                        onClick={() => toggleMultiSelect('status', st)}
                        className="w-full text-left p-1.5 hover:bg-slate-900 rounded flex items-center gap-2 text-[10px]"
                      >
                        <div className={`h-3 w-3 rounded flex items-center justify-center ${
                          filters.status.includes(st) ? 'bg-[#00E5FF]/20 border border-[#00E5FF] text-[#00E5FF]' : 'border border-slate-850'
                        }`}>✔</div>
                        <span className={filters.status.includes(st) ? 'text-white font-bold' : 'text-slate-400'}>{st}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
          <button 
            onClick={handleClearAll}
            className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-transparent"
          >
            <RefreshCw size={12} /> Limpar Filtros
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-black shadow-[0_4px_15px_rgba(0,132,199,0.35)] cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Check size={14} /> Aplicar Visão Ativa
          </button>
        </div>

      </div>
    </div>
  );
}
