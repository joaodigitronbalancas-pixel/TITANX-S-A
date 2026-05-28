import React, { useState } from 'react';
import {
  UserCheck2,
  Plus,
  Users,
  Compass,
  Briefcase,
  HelpCircle,
  CalendarDays,
  Award,
  DollarSign,
  Heart
} from 'lucide-react';
import { Employee } from '../types';
import { defaultEmployees } from '../data/mockData';

export interface RHProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

export default function RH({ searchText, onExport }: RHProps) {
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'colaboradores' | 'organograma'>('colaboradores');

  // ADITIONS FORM
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Recursos Humanos');
  const [newSalary, setNewSalary] = useState<number>(0);
  const [newEmail, setNewEmail] = useState('');

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole || newSalary <= 0) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: newName,
      role: newRole,
      department: newDept,
      salary: newSalary,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Ativo',
      email: newEmail || 'colaborador@titanxerp.com',
      performanceScore: 4.5
    };

    setEmployees([...employees, newEmp]);
    setNewName('');
    setNewRole('');
    setNewSalary(0);
    setShowAddModal(false);
  };

  const handleToggleStatus = (id: string, currentStatus: Employee['status']) => {
    const nextStatus: Employee['status'] = currentStatus === 'Ativo' ? 'Férias' : 'Ativo';
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
    );
  };

  const filteredEmployees = employees.filter((e) => {
    return (
      e.name.toLowerCase().includes(searchText.toLowerCase()) ||
      e.role.toLowerCase().includes(searchText.toLowerCase()) ||
      e.department.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Modulo de Recursos Humanos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão integrada de pessoal, folhas corporativas de benefício, férias anuais e avaliações de feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-650 hover:from-teal-700 hover:to-emerald-750 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Contratar Colaborador
          </button>
          <button
            onClick={() => onExport('xlsx', 'RH Colaboradores', employees)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold rounded-xl text-slate-650 dark:text-slate-350 cursor-pointer"
          >
            Exportar Quadro
          </button>
        </div>
      </div>

      {/* METRIC ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* TOTAL PAYROLL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Folha Salarial Estimada</span>
            <div className="text-lg font-bold text-slate-850 dark:text-white font-mono">
              R$ {totalPayroll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-500 rounded-lg">
            <DollarSign size={18} />
          </div>
        </div>

        {/* STAFF RATINGS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Quadro Consolidado</span>
            <div className="text-lg font-bold text-sky-500">
              {employees.length} Integrantes Ativos
            </div>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-500 rounded-lg">
            <Users size={18} />
          </div>
        </div>

        {/* VACATIONS IN QUEUE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Colaboradores em Férias</span>
            <div className="text-lg font-bold text-purple-500">
              {employees.filter(e => e.status === 'Férias').length} Agendados
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
            <CalendarDays size={18} />
          </div>
        </div>
      </div>

      {/* DETAILED DATA */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {/* SUB VIEWS OPTIONS */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 px-3 py-2 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveSubView('colaboradores')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSubView === 'colaboradores' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Quadro Oficial de Colaboradores
          </button>
          <button
            onClick={() => setActiveSubView('organograma')}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              activeSubView === 'organograma' ? 'bg-white dark:bg-slate-800 text-teal-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Visualizar Organograma de Holding
          </button>
        </div>

        {/* TAB 1: LIST */}
        {activeSubView === 'colaboradores' && (
          <div className="p-5">
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/40 text-slate-655 border-b border-slate-100 dark:border-slate-850 uppercase font-mono tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Iniciais</th>
                    <th className="p-3">Nome Detalhado</th>
                    <th className="p-3">Cargo Operativo</th>
                    <th className="p-3">Departamento Executivo</th>
                    <th className="p-3 text-right">Salário Bruto</th>
                    <th className="p-3 text-center">Score Desempenho</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Fator Férias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 dark:text-slate-300">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        Nenhum funcionário encontrado nesta pesquisa.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                        <td className="p-3">
                          <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-bold flex items-center justify-center text-[10px] select-none shadow-sm">
                            {e.name.substring(0, 2).toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-100">
                          <div className="flex flex-col">
                            <span>{e.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">{e.email}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-350 font-semibold">{e.role}</td>
                        <td className="p-3 text-slate-500 font-medium">{e.department}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-white">
                          R$ {e.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-[#00E5FF] font-mono justify-center">
                            <Award size={12} /> {e.performanceScore.toFixed(1)} / 5.0
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block border text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            e.status === 'Ativo' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500' : 'bg-purple-500/10 border-purple-500/25 text-purple-500'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleStatus(e.id, e.status)}
                            className="p-1 px-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded text-[10px] text-slate-550 font-bold transition-all cursor-pointer"
                          >
                            {e.status === 'Ativo' ? 'Agendar Férias' : 'Voltar ao Posto'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: COPORATIV ORGANOGRAM PREVIEW */}
        {activeSubView === 'organograma' && (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
              TitanX Holding S/A - Organograma Hierárquico de Gestão
            </h3>

            {/* SIMPLE RECTANGLE TREE STRUCTURE */}
            <div className="flex flex-col items-center space-y-4 max-w-lg mt-4 w-full">
              {/* LEVEL 1: BOARD OF DIRECTORS */}
              <div className="bg-slate-900 border border-sky-500 text-white p-3 rounded-lg font-bold text-xs shadow-md shadow-sky-500/5 min-w-[200px]">
                <div className="text-[9px] font-mono text-sky-400 uppercase tracking-widest font-bold">Diretoria Executiva</div>
                Leonardo Albuquerque (CEO)
              </div>
              <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

              {/* LEVEL 2: DEPARTMENTS CO-OP */}
              <div className="grid grid-cols-2 gap-8 w-full">
                <div className="flex flex-col items-center w-full">
                  <div className="bg-slate-800 border border-emerald-500 text-slate-200 p-2.5 rounded-lg text-xs font-bold w-full max-w-[170px]">
                    <div className="text-[8px] font-mono text-emerald-400 uppercase">Finanças</div>
                    Beatriz Vasconcelos
                  </div>
                  <div className="h-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 p-2 rounded text-[10px] w-full max-w-[150px]">
                    Faturamento & SEFAZ APIs
                  </div>
                </div>

                <div className="flex flex-col items-center w-full">
                  <div className="bg-slate-800 border border-pink-500 text-slate-200 p-2.5 rounded-lg text-xs font-bold w-full max-w-[170px]">
                    <div className="text-[8px] font-mono text-pink-400 uppercase">Comercial & Vendas</div>
                    Patrícia Sales Sênior
                  </div>
                  <div className="h-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 p-2 rounded text-[10px] w-full max-w-[150px]">
                    Pipeline & Leads CRM
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE EMPLOYEE REGISTRY BOX */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900 font-sans">
              Contratar Novo Integrante
            </h2>

            <form onSubmit={handleCreateEmployee} className="space-y-4 mt-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-500">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Fernando Mendes Garcia"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Cargo Corporativo</label>
                  <input
                    type="text"
                    required
                    placeholder="Analista Fiscal Júnior"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">Departamento</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none"
                  >
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Financeiro Corporativo">Financeiro Corporativo</option>
                    <option value="Logística & Frotas">Logística & Frotas</option>
                    <option value="Manufatura Industrial">Manufatura Industrial</option>
                    <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">E-mail Corporativo</label>
                  <input
                    type="email"
                    placeholder="f.mendes@titanxerp.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500">Proposta Salarial (R$)</label>
                  <input
                    type="number"
                    required
                    placeholder="5500"
                    value={newSalary === 0 ? '' : newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none text-sm font-semibold font-mono"
                  />
                </div>
              </div>

              <input type="submit" value="Salvar no Quadro" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

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
