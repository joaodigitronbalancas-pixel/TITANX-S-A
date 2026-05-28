import React, { useState } from 'react';
import {
  Code2,
  Plus,
  Compass,
  FileCheck2,
  Bug,
  Tag,
  GitBranch,
  Rocket,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ReleaseItem } from '../types';
import { defaultReleases } from '../data/mockData';

export interface DesenvolvimentoProps {
  searchText: string;
}

export default function Desenvolvimento({ searchText }: DesenvolvimentoProps) {
  const [releases, setReleases] = useState<ReleaseItem[]>(defaultReleases);
  const [showAddModal, setShowAddModal] = useState(false);

  // NEW RELEASE FORM
  const [newVer, setNewVer] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReleaseItem['type']>('Feature');

  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVer || !newTitle) return;

    const newRel: ReleaseItem = {
      id: `rel-${Date.now()}`,
      version: newVer,
      title: newTitle,
      type: newType,
      status: 'Backlog',
      milestone: 'Sprint 25 - Estabilização Geral',
      percentage: 0
    };

    setReleases([newRel, ...releases]);
    setNewVer('');
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleUpdatePercentage = (id: string, currentPct: number) => {
    const nextPct = currentPct === 100 ? 100 : Math.min(currentPct + 15, 100);
    const nextStatus: ReleaseItem['status'] = nextPct === 100 ? 'Deployado' : 'Em Dev';
    setReleases(
      releases.map((r) => (r.id === id ? { ...r, percentage: nextPct, status: nextStatus } : r))
    );
  };

  const filteredReleases = releases.filter((r) => {
    return (
      r.title.toLowerCase().includes(searchText.toLowerCase()) ||
      r.version.toLowerCase().includes(searchText.toLowerCase()) ||
      r.milestone.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            P&D & Engenharia de Integração
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão integrada de releases engenharia firmware e APIs. Acompanhamento de Sprints e bug tracker.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-750 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus size={14} /> Nova Release Versão
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RELEASES LIST GRID */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 col-span-2">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <GitBranch size={14} className="text-fuchsia-500" /> Versões Sprints Registradas
          </h2>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-650 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                <tr>
                  <th className="p-3">Ref Version</th>
                  <th className="p-3">Nome Lançamento</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Progresso / Status</th>
                  <th className="p-3 text-right">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                {filteredReleases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      Nenhuma release corresponde à busca.
                    </td>
                  </tr>
                ) : (
                  filteredReleases.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-mono font-bold text-fuchsia-500">{r.version}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex flex-col">
                          <span>{r.title}</span>
                          <span className="text-[10px] text-slate-450 mt-0.5">{r.milestone}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`p-0.5 px-2 bg-slate-100 dark:bg-slate-850 text-slate-500 rounded text-[9px] font-bold ${
                          r.type === 'Bugfix' ? 'text-rose-500' : 'text-sky-500'
                        }`}>{r.type}</span>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 max-w-[150px]">
                          <div className="flex justify-between text-[9px] font-semibold text-slate-550">
                            <span>{r.status}</span>
                            <span>{r.percentage}%</span>
                          </div>
                          {/* PROGRESS COMPONENT */}
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-fuchsia-500 rounded-full" style={{ width: `${r.percentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {r.percentage < 100 && (
                          <button
                            onClick={() => handleUpdatePercentage(r.id, r.percentage)}
                            className="p-1 px-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-[10px] font-bold rounded cursor-pointer transition-colors"
                          >
                            Progredir
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROADMAP SPRINTS GRAPHIC */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Rocket size={14} className="text-sky-500" /> Sprint Timeline Rodmap
          </h2>

          <div className="space-y-3">
            {[
              { text: 'Sprint 24: Integração de Faturamento XML', status: 'done', period: 'Maio (Concluído)' },
              { text: 'Sprint 25: Calibração de Frotas via IoT', status: 'active', period: 'Junho (Corrente)' },
              { text: 'Sprint 26: Analytics Estratégico BI', status: 'next', period: 'Julho (Próximo)' }
            ].map((spr, i) => (
              <div key={i} className="p-3 border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/20 rounded-xl text-xs space-y-1">
                <span className={`inline-block py-0.5 px-1.5 text-[8px] font-bold rounded uppercase ${
                  spr.status === 'done' ? 'bg-emerald-500/10 text-emerald-500' :
                  spr.status === 'active' ? 'bg-sky-500/10 text-sky-500' : 'bg-slate-500/10 text-slate-450'
                }`}>{spr.period}</span>
                <p className="font-semibold text-slate-850 dark:text-slate-200">{spr.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE RELEASE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900">
              Registrar Release de Engenharia
            </h2>

            <form onSubmit={handleCreateRelease} className="space-y-4 mt-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Flag Versão SemVer</label>
                  <input
                    type="text"
                    required
                    placeholder="v2.4.5"
                    value={newVer}
                    onChange={(e) => setNewVer(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Mapeamento de Tipo</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="Feature">Feature (Nova Inovação)</option>
                    <option value="Bugfix">Bugfix (Correção)</option>
                    <option value="Melhoria">Melhoria de Performance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Subtítulo Lançamento</label>
                <input
                  type="text"
                  required
                  placeholder="Modulo de Calibração Concorrente de Insumos"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <input type="submit" value="Salvar no Roadmap" className="w-full bg-fuchsia-650 hover:bg-fuchsia-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

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
