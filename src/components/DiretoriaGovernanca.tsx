import React, { useState } from 'react';
import {
  Lock,
  Compass,
  FileCheck2,
  AlertTriangle,
  Award,
  ListTodo,
  CheckSquare,
  Square,
  Building,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Activity,
  FileText,
  BadgeAlert,
  ArrowRight,
  UserCheck,
  Coins,
  Search,
  Scale
} from 'lucide-react';
import { StrategicGoal } from '../types';
import { defaultGoals } from '../data/mockData';

export interface DiretoriaGovernancaProps {
  searchText: string;
}

interface RiskItem {
  id: string;
  title: string;
  category: 'Finanças' | 'Operacional' | 'Segurança' | 'Legal';
  probability: 'Alta' | 'Média' | 'Baixa';
  impact: 'Muito Alto' | 'Alto' | 'Moderado' | 'Baixo';
  mitigation: string;
  mitigated: boolean;
}

interface ApprovalRequest {
  id: string;
  title: string;
  requester: string;
  value?: string;
  department: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  date: string;
}

export default function DiretoriaGovernanca({ searchText }: DiretoriaGovernancaProps) {
  const [goals, setGoals] = useState<StrategicGoal[]>(defaultGoals);

  // compliance actions
  const [compliances, setCompliances] = useState([
    { id: 1, title: 'Auditoria de Demonstrativos Fiscais (DRE/XML)', done: true, area: 'Fiscal/Contábil' },
    { id: 2, title: 'Termos de Consentimento e Cookies RGPD/LGPD', done: true, area: 'Jurídico/TI' },
    { id: 3, title: 'Renovação da Licença Corpo-Sustentável Inmetro', done: false, area: 'Fábrica PCP' },
    { id: 4, title: 'Treinamento de Política Anti-Corrupção de Fornecedores', done: false, area: 'Governança' }
  ]);

  // Strategic risk matrix
  const [risks, setRisks] = useState<RiskItem[]>([
    {
      id: 'risk-1',
      title: 'Volatilidade Cambial sobre Insumos Importados',
      category: 'Finanças',
      probability: 'Alta',
      impact: 'Alto',
      mitigation: 'Operações de Hedge cambial ativa no Banco Itaú S/A.',
      mitigated: false
    },
    {
      id: 'risk-2',
      title: 'Saturação de Capacidade da Linha Metalúrgica',
      category: 'Operacional',
      probability: 'Alta',
      impact: 'Alto',
      mitigation: 'Inclusão de Turno Extra (3º Turno) e maquinário reserva.',
      mitigated: true
    },
    {
      id: 'risk-3',
      title: 'Vazamento ou Acesso não Autorizado a Dados Corporativos',
      category: 'Segurança',
      probability: 'Baixa',
      impact: 'Muito Alto',
      mitigation: 'Firewall NGFW Fortinet ativo + criptografia das transações de banco de dados.',
      mitigated: false
    },
    {
      id: 'risk-4',
      title: 'Multa de Auditoria Ambiental de Emissões',
      category: 'Legal',
      probability: 'Média',
      impact: 'Alto',
      mitigation: 'Filtro catalisador instalado e análise semanária credenciada pelo Ibama.',
      mitigated: false
    }
  ]);

  // Executive Approvals S/A
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([
    {
      id: 'app-1',
      title: 'Compra Antecipada de Bobinas de Aço Gerdau',
      requester: 'Adilson Silveira (Logística)',
      value: 'R$ 145.000,00',
      department: 'Compras / Suprimentos',
      status: 'Pendente',
      date: 'Est. Hoje às 14:15'
    },
    {
      id: 'app-2',
      title: 'Contratação de Consultoria de Segurança Externa Cloud',
      requester: 'Beatriz Vasconcelos (Financeiro)',
      value: 'R$ 38.500,00',
      department: 'TI / Governança',
      status: 'Pendente',
      date: 'Ontem às 17:30'
    },
    {
      id: 'app-3',
      title: 'Renovação de Contrato Anual Comercial Ambev',
      requester: 'Patrícia Sales (Comercial)',
      value: 'R$ 1.450.000,00',
      department: 'Comercial B2B',
      status: 'Aprovado',
      date: 'Há 3 horas'
    }
  ]);

  const handleToggleCompliance = (id: number) => {
    setCompliances(
      compliances.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const handleUpdateProgress = (id: string, currentVal: number) => {
    const newVal = Math.min(currentVal + 10, 100);
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, progress: newVal, current: newVal === 100 ? g.target : `R$ ${(newVal * 450000).toLocaleString('pt-BR')}` } : g))
    );
  };

  const handleMitigateRisk = (id: string) => {
    setRisks(
      risks.map((r) => r.id === id ? { ...r, mitigated: true, probability: 'Baixa' } : r)
    );
  };

  const handleApprovalAction = (id: string, status: 'Aprovado' | 'Rejeitado') => {
    setApprovals(
      approvals.map((app) => app.id === id ? { ...app, status } : app)
    );
  };

  // Searches across goals and risks
  const filteredGoals = goals.filter((g) => {
    return (
      g.title.toLowerCase().includes(searchText.toLowerCase()) ||
      g.owner.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const filteredRisks = risks.filter((r) => {
    return (
      r.title.toLowerCase().includes(searchText.toLowerCase()) ||
      r.category.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
              Diretoria, Governança & Riscos
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 dark:text-emerald-450 border border-emerald-500/20">
              <ShieldCheck size={12} /> COMPLIANCE INTEGRADO S/A
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Painel consolidado de auditoria regulamentar, gestão de risco corporativo, central de aprovações e KPIs estratégicos da holding.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl">
          <Activity size={14} className="text-rose-500 animate-pulse" /> SESSÃO PRIVADA CRIPTOGRAFADA
        </div>
      </div>

      {/* STRATEGIC METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-405 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Grau de Conformidade</span>
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-850 dark:text-slate-100">94.8%</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            <TrendingUp size={10} /> +1.2% este trimestre
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-405 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Riscos Severos Ativos</span>
            <AlertTriangle size={18} className="text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-850 dark:text-slate-100">
            {risks.filter(r => r.impact === 'Muito Alto' && !r.mitigated).length} / {risks.length}
          </div>
          <div className="text-[10px] text-rose-550 dark:text-rose-450 mt-1 font-semibold flex items-center gap-1">
            <AlertTriangle size={10} /> Cuidado de Mitigação Exigido
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-405 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Aprovações Pendentes</span>
            <FileCheck2 size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-850 dark:text-slate-100">
            {approvals.filter(api => api.status === 'Pendente').length} Requisições
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-semibold">
            Revisão de Despesas e Alçadas Diretoria
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-405 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Estatuto de Auditoria</span>
            <Scale size={18} className="text-indigo-500" />
          </div>
          <div className="text-sm font-bold tracking-tight text-slate-850 dark:text-slate-100 p-1 bg-indigo-500/10 border border-indigo-500/20 text-center rounded-lg mt-0.5 uppercase">
            S/A CONCLUÍDO & CONFORME
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 font-semibold text-center">
            Próxima auditoria externa: Out/2026
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COMPLIANCE CHECKLIST & AUDIT AGENDA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
            <ListTodo size={14} className="text-sky-500" /> Agenda de Governança
          </h2>

          <div className="space-y-2 text-xs font-medium flex-1">
            {compliances.map((c) => (
              <button
                key={c.id}
                onClick={() => handleToggleCompliance(c.id)}
                className="w-full flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950/20 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded-xl transition-all cursor-pointer text-left border border-slate-100 dark:border-slate-900/40"
              >
                {c.done ? (
                  <CheckSquare size={16} className="text-[#00E5FF] shrink-0 mt-0.5" />
                ) : (
                  <Square size={16} className="text-slate-300 dark:text-slate-750 shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col min-w-0">
                  <span className={`font-semibold leading-tight ${c.done ? 'line-through text-slate-400' : 'text-slate-805 dark:text-slate-200'}`}>
                    {c.title}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase text-[#00E5FF] mt-1 tracking-wider">{c.area}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-150 dark:border-slate-800 text-[11px] text-slate-505 dark:text-slate-450 leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase block mb-1">Nota de Governança S/A:</span>
            A revalidação correta das tarefas acima assegura a robustez das operações de fusão e aquisições (M&A).
          </div>
        </div>

        {/* METAS ESTRATÉGICAS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4 col-span-2">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
            <Award size={14} className="text-indigo-500" /> Metas Estratégicas Holding S/A
          </h2>

          <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl bg-slate-50/20 dark:bg-transparent">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 border-b border-slate-150 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                <tr>
                  <th className="p-3">Indicador Alalvado</th>
                  <th className="p-3">Dono de Área</th>
                  <th className="p-3 text-right">Projetado (Meta)</th>
                  <th className="p-3 text-right">Status Corrente</th>
                  <th className="p-3">Gravidade / Risco</th>
                  <th className="p-3">Progresso / Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                {filteredGoals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      Nenhum objetivo holding sob esta busca.
                    </td>
                  </tr>
                ) : (
                  filteredGoals.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">{g.title}</td>
                      <td className="p-3 text-slate-500 font-medium">{g.owner.split(' ')[0]}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-805 dark:text-slate-200">{g.target}</td>
                      <td className="p-3 text-right font-mono text-[#00E5FF] font-semibold">{g.current}</td>
                      <td className="p-3">
                        <span className={`inline-block border text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          g.riskLevel === 'Baixo' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500' :
                          g.riskLevel === 'Moderado' ? 'bg-amber-500/10 border-amber-500/25 text-amber-500' : 'bg-rose-500/10 border-rose-500/25 text-rose-500 animate-pulse'
                        }`}>
                          RISCO {g.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">
                        <div className="space-y-1.5 min-w-[124px]">
                          <div className="flex justify-between items-center text-[9px] font-semibold">
                            <span>Completo {g.progress.toFixed(0)}%</span>
                            {g.progress < 100 && (
                              <button
                                onClick={() => handleUpdateProgress(g.id, g.progress)}
                                className="px-1.5 border border-sky-500/20 dark:border-sky-500/30 hover:bg-sky-500/10 text-[8px] font-bold text-sky-500 rounded cursor-pointer transition-colors"
                              >
                                Increment
                              </button>
                            )}
                          </div>
                          {/* PROGRESS BAR */}
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${g.progress}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INTERACTIVE COMPLIANCE RISKS REGISTER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4 col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-500" /> Matriz de Riscos Corporativos S/A
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Total de riscos: {filteredRisks.length}</span>
          </div>

          <div className="space-y-3">
            {filteredRisks.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border transition-all ${
                  r.mitigated
                    ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-80'
                    : 'bg-white dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {r.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{r.title}</h3>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      {r.mitigation}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-[10px] text-right font-mono">
                      <div>Probabilidade: <span className={r.probability === 'Alta' ? 'text-rose-500 font-bold' : 'text-slate-400'}>{r.probability}</span></div>
                      <div>Impacto: <span className={r.impact === 'Muito Alto' || r.impact === 'Alto' ? 'text-rose-500 font-bold' : 'text-slate-400'}>{r.impact}</span></div>
                    </div>

                    {!r.mitigated ? (
                      <button
                        onClick={() => handleMitigateRisk(r.id)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 rounded hover:bg-[#00E5FF]/20 transition-all cursor-pointer"
                      >
                        Mitigar Risco
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
                        Mitigado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RISK MATIRX HEATMAP DECORATOR */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Heatmap Analítico Corporativo S/A</span>
            <div className="grid grid-cols-4 gap-2 text-[9px] font-mono leading-none max-w-sm mx-auto p-2">
              <div className="p-2 border border-rose-500/30 bg-rose-500/20 rounded text-rose-450 font-bold">Crítico</div>
              <div className="p-2 border border-orange-500/30 bg-orange-500/20 rounded text-orange-450 font-bold">Alto</div>
              <div className="p-2 border border-amber-500/30 bg-amber-500/20 rounded text-amber-450 font-bold">Alt/Mod</div>
              <div className="p-2 border border-emerald-500/30 bg-emerald-500/20 rounded text-emerald-450 font-bold">Aceitável</div>
            </div>
            <p className="text-[10px] text-slate-405 leading-relaxed">
              Os algoritmos de BI analisam o impacto total cruzando relatórios de PCP, faturamento, financeiro e licenças em tempo real.
            </p>
          </div>
        </div>

        {/* DECISION DESK / APPROVAL REQUISITIONS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
            <Coins size={14} className="text-[#00E5FF]" /> Central de Aprovações S/A
          </h2>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px]">
            {approvals.map((app) => (
              <div
                key={app.id}
                className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-150 dark:border-slate-855 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono tracking-wider font-extrabold uppercase text-[#00E5FF]">
                      {app.department}
                    </span>
                    <h3 className="text-xs font-bold text-slate-805 dark:text-slate-200 leading-snug">
                      {app.title}
                    </h3>
                  </div>

                  <span className={`text-[8px] font-bold uppercase p-1 rounded font-mono shrink-0 ${
                    app.status === 'Pendente' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    app.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-900">
                  <div>Roteador: <span className="text-slate-500 dark:text-slate-350">{app.requester.split(' ')[0]}</span></div>
                  {app.value && <div className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">{app.value}</div>}
                </div>

                {app.status === 'Pendente' && (
                  <div className="flex items-center gap-1.5 mt-1 pt-1">
                    <button
                      onClick={() => handleApprovalAction(app.id, 'Aprovado')}
                      className="flex-1 py-1.5 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ThumbsUp size={11} /> Confirmar
                    </button>
                    <button
                      onClick={() => handleApprovalAction(app.id, 'Rejeitado')}
                      className="flex-1 py-1.5 text-[10px] font-bold bg-slate-150 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer border border-transparent dark:border-slate-700"
                    >
                      <ThumbsDown size={11} /> Recusar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center gap-2">
            <Award size={14} className="text-indigo-500 shrink-0" />
            <span className="text-[10px] text-slate-405 leading-tight">
              Aprovações de alçada de despesa acima de R$ 30.000,00 exigem a assinatura conjunta de dois diretores.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
