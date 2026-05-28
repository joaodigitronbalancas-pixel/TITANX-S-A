import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  Plus,
  Compass,
  CornerDownRight,
  Sparkles,
  AlertTriangle,
  Receipt,
  Eye,
  Download,
  CheckCircle,
  FileCode2
} from 'lucide-react';
import { Invoice } from '../types';
import { defaultInvoices } from '../data/mockData';

export interface FaturamentoProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

export default function Faturamento({ searchText, onExport }: FaturamentoProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(defaultInvoices);
  
  // STATS
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedXml, setSelectedXml] = useState<Invoice | null>(null);

  // FORM FIELSD
  const [newClient, setNewClient] = useState('');
  const [newCnpj, setNewCnpj] = useState('');
  const [newValue, setNewValue] = useState<number>(0);
  const [newType, setNewType] = useState<'NF-e' | 'NFS-e'>('NF-e');

  const [simulationValue, setSimulationValue] = useState<number>(10000);
  const [simTax, setSimTax] = useState({ icms: 1800, ipi: 500, iss: 0, total: 2300 });

  const calculateSimulatedTaxes = (val: number) => {
    const isService = newType === 'NFS-e';
    const icmsVal = isService ? 0 : Math.round(val * 0.18);
    const ipiVal = isService ? 0 : Math.round(val * 0.05);
    const issVal = isService ? Math.round(val * 0.05) : 0;
    const totalVal = icmsVal + ipiVal + issVal;

    setSimTax({ icms: icmsVal, ipi: ipiVal, iss: issVal, total: totalVal });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient || !newCnpj || newValue <= 0) return;

    // Calculate tax (approx 16%)
    const taxAmt = Math.round(newValue * 0.16);

    const newNf: Invoice = {
      id: `nf-${Date.now()}`,
      number: `NFE-000${Math.floor(10000 + Math.random() * 90000)}`,
      client: newClient,
      cnpj: newCnpj,
      value: newValue,
      tax: taxAmt,
      type: newType,
      status: 'Autorizada',
      issueDate: new Date().toISOString().split('T')[0]
    };

    setInvoices([newNf, ...invoices]);
    setNewClient('');
    setNewCnpj('');
    setNewValue(0);
    setShowAddModal(false);
  };

  const handleCancelInvoice = (id: string) => {
    setInvoices(
      invoices.map((nf) => (nf.id === id ? { ...nf, status: 'Cancelada' as const } : nf))
    );
  };

  const filteredInvoices = invoices.filter((nf) => {
    return (
      nf.client.toLowerCase().includes(searchText.toLowerCase()) ||
      nf.number.toLowerCase().includes(searchText.toLowerCase()) ||
      nf.cnpj.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100 font-sans">
            Faturamento Fiscal & Emissão NF-e
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Módulo faturamento integrado fiscalmente ao SEFAZ. Emissão de NF-e, NFS-e, boletos bancários e tributos incidentes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-750 hover:to-indigo-750 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Faturar Nova Nota
          </button>
          <button
            onClick={() => onExport('xlsx', 'Faturamento Notas', invoices)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold rounded-xl text-slate-650 dark:text-slate-350 cursor-pointer"
          >
            Exportar XMLs (Lote)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INVOICES TABLE PANEL */}
        <div className="glass-card p-5 col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5 animate-pulse">
              <Receipt size={16} className="text-purple-500" /> Histórico Fiscal de Notas Emitidas
            </h2>
          </div>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-650 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                <tr>
                  <th className="p-3">NF / Nota</th>
                  <th className="p-3">Tomador / Clientes</th>
                  <th className="p-3 text-right">Valor Bruto</th>
                  <th className="p-3 text-right">Impostos (NF)</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      Nenhuma nota fiscal emitida sob esta pesquisa.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((nf) => (
                    <tr key={nf.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                      <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">{nf.number}</td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-slate-200 leading-none">{nf.client}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{nf.cnpj}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-white">
                        R$ {nf.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-mono text-rose-500 font-semibold">
                        R$ {nf.tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-slate-450 font-mono">{nf.issueDate}</td>
                      <td className="p-3">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          nf.status === 'Autorizada' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25' :
                          nf.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' : 'bg-rose-500/10 text-rose-500 border border-rose-500/25'
                        }`}>
                          {nf.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => setSelectedXml(nf)}
                            className="p-1 px-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5 cursor-pointer"
                            title="Ver XML SEFAZ"
                          >
                            <FileCode2 size={11} className="text-purple-500" /> XML
                          </button>
                          {nf.status === 'Autorizada' && (
                            <button
                              onClick={() => handleCancelInvoice(nf.id)}
                              className="p-1 px-1.5 border border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 text-[10px] text-rose-500 rounded font-semibold cursor-pointer transition-colors"
                            >
                              Cancelar
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

        {/* SIDE BAR TAX CALCULATOR SIMULATOR */}
        <div className="glass-card hover:border-purple-500/40 hover:glow-purple p-5 space-y-4 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 blur-xl rounded-full" />
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Calculator size={16} className="text-sky-500" />
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">
              Simulador Fiscal Integrado
            </h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-normal">
            Faça cálculos simulados das alíquotas incidentes (ICMS 18%, IPI 5%, ISS 5%) com base na tributação regional e tipo de faturamento fiscal.
          </p>

          <div className="space-y-4 text-xs font-medium">
            <div className="space-y-1">
              <label className="text-slate-400">Classificação Fiscal</label>
              <select
                value={newType}
                onChange={(e) => {
                  setNewType(e.target.value as 'NF-e' | 'NFS-e');
                  calculateSimulatedTaxes(simulationValue);
                }}
                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-lg p-2 cursor-pointer focus:outline-none"
              >
                <option value="NF-e">NF-e (Circulação Mercadoria)</option>
                <option value="NFS-e">NFS-e (Prestação de Serviços)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Valor Bruto do Faturamento (R$)</label>
              <input
                type="number"
                value={simulationValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSimulationValue(val);
                  calculateSimulatedTaxes(val);
                }}
                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850/80 rounded-xl space-y-2 font-mono">
              <div className="flex justify-between items-center text-slate-500">
                <span>ICMS Tributo (18%)</span>
                <span>R$ {simTax.icms.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>IPI Metalurgia (5%)</span>
                <span>R$ {simTax.ipi.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>ISS Prestador (5%)</span>
                <span>R$ {simTax.iss.toLocaleString('pt-BR')}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-900 pt-2 flex justify-between items-center font-bold text-sky-500">
                <span>Total Impostos</span>
                <span>R$ {simTax.total.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL BILLING */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900 font-sans">
              Emitir Nova Nota Fiscal
            </h2>

            <form onSubmit={handleCreateInvoice} className="space-y-4 mt-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-500 font-semibold">Tomador (Cliente)</label>
                <input
                  type="text"
                  required
                  placeholder="Ambev Indústria de Bebidas"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">CNPJ do Tomador</label>
                  <input
                    type="text"
                    required
                    placeholder="03.012.355/0001-99"
                    value={newCnpj}
                    onChange={(e) => setNewCnpj(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">Classificação</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'NF-e' | 'NFS-e')}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none cursor-pointer"
                  >
                    <option value="NF-e">NF-e (Mercadorias)</option>
                    <option value="NFS-e">NFS-e (Serviços)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-semibold">Valor Bruto da Operação (R$)</label>
                <input
                  type="number"
                  required
                  placeholder="45000"
                  value={newValue === 0 ? '' : newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none text-sm font-semibold font-mono"
                />
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1 text-slate-500 leading-tight">
                <div className="flex items-center gap-1.5 font-bold text-indigo-500 uppercase text-[10px] tracking-wider">
                  <Sparkles size={11} className="text-indigo-400" /> SEFAZ Webhook Ativo
                </div>
                Emissão instantânea com assinatura digital corporativa TITANX.
              </div>

              <input type="submit" value="Autorizar e Emitir" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

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

      {/* XML PREVIEW MODAL */}
      {selectedXml && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 text-slate-300 font-mono text-xs">
            <h2 className="text-sm font-bold text-[#00E5FF] pb-3 border-b border-slate-800 flex items-center gap-1.5 font-sans">
              <FileCode2 size={15} /> XML Assinado - SEFAZ Web-Receipt
            </h2>

            <div className="mt-4 bg-slate-900 p-4 rounded-xl max-h-72 overflow-y-auto border border-slate-850/60 overflow-x-auto text-[10px] text-lime-400 space-y-2">
              <p>&lt;?xml version="1.0" encoding="UTF-8"?&gt;</p>
              <p>&lt;nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"&gt;</p>
              <div className="pl-4">
                <p>&lt;NFe&gt;</p>
                <div className="pl-4">
                  <p>&lt;infNFe Id="NFe3125091..." versao="4.00"&gt;</p>
                  <div className="pl-4">
                    <p>&lt;ide&gt;</p>
                    <p className="pl-4">&lt;nNF&gt;{selectedXml.number.split('-')[1]}&lt;/nNF&gt;</p>
                    <p className="pl-4">&lt;dhEmi&gt;{selectedXml.issueDate}T17:50:50-03:00&lt;/dhEmi&gt;</p>
                    <p>&lt;/ide&gt;</p>

                    <p>&lt;emit&gt;</p>
                    <p className="pl-4">&lt;CNPJ&gt;01.123.456/0001-90&lt;/CNPJ&gt;</p>
                    <p className="pl-4">&lt;xNome&gt;TITANX HOLDING S/A&lt;/xNome&gt;</p>
                    <p>&lt;/emit&gt;</p>

                    <p>&lt;dest&gt;</p>
                    <p className="pl-4">&lt;CNPJ&gt;{selectedXml.cnpj}&lt;/CNPJ&gt;</p>
                    <p className="pl-4">&lt;xNome&gt;{selectedXml.client}&lt;/xNome&gt;</p>
                    <p>&lt;/dest&gt;</p>

                    <p>&lt;total&gt;</p>
                    <div className="pl-4 text-emerald-400">
                      <p>&lt;vNF&gt;{selectedXml.value.toFixed(2)}&lt;/vNF&gt;</p>
                      <p>&lt;vICMS&gt;{selectedXml.tax.toFixed(2)}&lt;/vICMS&gt;</p>
                    </div>
                    <p>&lt;/total&gt;</p>
                  </div>
                  <p>&lt;/infNFe&gt;</p>
                </div>
                <p>&lt;/NFe&gt;</p>
              </div>
              <p>&lt;/nfeProc&gt;</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-850 flex items-center justify-between font-sans">
              <span className="text-[10px] text-slate-500 font-mono">SEFAZ IP Authenticator: 177.20.14.99</span>
              <button
                onClick={() => setSelectedXml(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer border border-transparent hover:border-slate-700 transition-colors"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
