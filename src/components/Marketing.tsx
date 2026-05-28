import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  PieChart,
  Tv,
  Target,
  Sparkles,
  RefreshCw,
  Mail,
  Coins
} from 'lucide-react';
import { MarketingCampaign } from '../types';
import { defaultCampaigns } from '../data/mockData';

export interface MarketingProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

export default function Marketing({ searchText, onExport }: MarketingProps) {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(defaultCampaigns);
  const [showAddModal, setShowAddModal] = useState(false);

  // NEWSLETTER MOCK BROADCASTER STATE
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<'Clientes' | 'Prospects B2B' | 'Inativos'>('Prospects B2B');
  const [sentAlert, setSentAlert] = useState(false);

  // ADD CAMPAIGN FORM
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState<number>(0);
  const [newChannels, setNewChannels] = useState('LinkedIn Ads');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newBudget <= 0) return;

    const newCamp: MarketingCampaign = {
      id: `cmp-${Date.now()}`,
      name: newName,
      channels: [newChannels],
      budget: newBudget,
      spent: 0,
      leadsGenerated: 0,
      conversions: 0,
      status: 'Planejada',
      roi: 0
    };

    setCampaigns([newCamp, ...campaigns]);
    setNewName('');
    setNewBudget(0);
    setShowAddModal(false);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle) return;

    setSentAlert(true);
    setTimeout(() => {
      setSentAlert(false);
      setShowSegmentModal(false);
      setNewsTitle('');
    }, 2500);
  };

  const filteredCampaigns = campaigns.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.channels.join(' ').toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const totalSpent = campaigns.reduce((acc, curr) => acc + curr.spent, 0);
  const totalLeads = campaigns.reduce((acc, curr) => acc + curr.leadsGenerated, 0);
  const avgRoi = campaigns.filter(c => c.roi > 0).reduce((acc, curr, _, array) => acc + curr.roi / array.length, 0);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Marketing & Gestão de ROI/ROAS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão integrada de orçamento publicitário, leads convertidos por canal de branding e retornos financeiros.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSegmentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#00E5FF]/30 hover:border-[#00E5FF]/60 bg-[#00E5FF]/5 hover:bg-[#00E5FF]/10 text-xs font-bold text-[#00E5FF] rounded-xl cursor-pointer transition-all"
          >
            <Send size={13} /> Broadcaster de Leads (Email)
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-650 hover:from-orange-600 hover:to-amber-700 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Criar Campanha Mkt
          </button>
        </div>
      </div>

      {/* METRIC ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* INVESTIDO */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Investimento Alocado</span>
            <div className="text-lg font-bold text-slate-850 dark:text-white font-mono">
              R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg">
            <Coins size={18} />
          </div>
        </div>

        {/* LEADS GERADOS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Leads Captados (ROI)</span>
            <div className="text-lg font-bold text-sky-500 font-mono">
              {totalLeads} Contatos
            </div>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-lg">
            <Target size={18} />
          </div>
        </div>

        {/* RETORNO ROI MEDIO */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Roi Médio Global</span>
            <div className="text-lg font-bold text-emerald-500 font-mono flex items-center gap-1">
              {avgRoi.toFixed(1)}x <span className="text-xs font-sans font-normal text-slate-400">multiplicador</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <PieChart size={18} />
          </div>
        </div>
      </div>

      {/* CORE DISPLAY TABLE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden min-h-[300px]">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
          <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 flex items-center gap-2">
            <Megaphone size={14} className="text-orange-500" /> Campanhas Ativas & Custo Conversão
          </h2>
        </div>

        <div className="p-5">
          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-650 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                <tr>
                  <th className="p-3">Campanha</th>
                  <th className="p-3">Canais de Atuação</th>
                  <th className="p-3 text-right font-semibold">Budget (Total)</th>
                  <th className="p-3 text-right">Gasto</th>
                  <th className="p-3 text-center">Leads</th>
                  <th className="p-3 text-center">ROI</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      Nenhuma campanha encontrada sob esta pesquisa.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{c.name}</td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {c.channels.map((ch, idx) => (
                            <span key={idx} className="p-0.5 px-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-semibold">{ch}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-white">
                        R$ {c.budget.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-500">
                        R$ {c.spent.toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-sky-500">{c.leadsGenerated}</td>
                      <td className="p-3 text-center font-mono text-emerald-500 font-bold">{c.roi > 0 ? `${c.roi}x` : 'N/A'}</td>
                      <td className="p-3">
                        <span className={`inline-block border text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'Ativa' ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-500' :
                          c.status === 'Planejada' ? 'bg-amber-500/10 border-amber-500/35 text-amber-500' : 'bg-slate-500/10 border-slate-500/35 text-slate-500'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL NEWSLETTER SEGMENT BROADCASTER */}
      {showSegmentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900 font-sans flex items-center gap-1.5">
              <Mail size={16} className="text-[#00E5FF]" /> Broadcaster Segmentado de Leads
            </h2>

            {sentAlert ? (
              <div className="p-10 text-center space-y-3 flex flex-col items-center justify-center text-xs">
                <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <Send size={18} />
                </div>
                <h3 className="font-bold text-slate-850 dark:text-slate-100">Broadcasting Disparado!</h3>
                <p className="text-slate-400">E-mailings em fila de envio para o segmento {selectedSegment}.</p>
              </div>
            ) : (
              <form onSubmit={handleBroadcast} className="space-y-4 mt-4 text-xs font-medium">
                <p className="text-slate-500 leading-normal">
                  Selecione o filtro de segmentação de leads captados nas landing pages para disparo automatizado de informativos com assinatura da marca.
                </p>

                <div className="space-y-1">
                  <label className="text-slate-500">Tag de Segmento</label>
                  <select
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value as any)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none"
                  >
                    <option value="Prospects B2B">Prospects B2B (145 Contatos)</option>
                    <option value="Clientes">Clientes Ativos (82 Contatos)</option>
                    <option value="Inativos">Inativos (34 Contatos)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Título do E-mail / Assunto</label>
                  <input
                    type="text"
                    required
                    placeholder="Inovações em Pesagem Industrial - Conectando TitanX IoT"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>

                <input type="submit" value="Enviar Broadcaster" className="w-full bg-[#00E5FF] font-bold text-slate-950 py-2.5 rounded-lg cursor-pointer transition-all text-center block text-xs" />

                <button
                  type="button"
                  onClick={() => setShowSegmentModal(false)}
                  className="w-full text-center py-2 text-slate-500 hover:text-slate-700 hover:underline cursor-pointer bg-transparent"
                >
                  Cancelar Operação
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900">
              Registrar Campanha de Marketing
            </h2>

            <form onSubmit={handleCreateCampaign} className="space-y-4 mt-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-500">Nome da Campanha</label>
                <input
                  type="text"
                  required
                  placeholder="Lançamento SaaS v3"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Canal Principal</label>
                  <select
                    value={newChannels}
                    onChange={(e) => setNewChannels(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="LinkedIn Ads">LinkedIn Ads</option>
                    <option value="Google Ads Search">Google Ads Search</option>
                    <option value="E-mail marketing">E-mail marketing</option>
                    <option value="Agências Parceiras">Agências Parceiras</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Budget Alocado (R$)</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={newBudget === 0 ? '' : newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <input type="submit" value="Salvar no Planejamento" className="w-full bg-orange-600 hover:bg-orange-750 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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
