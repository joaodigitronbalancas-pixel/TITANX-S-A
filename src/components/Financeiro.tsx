import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { FinancialRecord } from '../types';
import { defaultFinancials } from '../data/mockData';

export interface FinanceiroProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

export default function Financeiro({ searchText, onExport }: FinanceiroProps) {
  const [records, setRecords] = useState<FinancialRecord[]>(defaultFinancials);
  const [activeSegment, setActiveSegment] = useState<'transacoes' | 'dre' | 'centros'>('transacoes');
  
  // ADD TRANSACTION MODAL
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<'Receita' | 'Despesa'>('Receita');
  const [newCat, setNewCat] = useState('Vendas Corporativas');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newCostCenter, setNewCostCenter] = useState('Vendas Internas - Sul');
  const [newStatus, setNewStatus] = useState<'Pendente' | 'Liquidado'>('Pendente');

  // FILTERS
  const [typeFilter, setTypeFilter] = useState<'todos' | 'Receita' | 'Despesa'>('todos');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.description.toLowerCase().includes(searchText.toLowerCase()) ||
      r.category.toLowerCase().includes(searchText.toLowerCase()) ||
      r.costCenter.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = typeFilter === 'todos' || r.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalReceitas = records
    .filter((r) => r.type === 'Receita' && r.status === 'Liquidado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDespesas = records
    .filter((r) => r.type === 'Despesa' && r.status === 'Liquidado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || newAmount <= 0) return;

    const newRecord: FinancialRecord = {
      id: `fin-${Date.now()}`,
      type: newType,
      category: newCat,
      description: newDesc,
      amount: newAmount,
      date: new Date().toISOString().split('T')[0],
      status: newStatus,
      costCenter: newCostCenter
    };

    setRecords([newRecord, ...records]);
    setNewDesc('');
    setNewAmount(0);
    setShowAddModal(false);
  };

  const handleLiquidate = (id: string) => {
    setRecords(
      records.map((r) => (r.id === id ? { ...r, status: 'Liquidado' } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Gestão Financeira & Caixa
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle de disponibilidades financeiras, DRE operacional, conciliação e centro de custos integrados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Lançar Transação
          </button>
          <button
            onClick={() => onExport('xlsx', 'Financeiro Geral', records)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold rounded-xl text-slate-650 dark:text-slate-350 cursor-pointer"
          >
            Exportar Fluxo
          </button>
        </div>
      </div>

      {/* METRIC CARDS BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* RECEITAS */}
        <div className="glass-card hover:border-emerald-500/40 hover:glow-emerald rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 h-12 w-12 bg-emerald-500/5 blur-lg rounded-full" />
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider font-mono">Entradas Consolidadas</span>
            <div className="text-lg font-black text-emerald-400 font-mono">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-xl group-hover:scale-105 transition-all z-10">
            <ArrowDownLeft size={18} />
          </div>
        </div>

        {/* DESPESAS */}
        <div className="glass-card hover:border-rose-500/40 hover:glow-purple rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 h-12 w-12 bg-rose-500/5 blur-lg rounded-full" />
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider font-mono">Saídas Liquidadas</span>
            <div className="text-lg font-black text-rose-400 font-mono">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-xl group-hover:scale-105 transition-all z-10">
            <ArrowUpRight size={18} />
          </div>
        </div>

        {/* SALDO OPERACIONAL */}
        <div className="glass-card hover:border-cyan-500/40 hover:glow-cyan rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-cyan-500 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 h-12 w-12 bg-[#00E5FF]/5 blur-lg rounded-full" />
          <div className="space-y-1 z-10">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider font-mono">Saldo em Caixa Ativo</span>
            <div className="text-lg font-black text-cyan-400 font-mono font-sans">
              R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/20 rounded-xl group-hover:scale-105 transition-all z-10 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
            <Wallet size={18} />
          </div>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="glass-card overflow-hidden min-h-[400px]">
        {/* HEADER SELECTS */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 px-3 py-2 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveSegment('transacoes')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSegment === 'transacoes' ? 'bg-white dark:bg-slate-800 text-sky-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Lançamentos Operacionais
          </button>
          <button
            onClick={() => setActiveSegment('dre')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSegment === 'dre' ? 'bg-white dark:bg-slate-800 text-sky-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            DRE Simplificado de Resultados
          </button>
          <button
            onClick={() => setActiveSegment('centros')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSegment === 'centros' ? 'bg-white dark:bg-slate-800 text-sky-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Centros de Custo
          </button>
        </div>

        {/* TAB 1: TRANSACTIONS TABLE */}
        {activeSegment === 'transacoes' && (
          <div className="p-5 space-y-4">
            {/* INLINE FILTERS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/20 p-2 rounded-xl text-xs">
              <span className="font-semibold text-slate-500 pl-2">Filtrar Categoria:</span>
              <div className="flex gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setTypeFilter('todos')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                    typeFilter === 'todos' ? 'bg-sky-600 border-sky-600 text-white shadow-sm' : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Visualizar Todos
                </button>
                <button
                  onClick={() => setTypeFilter('Receita')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                    typeFilter === 'Receita' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Todas Receitas
                </button>
                <button
                  onClick={() => setTypeFilter('Despesa')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                    typeFilter === 'Despesa' ? 'bg-rose-600 border-rose-600 text-white shadow-sm' : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Todas Despesas
                </button>
              </div>
            </div>

            {/* CORE TABLE */}
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-650 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-3">Data</th>
                    <th className="p-3">Descrição da Transação</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Centro de Custo</th>
                    <th className="p-3 text-right">Valor Líquido</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">
                        Nenhum lançamento financeiro corresponde à pesquisa.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                        <td className="p-3 font-mono text-slate-450">{r.date}</td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{r.description}</td>
                        <td className="p-3"><span className="p-1 px-2.5 bg-slate-100 dark:bg-slate-850 text-slate-500 rounded font-semibold text-[10px]">{r.category}</span></td>
                        <td className="p-3 text-slate-500 font-medium">{r.costCenter}</td>
                        <td className={`p-3 text-right font-mono font-bold ${
                          r.type === 'Receita' ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                          R$ {r.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            r.status === 'Liquidado' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25' :
                            r.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' : 'bg-rose-500/10 text-rose-500 border border-rose-500/25'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {r.status !== 'Liquidado' && (
                            <button
                              onClick={() => handleLiquidate(r.id)}
                              className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-150 border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Liquidar
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

        {/* TAB 2: INCOME STATEMENT DRE */}
        {activeSegment === 'dre' && (
          <div className="p-5 space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calculator size={14} className="text-sky-500" /> Demonstrativo do Resultado do Exercício (Ajuste Trimestral)
            </h3>

            <div className="text-xs space-y-3 border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/20 max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-550 uppercase">
                <span>Receita Operacional Bruta</span>
                <span className="text-emerald-500 font-mono">R$ 1.845.220,00</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pl-4 py-1">
                <span>(-) Impostos e Alíquotas NF-e</span>
                <span className="text-rose-400/80 font-mono">- R$ 145.200,00</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 py-1 border-b border-slate-100 dark:border-slate-900">
                <span>Receita Líquida Operacional</span>
                <span className="font-mono">R$ 1.700.020,00</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pl-4 py-1">
                <span>(-) Custos Metalúrgicos & Matéria Prima</span>
                <span className="text-rose-400/80 font-mono">- R$ 684.340,00</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pl-4 py-1">
                <span>(-) Folha Administrativa RH</span>
                <span className="text-rose-400/80 font-mono">- R$ 324.500,00</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-850 dark:text-white pt-2 border-t-2 border-slate-200 dark:border-slate-800 text-sm">
                <span>EBITDA / Resultado Operacional Ativo</span>
                <span className="text-sky-500 font-mono">R$ 691.180,00</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COST CENTERS */}
        {activeSegment === 'centros' && (
          <div className="p-5 space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers size={14} className="text-sky-500" /> Distribuições por Centros de Custo Autorizados
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Vendas Internas - Sul', limit: 250000, current: 145000, pct: 58 },
                { name: 'Corporativo Geral', limit: 500000, current: 324500, pct: 64.9 },
                { name: 'TI Cloud Ops', limit: 30000, current: 14200, pct: 47.3 }
              ].map((center, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{center.name}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono font-medium text-slate-450">
                      <span>Consumido: {center.pct}%</span>
                      <span>Teto: R$ {center.limit.toLocaleString()}</span>
                    </div>
                    {/* CUSTOM PROGRESS BAR */}
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${center.pct}%` }} />
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Disponível: R$ {(center.limit - center.current).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL TRANSACTION */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900">
              Nova Operação Financeira
            </h2>

            <form onSubmit={handleAddTransaction} className="space-y-4 mt-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Classe de Lançamento</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const type = e.target.value as 'Receita' | 'Despesa';
                      setNewType(type);
                      setNewCat(type === 'Receita' ? 'Vendas Corporativas' : 'Custos de Matéria-Prima');
                    }}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none"
                  >
                    <option value="Receita">Receita (Entrada)</option>
                    <option value="Despesa">Despesa (Saída)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">Alocação de Custo</label>
                  <select
                    value={newCostCenter}
                    onChange={(e) => setNewCostCenter(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none"
                  >
                    <option value="Vendas Internas - Sul">Vendas Internas - Sul</option>
                    <option value="Corporativo Geral">Corporativo Geral</option>
                    <option value="TI Cloud Ops">TI Cloud Ops</option>
                    <option value="Supri_Fábrica">Supri_Fábrica</option>
                    <option value="Mkt Comercial">Mkt Comercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Categoria Analítica</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                  >
                    {newType === 'Receita' ? (
                      <>
                        <option value="Vendas Corporativas">Vendas Corporativas</option>
                        <option value="Licenças SaaS">Licenças SaaS</option>
                        <option value="Serviço Suporte">Serviço Suporte</option>
                      </>
                    ) : (
                      <>
                        <option value="Custos de Matéria-Prima">Custos de Matéria-Prima</option>
                        <option value="Salários e Encargos">Salários e Encargos</option>
                        <option value="Infraestrutura Tecnológica">Infraestrutura Tecnológica</option>
                        <option value="Marketing e Branding">Marketing e Branding</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Status Operacional</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'Pendente' | 'Liquidado')}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="Liquidado">Liquidada (Pago)</option>
                    <option value="Pendente">Pendente (Agendado)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Descrição Comercial</label>
                <input
                  type="text"
                  required
                  placeholder="Faturamento Vale S/A - Balança Rodoviária"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Valor Monetário (R$)</label>
                <input
                  type="number"
                  required
                  placeholder="35000"
                  value={newAmount === 0 ? '' : newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none text-sm font-mono font-semibold"
                />
              </div>

              <input type="submit" value="Salvar Lançamento" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

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
