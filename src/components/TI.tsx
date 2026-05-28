import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Compass,
  FileCheck2,
  Terminal,
  Server,
  Activity,
  UserCheck2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { HelpdeskTicket, TechAsset, AuditLog } from '../types';
import { defaultTickets, defaultAssets, defaultAuditLogs } from '../data/mockData';

export interface TIProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

export default function TI({ searchText, onExport }: TIProps) {
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(defaultTickets);
  const [assets, setAssets] = useState<TechAsset[]>(defaultAssets);
  const [logs, setLogs] = useState<AuditLog[]>(defaultAuditLogs);

  const [activeTab, setActiveTab] = useState<'helpdesk' | 'ativos' | 'logs'>('helpdesk');
  const [showAddTicket, setShowAddTicket] = useState(false);

  // NEW TICKET FORM
  const [newTitle, setNewTitle] = useState('');
  const [newRequester, setNewRequester] = useState('');
  const [newPriority, setNewPriority] = useState<HelpdeskTicket['priority']>('Média');
  const [newCategory, setNewCategory] = useState('Hardware e Periféricos');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newRequester) return;

    const newTkt: HelpdeskTicket = {
      id: `tkt-${Date.now()}`,
      code: `HDP-0${Math.floor(4000 + Math.random() * 900)}`,
      title: newTitle,
      requester: newRequester,
      priority: newPriority,
      status: 'Aberto',
      assignedTo: 'Suporte Interno TI',
      slaLimit: '4h de limite inicial',
      category: newCategory
    };

    setTickets([newTkt, ...tickets]);

    // Add audit log
    const newLog: AuditLog = {
      id: `lg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'usr-1',
      username: 'superadmin',
      action: `Abertura de Ticket TI: ${newTkt.code}`,
      module: 'TI HELPDESK',
      ip: '127.0.0.1',
      status: 'Suceso'
    };
    setLogs([newLog, ...logs]);

    setNewTitle('');
    setNewRequester('');
    setShowAddTicket(false);
  };

  const handleResolveTicket = (id: string) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: 'Resolvido' as const } : t))
    );
  };

  const filteredTickets = tickets.filter((t) => {
    return (
      t.title.toLowerCase().includes(searchText.toLowerCase()) ||
      t.code.toLowerCase().includes(searchText.toLowerCase()) ||
      t.requester.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Suporte TI & Governança de Infra
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Módulo de Monitoramento de ativos, logs de auditoria LGPD, e centro de suporte helpdesk integrado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTicket(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02] shrink-0"
          >
            <Plus size={14} /> Abrir Chamado Helpdesk
          </button>
        </div>
      </div>

      {/* CORE DISPLAY MULTI-TABS CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {/* TABS HEAD */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 px-3 py-2 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveTab('helpdesk')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'helpdesk' ? 'bg-white dark:bg-slate-800 text-sky-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Helpdesk (Fila de Chamados)
          </button>
          <button
            onClick={() => setActiveTab('ativos')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'ativos' ? 'bg-white dark:bg-slate-800 text-sky-505 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Inventário Ativos Tecnologia (Hardware)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'logs' ? 'bg-white dark:bg-slate-800 text-sky-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Logs de Auditoria & Acesso LGPD
          </button>
        </div>

        {/* HELP DESK TAB 1 */}
        {activeTab === 'helpdesk' && (
          <div className="p-5">
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-650 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Ref Code</th>
                    <th className="p-3">Título do Incidente</th>
                    <th className="p-3">Solicitante</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Urgência</th>
                    <th className="p-3">SLA Status</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        Nenhum incidente cadastrado sob esta busca.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="p-3 font-mono font-bold text-violet-500">{t.code}</td>
                        <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">{t.title}</td>
                        <td className="p-3 text-slate-650">{t.requester}</td>
                        <td className="p-3"><span className="p-1 px-2 border border-slate-200 dark:border-slate-800 text-slate-400 rounded text-[9px] font-bold uppercase">{t.category}</span></td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                            t.priority === 'Urgente' ? 'bg-rose-150 text-rose-500' : 'bg-slate-100 text-slate-500'
                          }`}>{t.priority}</span>
                        </td>
                        <td className="p-3 text-slate-400 leading-none">{t.slaLimit}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            t.status === 'Resolvido' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {t.status !== 'Resolvido' && (
                            <button
                              onClick={() => handleResolveTicket(t.id)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Resolver
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
        )}

        {/* ATIVOS TAB 2 */}
        {activeTab === 'ativos' && (
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850/80 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="p-1 px-2 bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-350 rounded font-mono text-[9px] font-bold">
                      TAG: {asset.serial}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" title={asset.status}></span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{asset.name}</h4>
                    <p className="text-[10px] text-slate-400">Atribuído: <span className="font-semibold text-slate-500">{asset.assignedTo}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LGPD LOGS TAB 3 */}
        {activeTab === 'logs' && (
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-850">
              <h3 className="text-xs font-bold font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Terminal size={14} className="text-rose-500" /> Registro de Atividades Segurança Clientes
              </h3>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-650 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Timestamp Gtm</th>
                    <th className="p-3">Operador</th>
                    <th className="p-3">Módulo</th>
                    <th className="p-3">Ação Policiada</th>
                    <th className="p-3 text-center">Origem IP</th>
                    <th className="p-3 text-center">Verificação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300 font-mono text-[11px]">
                  {logs.map((lg) => (
                    <tr key={lg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 text-slate-400">{new Date(lg.timestamp).toLocaleString()}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{lg.username}</td>
                      <td className="p-3 text-[#00E5FF]">{lg.module}</td>
                      <td className="p-3 text-slate-650 truncate max-w-xs">{lg.action}</td>
                      <td className="p-3 text-center text-slate-400">{lg.ip}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block py-0.5 px-2 rounded-full font-bold text-[9px] ${
                          lg.status === 'Suceso' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {lg.status}
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

      {/* CREATE CHAMADO MODAL */}
      {showAddTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 text-xs font-semibold">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900">
              Abrir Chamado Helpdesk TI
            </h2>

            <form onSubmit={handleCreateTicket} className="space-y-4 mt-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-500 font-semibold">Título do Incidente</label>
                <input
                  type="text"
                  required
                  placeholder="Instabilidade no faturamento SEFAZ lote"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Solicitante (Nome)</label>
                <input
                  type="text"
                  required
                  placeholder="Patrícia Sales (Comercial)"
                  value={newRequester}
                  onChange={(e) => setNewRequester(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Categoria TI</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="Hardware e Periféricos">Hardware e Periféricos</option>
                    <option value="Sistemas Internos">Sistemas Internos</option>
                    <option value="Acesso Redes">Acesso Redes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Nível Criticidade</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none font-semibold"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <input type="submit" value="Salvar e Emitir Ticket" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

              <button
                type="button"
                onClick={() => setShowAddTicket(false)}
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
