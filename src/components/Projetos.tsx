import React, { useState } from 'react';
import {
  KanbanSquare,
  Plus,
  Compass,
  FileCheck2,
  Paperclip,
  CheckCircle2,
  Clock,
  User,
  Upload,
  Sparkles,
  Files
} from 'lucide-react';
import { ProjectTask } from '../types';
import { defaultTasks } from '../data/mockData';

export interface ProjetosProps {
  searchText: string;
}

export default function Projetos({ searchText }: ProjetosProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>(defaultTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // ACTIONS FORM
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProject, setNewProject] = useState('SaaS TitanX Cloud IoT');
  const [newPriority, setNewPriority] = useState<ProjectTask['priority']>('Média');
  const [newAssignee, setNewAssignee] = useState('Roberto Antunes');

  // MOCK ATTACHMENTS
  const [attachments, setAttachments] = useState<{ name: string; size: string; date: string }[]>([
    { name: 'Diagrama_Balança_Layout_v2.pdf', size: '2.4 MB', date: '2026-05-28' },
    { name: 'Wireframes_Mobile_Client_App.png', size: '4.8 MB', date: '2026-05-27' }
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newTask: ProjectTask = {
      id: `tsk-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      project: newProject,
      priority: newPriority,
      column: 'todo',
      assignee: `${newAssignee} (PCP/TI)`,
      hoursSpent: 0,
      estimatedHours: 12,
      dueDate: new Date().toISOString().split('T')[0]
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleShiftTask = (id: string, currentColumn: ProjectTask['column'], target: 'todo' | 'inprogress' | 'review' | 'done') => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, column: target } : t))
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newAtt = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0]
      };
      setAttachments([newAtt, ...attachments]);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    return (
      t.title.toLowerCase().includes(searchText.toLowerCase()) ||
      t.project.toLowerCase().includes(searchText.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const columns: { id: ProjectTask['column']; label: string; color: string }[] = [
    { id: 'todo', label: 'Backlog Tarefas', color: 'bg-slate-100 border-slate-200 dark:bg-slate-950 dark:border-slate-850' },
    { id: 'inprogress', label: 'Em Execução', color: 'border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20' },
    { id: 'review', label: 'Validação & QA', color: 'border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20' },
    { id: 'done', label: 'Concluído', color: 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-900/10' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Projetos & Kanban Scrum
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Espaço colaborativo para equipes de TI, engenharia e faturamento. Acompanhamento do roadmap de entregas corporativas.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-700 hover:to-emerald-700 font-semibold text-xs text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus size={14} /> Criar Tarefa Kanban
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KANBAN BOARD FLOW (3 COLUMNS RESIZABLE ON DESKTOP) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4 items-start">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.column === col.id);
            return (
              <div key={col.id} className={`p-4 border rounded-xl space-y-4 flex flex-col min-w-[200px] max-h-[500px] ${col.color}`}>
                <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-850">
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-350">{col.label}</span>
                  <span className="h-5 w-5 bg-slate-200 dark:bg-slate-850 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-650 dark:text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto pr-0.5 scrollbar-thin">
                  {columnTasks.length === 0 ? (
                    <div className="text-[10px] p-4 text-center border border-dashed border-slate-200 dark:border-slate-850 text-slate-400 rounded-lg">
                      Vazio
                    </div>
                  ) : (
                    columnTasks.map((t) => (
                      <div key={t.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-sm space-y-2 relative group">
                        <span className="text-[9px] font-mono font-bold uppercase text-sky-500">{t.project}</span>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-snug">{t.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{t.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-650 dark:text-slate-350">{t.assignee.split(' ')[0]}</span>
                          <span className={`px-1 rounded font-bold text-[8px] uppercase ${
                            t.priority === 'Crítica' ? 'bg-rose-150 text-rose-600' :
                            t.priority === 'Alta' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                          }`}>{t.priority}</span>
                        </div>

                        {/* COLUMN SHIFT CONTROLS */}
                        <div className="pt-2 flex gap-1 justify-end">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => {
                                const targetCol = col.id === 'inprogress' ? 'todo' : col.id === 'review' ? 'inprogress' : 'review';
                                handleShiftTask(t.id, t.column, targetCol);
                              }}
                              className="p-1 px-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded text-[9px] text-slate-505 font-medium cursor-pointer transition-colors"
                            >
                              Retornar
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => {
                                const targetCol = col.id === 'todo' ? 'inprogress' : col.id === 'inprogress' ? 'review' : 'done';
                                handleShiftTask(t.id, t.column, targetCol);
                              }}
                              className="p-1 px-1.5 bg-lime-50 dark:bg-lime-950/20 text-lime-650 border border-lime-500/10 hover:border-lime-500/30 font-bold hover:bg-lime-100 rounded text-[9px] cursor-pointer ml-auto transition-colors animate-pulse"
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

        {/* SIDE BAR DOCUMENTS DROP AREA MOCK */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850/80 rounded-xl p-5 space-y-4 flex flex-col h-full justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b pb-2 border-slate-100 dark:border-slate-850">
              <Files size={14} className="text-sky-500" /> Repositório de Arquivos
            </h3>

            {/* DRAG & DROP ARIA INTERACTIVE MOCK */}
            <div
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging ? 'bg-sky-500/10 border-sky-400' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/20'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  const newAtt = {
                    name: file.name,
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    date: new Date().toISOString().split('T')[0]
                  };
                  setAttachments([newAtt, ...attachments]);
                }
              }}
            >
              <input
                id="file-element-uploader"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-element-uploader" className="cursor-pointer space-y-2 block">
                <Upload size={20} className="text-sky-500 mx-auto animate-pulse" />
                <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Arraste ou Selecione</span>
                <span className="block text-[9px] text-slate-400">PDF, CAD, Planilhas até 25MB</span>
              </label>
            </div>

            {/* REGISTERED ATTACHMENTS */}
            <div className="space-y-2 mt-4">
              <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Anexos ({attachments.length})</span>
              {attachments.map((att, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg text-[10px]">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <Paperclip size={12} className="text-sky-500 shrink-0" />
                    <span className="truncate leading-none text-slate-750 dark:text-slate-200 font-semibold">{att.name}</span>
                  </div>
                  <span className="font-mono text-slate-400 shrink-0 select-none text-[9px]">{att.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-900">
              Nova Diretiva de Tarefa
            </h2>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-500">Mapeamento do Projeto</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                >
                  <option value="SaaS TitanX Cloud IoT">SaaS TitanX Cloud IoT</option>
                  <option value="Migração Nuvem Infra">Migração Nuvem Infra</option>
                  <option value="Plataforma Web ERP v2">Plataforma Web ERP v2</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Título Detalhado</label>
                <input
                  type="text"
                  required
                  placeholder="Configurar DNS SSL Gateway"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Descrição do Escopo</label>
                <textarea
                  placeholder="Definição de regras de proxies reverso e segurança corporativa TLS..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 h-16 resize-none focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500">Incarregado</label>
                  <input
                    type="text"
                    required
                    placeholder="Roberto Antunes"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Severidade / Urgência</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none font-semibold"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <input type="submit" value="Criar no Quadro Kanban" className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer transition-colors text-center text-xs block" />

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
