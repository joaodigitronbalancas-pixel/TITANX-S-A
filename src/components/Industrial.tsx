import React, { useState } from 'react';
import {
  Factory,
  Plus,
  Compass,
  FileCheck2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Hammer
} from 'lucide-react';
import { ProductionOrder } from '../types';
import { defaultProductionOrders } from '../data/mockData';

export interface IndustrialProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

export default function Industrial({ searchText, onExport }: IndustrialProps) {
  const [orders, setOrders] = useState<ProductionOrder[]>(defaultProductionOrders);
  const [showAddModal, setShowAddModal] = useState(false);

  // NEW OP FORM
  const [newProduct, setNewProduct] = useState('');
  const [newQty, setNewQty] = useState<number>(0);
  const [newMatStatus, setNewMatStatus] = useState<ProductionOrder['rawMaterialStatus']>('Suficiente');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct || newQty <= 0) return;

    const newOp: ProductionOrder = {
      id: `po-${Date.now()}`,
      code: `OP-2026-0${Math.floor(240 + Math.random() * 50)}`,
      product: newProduct,
      quantity: newQty,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'Agendada',
      rawMaterialStatus: newMatStatus,
      efficiency: 95.0
    };

    setOrders([newOp, ...orders]);
    setNewProduct('');
    setNewQty(0);
    setShowAddModal(false);
  };

  const handleUpdateStatus = (id: string, nextStatus: ProductionOrder['status']) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    return (
      o.product.toLowerCase().includes(searchText.toLowerCase()) ||
      o.code.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100 font-sans">
            Industrial & PCP Engenharia
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento e Controle de Produção (PCP). Gestão de metalurgia, faturamento industrial e materiais alocados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-sky-650 hover:from-cyan-700 hover:to-sky-750 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Emitir Ordem PCP (OP)
          </button>
          <button
            onClick={() => onExport('xlsx', 'PCP Industrial', orders)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold rounded-xl text-slate-650 dark:text-slate-350 cursor-pointer"
          >
            Exportar OPs
          </button>
        </div>
      </div>

      {/* METRIC BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL ORDERS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Ordens Ativas (Lote)</span>
            <div className="text-lg font-bold text-slate-850 dark:text-white font-mono">
              {orders.filter(o => o.status !== 'Concluída').length} Diretivas
            </div>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-lg">
            <Hammer size={18} />
          </div>
        </div>

        {/* MATERIAL RUPTURE RISK */}
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Falta Matéria Insumo</span>
            <div className="text-lg font-bold text-amber-500 font-mono">
              {orders.filter(o => o.rawMaterialStatus === 'Alerta' || o.rawMaterialStatus === 'Faltando').length} OPs Risco
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
            <AlertTriangle size={18} />
          </div>
        </div>

        {/* PLANT EFFICIENCY */}
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Eficiência PCP Média</span>
            <div className="text-lg font-bold text-emerald-500 font-mono">
              {(orders.reduce((acc, curr) => acc + curr.efficiency, 0) / orders.length).toFixed(1)}% Operacional
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Factory size={14} className="text-cyan-500" /> Grade Geral de Controle PCP
        </h2>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-655 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
              <tr>
                <th className="p-3">OP Código</th>
                <th className="p-3">Especificação de Produto</th>
                <th className="p-3 text-right">Lote Solicitado</th>
                <th className="p-3">Engenheiro PCP</th>
                <th className="p-3">Insumos (Aloc.)</th>
                <th className="p-3">Eficiência (%)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações PCP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Nenhuma rota industrial emitida nesta busca.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{o.code}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{o.product}</td>
                    <td className="p-3 text-right font-mono font-bold">{o.quantity.toLocaleString()}</td>
                    <td className="p-3 text-slate-500 font-medium">Marcio Silva (Eng. Insumo)</td>
                    <td className="p-3">
                      <span className={`inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        o.rawMaterialStatus === 'Suficiente' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {o.rawMaterialStatus}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-emerald-500 font-semibold">{o.efficiency.toFixed(1)}%</td>
                    <td className="p-3">
                      <span className={`inline-block border text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === 'Concluída' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500' :
                        o.status === 'Em Produção' ? 'bg-sky-500/10 border-sky-500/25 text-sky-500' :
                        o.status === 'Qualidade' ? 'bg-purple-500/10 border-purple-500/25 text-purple-500' : 'bg-slate-500/10 border-slate-500/25 text-slate-550'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        {o.status === 'Agendada' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'Em Produção')}
                            className="p-1 px-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-[9px] font-bold text-sky-600 dark:text-sky-400 rounded cursor-pointer transition-colors"
                          >
                            Produzir
                          </button>
                        )}
                        {o.status === 'Em Produção' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'Qualidade')}
                            className="p-1 px-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-[9px] font-bold text-purple-600 dark:text-purple-400 rounded cursor-pointer transition-colors"
                          >
                            Qualidade
                          </button>
                        )}
                        {o.status === 'Qualidade' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'Concluída')}
                            className="p-1 px-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 rounded cursor-pointer transition-colors"
                          >
                            Finalizar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE OP PCP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900">
              Registrar Ordem de Produção (PCP)
            </h2>

            <form onSubmit={handleCreateOrder} className="space-y-4 mt-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-500">Mapeamento de Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Balança Industrial TitanX X500 IP69"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Metragem do Lote</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={newQty === 0 ? '' : newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 text-sm font-semibold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Estoque Matéria-Prima</label>
                  <select
                    value={newMatStatus}
                    onChange={(e) => setNewMatStatus(e.target.value as any)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none font-semibold"
                  >
                    <option value="Suficiente">Suficiente (Ok)</option>
                    <option value="Alerta">Alerta de Insumos Baixos</option>
                  </select>
                </div>
              </div>

              <input type="submit" value="Salvar e Emitir Ordem" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

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
