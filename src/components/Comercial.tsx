import React, { useState } from 'react';
import {
  Users,
  Plus,
  Compass,
  DollarSign,
  Briefcase,
  ChevronRight,
  TrendingUp,
  UserCheck2,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { Lead, BrandContract } from '../types';
import { defaultLeads, defaultContracts } from '../data/mockData';

export interface ComercialProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

export default function Comercial({ searchText, onExport }: ComercialProps) {
  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [contracts, setContracts] = useState<BrandContract[]>(defaultContracts);

  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'contratos'>('pipeline');
  const [showAddLead, setShowAddLead] = useState(false);

  // ADD LEAD FORM
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newValue, setNewValue] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<Lead['status']>('Contato Inicial');
  const [newEmail, setNewEmail] = useState('');

  const stages: Lead['status'][] = [
    'Contato Inicial',
    'Proposta Enviada',
    'Em Negociação',
    'Ganha',
    'Perdida'
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompany || newValue <= 0) return;

    const newLd: Lead = {
      id: `led-${Date.now()}`,
      name: newName,
      company: newCompany,
      value: newValue,
      status: newStatus,
      email: newEmail || 'lead@empresa.com.br',
      phone: '(11) 94002-8922',
      assignedTo: 'Carlos Eduardo (Comercial)',
      lastContact: new Date().toISOString().split('T')[0]
    };

    setLeads([newLd, ...leads]);
    setNewName('');
    setNewCompany('');
    setNewValue(0);
    setShowAddLead(false);
  };

  const handleMoveStage = (id: string, currentStatus: Lead['status'], direction: 'next' | 'prev') => {
    const idx = stages.indexOf(currentStatus);
    let targetIdx = idx;
    if (direction === 'next' && idx < stages.length - 1) {
      targetIdx = idx + 1;
    } else if (direction === 'prev' && idx > 0) {
      targetIdx = idx - 1;
    }

    if (targetIdx !== idx) {
      setLeads(
        leads.map((l) => (l.id === id ? { ...l, status: stages[targetIdx] } : l))
      );
    }
  };

  const filteredLeads = leads.filter((l) => {
    return (
      l.name.toLowerCase().includes(searchText.toLowerCase()) ||
      l.company.toLowerCase().includes(searchText.toLowerCase()) ||
      l.assignedTo.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const pipelineValue = leads
    .filter((l) => l.status !== 'Perdida')
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Módulo Comercial & CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão integrada de leads corporativos, de negócios concorrente de benta, funis de conversão de pipeline e contratos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddLead(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-755 hover:to-rose-755 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Novo Lead de Vendas
          </button>
          <button
            onClick={() => onExport('xlsx', 'Comercial CRM Leads', leads)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold rounded-xl text-slate-650 dark:text-slate-350 cursor-pointer"
          >
            Exportar Leads S/A
          </button>
        </div>
      </div>

      {/* KPIS PANELS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PIPELINE TOTAL */}
        <div className="glass-card hover:border-pink-500/45 hover:glow-purple rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 h-12 w-12 bg-pink-500/5 blur-lg rounded-full" />
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider font-mono">Volumetria Pipeline CRM</span>
            <div className="text-lg font-black text-pink-400 font-mono">
              R$ {pipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-pink-500/15 text-pink-400 border border-pink-500/20 rounded-xl group-hover:scale-105 transition-all z-10">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* NEGOCIOS ATIVOS */}
        <div className="glass-card hover:border-cyan-500/40 hover:glow-cyan rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 h-12 w-12 bg-indigo-500/5 blur-lg rounded-full" />
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider font-mono">Leads em Negociação</span>
            <div className="text-lg font-black text-white font-mono">
              {leads.filter(l => l.status === 'Em Negociação' || l.status === 'Proposta Enviada').length} Ativos
            </div>
          </div>
          <div className="p-3 bg-indigo-500/15 text-[#00E5FF] border border-[#00E5FF]/20 rounded-xl group-hover:scale-105 transition-all z-10">
            <Users size={18} />
          </div>
        </div>

        {/* VALOR DE CONTRATOS */}
        <div className="glass-card hover:border-emerald-500/40 hover:glow-emerald rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 h-12 w-12 bg-emerald-500/5 blur-lg rounded-full" />
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider font-mono">Receita Recorrente Contratada</span>
            <div className="text-lg font-black text-emerald-400 font-mono">
              R$ {contracts.reduce((acc, curr) => acc + curr.value, 0).toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-xl group-hover:scale-105 transition-all z-10">
            <Briefcase size={18} />
          </div>
        </div>
      </div>

      {/* CORE SUBTABS CONTROLLER */}
      <div className="glass-card overflow-hidden min-h-[400px]">
        {/* SWITCH TABS */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 px-3 py-2 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeSubTab === 'pipeline' ? 'bg-white dark:bg-slate-800 text-pink-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Pipeline CRM (Kanban de Vendas)
          </button>
          <button
            onClick={() => setActiveSubTab('contratos')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
              activeSubTab === 'contratos' ? 'bg-white dark:bg-slate-800 text-pink-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Carteira de Contratos Jurídicos
          </button>
        </div>

        {/* TAB 1: KANBAN CRM PIPELINE */}
        {activeSubTab === 'pipeline' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
              {stages.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.status === stage);
                const stageSum = stageLeads.reduce((acc, curr) => acc + curr.value, 0);

                return (
                  <div key={stage} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900/60 p-4 rounded-xl space-y-4 flex flex-col min-w-[200px] max-h-[500px]">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-2">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{stage}</span>
                        <span className="text-[9px] font-mono font-semibold text-slate-450">R$ {stageSum.toLocaleString('pt-BR')}</span>
                      </div>
                      <span className="h-5 w-5 bg-slate-200 dark:bg-slate-850 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0 select-none">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto pr-0.5 scrollbar-thin">
                      {stageLeads.length === 0 ? (
                        <div className="text-[10px] p-4 text-center border border-dashed border-slate-200 dark:border-slate-850 text-slate-400 rounded-lg">
                          Sem negócios.
                        </div>
                      ) : (
                        stageLeads.map((item) => (
                          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 rounded-lg shadow-sm space-y-2.5 relative group">
                            <div className="flex flex-col leading-tight">
                              <span className="font-bold text-slate-800 dark:text-slate-200 max-w-[150px] truncate">{item.company}</span>
                              <span className="text-[10px] text-slate-400 truncate mt-0.5">{item.name}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono font-bold text-sky-500">R$ {item.value.toLocaleString()}</span>
                            </div>

                            {/* MOVE BUTTONS */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex justify-between gap-1">
                              {stage !== 'Contato Inicial' && (
                                <button
                                  onClick={() => handleMoveStage(item.id, item.status, 'prev')}
                                  className="p-1 px-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-[9px] font-semibold text-slate-500 rounded cursor-pointer transition-colors"
                                >
                                  Retornar
                                </button>
                              )}
                              {stage !== 'Perdida' && (
                                <button
                                  onClick={() => handleMoveStage(item.id, item.status, 'next')}
                                  className="p-1 px-2 bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border border-pink-500/10 hover:border-pink-500/30 text-[9px] font-bold rounded cursor-pointer ml-auto transition-colors"
                                >
                                  Avançar
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE CLIENT CONTRACTS */}
        {activeSubTab === 'contratos' && (
          <div className="p-5 space-y-4">
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-650 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Ref Código</th>
                    <th className="p-3">Cliente / Contratada</th>
                    <th className="p-3 text-right">Valor Consolidado</th>
                    <th className="p-3">Vigência Inicial</th>
                    <th className="p-3">Término de Vigência</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                  {contracts.map((ct) => (
                    <tr key={ct.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-mono font-bold text-pink-600 dark:text-pink-400">{ct.code}</td>
                      <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">{ct.client}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-white">
                        R$ {ct.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-slate-400 font-mono">{ct.startDate}</td>
                      <td className="p-3 text-slate-400 font-mono">{ct.endDate}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                          ct.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25' : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
                        }`}>
                          {ct.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD LEAD POPUP BOX */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900">
              Registrar Negociação (Lead CRM)
            </h2>

            <form onSubmit={handleCreateLead} className="space-y-4 mt-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-500">Razão Social / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Klabin Embalagens S.A."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Nome do Contato</label>
                  <input
                    type="text"
                    required
                    placeholder="Liana Vasconcellos"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">Proposta Estimada (R$)</label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={newValue === 0 ? '' : newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">E-mail Corporativo</label>
                  <input
                    type="email"
                    placeholder="liana.v@klabin.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">Estágio Inicial</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Lead['status'])}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none cursor-pointer font-semibold"
                  >
                    <option value="Contato Inicial">Contato Inicial</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Em Negociação">Em Negociação</option>
                  </select>
                </div>
              </div>

              <input type="submit" value="Criar Oportunidade" className="w-full bg-pink-650 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

              <button
                type="button"
                onClick={() => setShowAddLead(false)}
                className="w-full text-center py-2 text-slate-500 hover:text-slate-700 hover:underline cursor-pointer bg-transparent"
              >
                Cancelar Operação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
