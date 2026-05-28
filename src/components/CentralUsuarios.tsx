import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Activity,
  UserX,
  UserPlus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Lock,
  Globe,
  Key,
  Database,
  Building,
  Laptop,
  Network,
  RotateCcw,
  Download,
  AlertTriangle,
  Eye,
  Sliders,
  Trash2,
  Bookmark
} from 'lucide-react';
import { UserRole } from '../types';

interface FullUser {
  id: string;
  avatar: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
  company: string;
  status: 'Ativo' | 'Bloqueado' | 'Inativo';
  mfaEnabled: boolean;
  lastLogin: string;
  ipAddress: string;
  activeSession: boolean;
  device: string;
}

interface ActiveSession {
  id: string;
  userId: string;
  name: string;
  role: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  startedAt: string;
  lastActivity: string;
}

interface PolicySettings {
  mfaRequired: boolean;
  minPasswordLength: number;
  passwordComplexity: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  allowedIPRange: string;
}

export default function CentralUsuarios({ searchText, onExport }: { searchText: string; onExport?: (format: 'pdf' | 'csv' | 'xlsx', module: string, data: any) => void }) {
  // Navigation inside User Center
  const [activeTab, setActiveTab] = useState<'usuarios' | 'acesso' | 'seguranca' | 'sessoes' | 'auditoria'>('usuarios');

  // Stateful list of enterprise users
  const [users, setUsers] = useState<FullUser[]>([
    {
      id: 'usr-1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      name: 'Leonardo Albuquerque',
      username: 'leonardo.admin',
      email: 'leonardo.albuquerque@titanxerp.com',
      role: 'Super Admin',
      department: 'TI & Cibersegurança',
      company: 'TitanX Holding S.A.',
      status: 'Ativo',
      mfaEnabled: true,
      lastLogin: '2026-05-28 19:12:05',
      ipAddress: '172.22.102.58',
      activeSession: true,
      device: 'MacBook Pro - macOS Sequoia (Chrome)'
    },
    {
      id: 'usr-2',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      name: 'Mariana Medeiros',
      username: 'mariana.diretoria',
      email: 'mariana.medeiros@titanxerp.com',
      role: 'Diretoria',
      department: 'Presidência & Finanças',
      company: 'TitanX Holding S.A.',
      status: 'Ativo',
      mfaEnabled: true,
      lastLogin: '2026-05-28 18:44:22',
      ipAddress: '172.22.102.12',
      activeSession: true,
      device: 'MacBook Air - macOS (Safari)'
    },
    {
      id: 'usr-3',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop',
      name: 'Roberto Santos',
      username: 'roberto.sales',
      email: 'roberto.santos@titanxerp.com',
      role: 'Comercial',
      department: 'Vendas Corporativas',
      company: 'TitanX Comercial Sul Ltda.',
      status: 'Ativo',
      mfaEnabled: false,
      lastLogin: '2026-05-28 16:30:11',
      ipAddress: '189.44.201.75',
      activeSession: false,
      device: 'Dell Latitude - Windows 11'
    },
    {
      id: 'usr-4',
      avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=150&auto=format&fit=crop',
      name: 'Juliano Ramos',
      username: 'juliano.pcp',
      email: 'juliano.ramos@titanxerp.com',
      role: 'Industrial',
      department: 'Sistemas Industriais PCP',
      company: 'TitanX Metalurgia Branch',
      status: 'Ativo',
      mfaEnabled: true,
      lastLogin: '2026-05-28 17:55:00',
      ipAddress: '172.24.40.10',
      activeSession: false,
      device: 'ThinkPad L14 - RedHat Linux'
    },
    {
      id: 'usr-5',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
      name: 'Fabíola Costa',
      username: 'fabiola.rh',
      email: 'fabiola.costa@titanxerp.com',
      role: 'RH',
      department: 'Recursos Humanos',
      company: 'TitanX Holding S.A.',
      status: 'Ativo',
      mfaEnabled: false,
      lastLogin: '2026-05-28 14:22:15',
      ipAddress: '201.88.92.112',
      activeSession: false,
      device: 'Lenovo IdeaPad - Windows 11'
    },
    {
      id: 'usr-6',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      name: 'Bruno Lima',
      username: 'bruno.infra',
      email: 'bruno.lima@titanxerp.com',
      role: 'TI',
      department: 'Redes e Cloud Infrastructure',
      company: 'TitanX Holding S.A.',
      status: 'Bloqueado',
      mfaEnabled: true,
      lastLogin: '2026-05-27 10:11:45',
      ipAddress: '192.168.12.80',
      activeSession: false,
      device: 'HP ProBook - Fedora Workstation'
    },
    {
      id: 'usr-7',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      name: 'Letícia Nunes',
      username: 'leticia.fiscal',
      email: 'leticia.nunes@titanxerp.com',
      role: 'Financeiro',
      department: 'Faturamento & Impostos S/A',
      company: 'TitanX Holding S.A.',
      status: 'Ativo',
      mfaEnabled: true,
      lastLogin: '2026-05-28 19:33:04',
      ipAddress: '172.22.102.94',
      activeSession: true,
      device: 'MacBook Air - macOS Sequoia'
    }
  ]);

  // Active Sessions state
  const [sessions, setSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-1',
      userId: 'usr-1',
      name: 'Leonardo Albuquerque',
      role: 'Super Admin',
      device: 'MacBook Pro 16" (Chrome)',
      browser: 'Chrome 125.0 Enterprise',
      ip: '172.22.102.58',
      location: 'São Paulo, BR (Central Corporate HQ)',
      startedAt: '2026-05-28 19:12:05',
      lastActivity: 'Ativo Agora'
    },
    {
      id: 'sess-2',
      userId: 'usr-2',
      name: 'Mariana Medeiros',
      role: 'Diretoria',
      device: 'MacBook Air 13" (Safari)',
      browser: 'Safari 17.5',
      ip: '172.22.102.12',
      location: 'São Paulo, BR (Corporate HQ Desk)',
      startedAt: '2026-05-28 18:44:22',
      lastActivity: 'Há 2 minutos'
    },
    {
      id: 'sess-3',
      userId: 'usr-7',
      name: 'Letícia Nunes',
      role: 'Financeiro',
      device: 'MacBook Air 13" (Chrome)',
      browser: 'Chrome v125 Stable',
      ip: '172.22.102.94',
      location: 'São Paulo, BR (Finance Hub Row B)',
      startedAt: '2026-05-28 19:33:04',
      lastActivity: 'Ativo Agora'
    }
  ]);

  // Live Audit Logs state
  const [logs, setLogs] = useState([
    { id: 'log-101', timestamp: '2026-05-28 19:44:12', user: 'leonardo.admin', action: 'Auditoria de Acesso Módulo Invest AI corporativo iniciada', ip: '172.22.102.58', status: 'Sucesso', module: 'Invest AI' },
    { id: 'log-102', timestamp: '2026-05-28 19:42:01', user: 'leticia.fiscal', action: 'Nota Fiscal de Saída NFe #10427 autorizada na SEFAZ', ip: '172.22.102.94', status: 'Sucesso', module: 'Faturamento' },
    { id: 'log-103', timestamp: '2026-05-28 19:36:50', user: 'leonardo.admin', action: 'Alteração de política de MFA obrigatório ativada', ip: '172.22.102.58', status: 'Sucesso', module: 'Usuários' },
    { id: 'log-104', timestamp: '2026-05-28 19:33:04', user: 'leticia.fiscal', action: 'Autenticação concluída via OTP MFA', ip: '172.22.102.94', status: 'Sucesso', module: 'Segurança' },
    { id: 'log-105', timestamp: '2026-05-28 19:25:31', user: 'roberto.sales', action: 'Tentativa de reset de dados comerciais negada (Permissão Insuficiente)', ip: '189.44.201.75', status: 'Bloqueado', module: 'Comercial' },
    { id: 'log-106', timestamp: '2026-05-28 19:15:22', user: 'anon-infra', action: 'Falha Brute-force bloqueada: Usuário bruno.infra de IP suspeito', ip: '192.168.12.80', status: 'Tentativa Bloqueada', module: 'Segurança' }
  ]);

  // General Security Policies config
  const [policies, setPolicies] = useState<PolicySettings>({
    mfaRequired: true,
    minPasswordLength: 8,
    passwordComplexity: true,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    allowedIPRange: '172.22.0.0/16, 189.44.0.0/16'
  });

  // Modal create user state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<FullUser | null>(null);

  // New user form state
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('Usuário Comum');
  const [formDept, setFormDept] = useState('');
  const [formCompany, setFormCompany] = useState('TitanX Holding S.A.');
  const [formStatus, setFormStatus] = useState<'Ativo' | 'Bloqueado' | 'Inativo'>('Ativo');
  const [formMfa, setFormMfa] = useState(true);

  // Filters state
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status message callback feedback
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Trigger temporary feedback toast
  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formUsername || !formEmail) {
      triggerFeedback('Preencha os campos obrigatórios.');
      return;
    }

    if (editingUser) {
      // Save Edit
      setUsers(prev => {
        return prev.map(u => u.id === editingUser.id ? {
          ...u,
          name: formName,
          username: formUsername,
          email: formEmail,
          role: formRole,
          department: formDept,
          company: formCompany,
          status: formStatus,
          mfaEnabled: formMfa
        } : u);
      });

      // Write log
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'leonardo.admin',
        action: `Usuário corporativo atualizado: ${formUsername} (${formRole})`,
        ip: '172.22.102.58',
        status: 'Sucesso' as const,
        module: 'Usuários'
      };
      setLogs(prev => [newLog, ...prev]);
      triggerFeedback(`Perfil do usuário "${formUsername}" salvo com sucesso.`);
    } else {
      // Create new
      const newUser: FullUser = {
        id: `usr-${Date.now()}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?q=80&w=150&auto=format&fit=crop`,
        name: formName,
        username: formUsername,
        email: formEmail,
        role: formRole,
        department: formDept || 'Outros',
        company: formCompany,
        status: formStatus,
        mfaEnabled: formMfa,
        lastLogin: 'Nunca logou',
        ipAddress: 'Não registrado',
        activeSession: false,
        device: 'Não registrado'
      };

      setUsers(prev => [...prev, newUser]);

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        user: 'leonardo.admin',
        action: `Novo usuário corporativo criado: ${formUsername} (${formRole})`,
        ip: '172.22.102.58',
        status: 'Sucesso' as const,
        module: 'Usuários'
      };
      setLogs(prev => [newLog, ...prev]);
      triggerFeedback(`Usuário "${formUsername}" registrado com sucesso.`);
    }

    // Reset Form
    setIsCreateOpen(false);
    setEditingUser(null);
    clearForm();
  };

  const clearForm = () => {
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormRole('Usuário Comum');
    setFormDept('');
    setFormCompany('TitanX Holding S.A.');
    setFormStatus('Ativo');
    setFormMfa(true);
  };

  const handleEditSelect = (user: FullUser) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormDept(user.department);
    setFormCompany(user.company);
    setFormStatus(user.status);
    setFormMfa(user.mfaEnabled);
    setIsCreateOpen(true);
  };

  const handleResetPassword = (username: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'leonardo.admin',
      action: `Reset de senha forçado solicitado para o colaborador: ${username}`,
      ip: '172.22.102.58',
      status: 'Sucesso' as const,
      module: 'Segurança'
    };
    setLogs(prev => [newLog, ...prev]);
    triggerFeedback(`Solicitação de refresh de chave enviada com sucesso para ${username}.`);
  };

  const handleToggleBlock = (id: string, currentStatus: 'Ativo' | 'Bloqueado' | 'Inativo') => {
    const nextStatus = currentStatus === 'Bloqueado' ? 'Ativo' : 'Bloqueado';
    setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    
    const userObj = users.find(u => u.id === id);
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'leonardo.admin',
      action: `Status alterado para ${nextStatus} de ${userObj?.username}`,
      ip: '172.22.102.58',
      status: 'Sucesso' as const,
      module: 'Segurança'
    };
    setLogs(prev => [newLog, ...prev]);
    triggerFeedback(`Status do usuário alterado para ${nextStatus}.`);
  };

  const handleRevokeSession = (sessionId: string) => {
    const target = sessions.find(s => s.id === sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // update related user's active session state parameter to False
    if (target) {
      setUsers(prev => prev.map(u => u.id === target.userId ? { ...u, activeSession: false } : u));
    }

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'leonardo.admin',
      action: `Sessão revogada com força. Colaborador: ${target ? target.name : 'Desconhecido'}`,
      ip: '172.22.102.58',
      status: 'Sucesso' as const,
      module: 'Segurança'
    };
    setLogs(prev => [newLog, ...prev]);
    triggerFeedback('Sessão revogada de maneira forçada imediatamente.');
  };

  // Filtered Users computation
  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchGlobal = !searchText || 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase());

    const matchRole = filterRole === 'all' || user.role === filterRole;
    const matchStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchSearch && matchRole && matchStatus && matchGlobal;
  });

  return (
    <div id="central-management-wrapper" className="space-y-6">
      
      {/* EXCELENT CORPORATE STATUS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-cyan-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-transparent opacity-40" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[9px] font-mono font-black uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-500/25 flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400 animate-pulse" /> OPERAÇÃO EM PRODUÇÃO ATIVA
            </span>
            <span className="p-1 px-2 text-[9px] font-mono text-purple-300 bg-purple-950/30 border border-purple-500/10 rounded-full">
              SESSÃO HIGH-SECURITY TLS
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase font-sans">
            Central de <span className="text-[#00E5FF] glow-cyan">Usuários & Acesso</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xl font-medium">
            Console geral de controle de permissões corporativas, auditoria forense de ações, gerenciamento de cargos, sessões em andamento e segurança de logins operacionais do TitanX ERP.
          </p>
        </div>

        {/* SECURITY STATS COUNTERS */}
        <div className="flex flex-wrap items-center gap-4 z-10 self-start md:self-auto">
          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-cyan-550/10 text-cyan-400 rounded-xl border border-cyan-500/10">
              <Users size={16} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-black leading-none">Total Colaboradores</span>
              <span className="font-mono text-sm font-black text-white leading-none">{users.length} Registrados</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-emerald-555/10 text-emerald-400 rounded-xl border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Activity size={16} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-black leading-none font-sans">Sessões Online</span>
              <span className="font-mono text-sm font-bold text-emerald-400 leading-none">{sessions.length} Ativas</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERNAL NAVIGATION TABS */}
      <div className="flex overflow-x-auto gap-2 bg-slate-950/40 p-1.5 rounded-2xl border border-slate-850 scrollbar-none">
        {[
          { id: 'usuarios', label: 'Cadastro de Usuários', icon: Users },
          { id: 'acesso', label: 'Controle de Acessos & Cargos', icon: Sliders },
          { id: 'sessoes', label: 'Sessões Ativas & Dispositivos', icon: Laptop, badge: sessions.length.toString() },
          { id: 'seguranca', label: 'Segurança & Diretrizes MFA', icon: Lock },
          { id: 'auditoria', label: 'Logs & Auditoria Forense', icon: Terminal, badge: 'Módulos' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_0_10px_rgba(0,229,255,0.05)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#00E5FF]' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[8px] font-mono font-bold px-1 rounded-md ${
                  isActive ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-slate-800 text-slate-550'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ERROR / FEEDBACK GLOBAL FLUID MESSAGE BAR */}
      {feedbackMsg && (
        <div className="p-3 bg-cyan-950/35 border border-cyan-500/25 text-[#00E5FF] text-xs font-semibold rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(0,229,255,0.1)]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg('')} className="text-[10px] text-slate-400 hover:text-white cursor-pointer hover:underline">Dispensar</button>
        </div>
      )}

      {/* MAIN VIEWPORT BODY PANELS */}
      <div id="tab-viewport-body" className="min-h-[500px]">
        
        {/* TAB 1: USERS DIRECTORY INDEX TABLE */}
        {activeTab === 'usuarios' && (
          <div className="space-y-4">
            
            {/* INSTANT CONTROLS BAR */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-950/45 rounded-2xl border border-slate-900 select-none">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    placeholder="Filtrar colaboradores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/50 p-2.5 pl-10 rounded-xl focus:outline-none text-slate-200 text-xs text-sans"
                  />
                </div>

                {/* ROLE FILTER */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-slate-900 border border-slate-800 p-2 text-xs text-slate-350 focus:outline-none focus:border-cyan-400/40 rounded-xl"
                >
                  <option value="all">Filtro: Todos os Cargos</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Diretoria">Diretoria</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="RH">RH</option>
                  <option value="Comercial">Comercial</option>
                  <option value="TI">TI</option>
                  <option value="Industrial">Industrial</option>
                </select>

                {/* STATUS FILTER */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-800 p-2 text-xs text-slate-350 focus:outline-none focus:border-cyan-400/40 rounded-xl"
                >
                  <option value="all">Filtro: Todos os Status</option>
                  <option value="Ativo">Ativos</option>
                  <option value="Bloqueado">Bloqueados</option>
                  <option value="Inativo">Inativos</option>
                </select>
              </div>

              {/* ACTION RIGHT BUTTON */}
              <button
                onClick={() => {
                  setEditingUser(null);
                  clearForm();
                  setIsCreateOpen(true);
                }}
                className="w-full md:w-auto py-2.5 px-4 bg-cyan-500 hover:bg-cyan-450 text-slate-950 font-black text-xs tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(0,229,255,0.25)] hover:scale-[1.01]"
              >
                <UserPlus size={14} /> CADASTRAR NOVO COLABORADOR
              </button>
            </div>

            {/* PREMIER MODERN USER TABLE */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#070b19] border-b border-slate-850 text-slate-450 font-mono tracking-wider font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="p-4 pl-6">Membro / Email</th>
                      <th className="p-4">Perfil / Cargo</th>
                      <th className="p-4">Empresa / Filial</th>
                      <th className="p-4">Departamento</th>
                      <th className="p-4">Último Login</th>
                      <th className="p-4">MFA Autenticação</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Ações de Segurança</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                          Nenhum colaborador localizado sob este escopo de busca.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-9 w-9 rounded-xl object-cover border border-slate-850"
                              />
                              <div>
                                <span className="block font-bold text-white leading-normal text-xs">{user.name}</span>
                                <span className="font-mono text-[9px] text-slate-500 uppercase">{user.username} - {user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`p-1 px-2 text-[10px] font-bold font-mono rounded-md inline-block border ${
                              user.role === 'Super Admin'
                                ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/20'
                                : user.role === 'Diretoria'
                                ? 'bg-rose-955/50 text-rose-400 border-rose-500/20'
                                : user.role === 'Financeiro'
                                ? 'bg-emerald-955/50 text-emerald-400 border-emerald-500/20'
                                : 'bg-slate-900 text-slate-350 border-slate-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-350 text-[11px]">
                            {user.company}
                          </td>
                          <td className="p-4 text-slate-400 font-medium">
                            {user.department}
                          </td>
                          <td className="p-4">
                            <span className="text-slate-450 text-[11px] font-mono leading-none flex items-center gap-1">
                              <Clock size={11} /> {user.lastLogin}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`font-mono font-bold text-[10px] uppercase inline-flex items-center gap-1 ${
                              user.mfaEnabled ? 'text-emerald-400' : 'text-slate-500'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${user.mfaEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                              {user.mfaEnabled ? 'Double Activ' : 'Inativo Key'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                              user.status === 'Ativo'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                                : user.status === 'Bloqueado'
                                ? 'bg-rose-500/10 text-rose-450 border-rose-500/15'
                                : 'bg-slate-800 text-slate-400 border-slate-750'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right whitespace-nowrap">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleEditSelect(user)}
                                className="py-1 px-2.5 rounded bg-slate-900 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/20 text-[10px] cursor-pointer text-slate-350 font-bold"
                              >
                                Ficha Perfil
                              </button>
                              <button
                                onClick={() => handleResetPassword(user.username)}
                                className="py-1 px-2.5 rounded bg-slate-900 border border-slate-800 hover:text-amber-400 hover:border-amber-500/20 text-[10px] cursor-pointer text-slate-350 font-bold"
                              >
                                Reset Pass
                              </button>
                              <button
                                onClick={() => handleToggleBlock(user.id, user.status)}
                                className={`py-1 px-2 rounded font-mono font-bold text-[9px] cursor-pointer ${
                                  user.status === 'Bloqueado'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/10 hover:bg-rose-500/25'
                                }`}
                              >
                                {user.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}
                              </button>
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
        )}

        {/* TAB 2: ACCESS CONTROL ROLES SLIDERS */}
        {activeTab === 'acesso' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* COLUMN 1 COLSPAN 3 */}
            <div className="xl:col-span-3 space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-905 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders size={14} className="text-[#00E5FF]" /> Escopo e Regras por Perfil de Acesso
                    </h3>
                    <p className="text-[10px] text-slate-500">Mapeamento dinâmico de visibilidade de módulos administrativos.</p>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-450 bg-cyan-950/40 border border-cyan-500/20 rounded px-2 py-0.5 uppercase font-bold">REGULAÇÃO LGPD CONCEDIDA</span>
                </div>

                <div className="space-y-4 select-none">
                  {[
                    { role: 'Super Admin', desc: 'Acesso total irrestrito nativo à central de auditoria, criptografia, ativos, finanças e de faturamento global.', level: 'Nível 10 - Redundancy', mods: ['Todos os Módulos Ativos'] },
                    { role: 'Diretoria', desc: 'Visibilidade executiva ampliada em relatórios fiscais, orçamentos, PCP estratégico, faturamento livre e gráficos de hedge fund.', level: 'Nível 9 - Executive Governance', mods: ['Executivo S/A', 'Finanças', 'Crescimento', 'PCP', 'Gestão'] },
                    { role: 'Financeiro S/A', desc: 'Atuação exclusiva sobre contas a pagar, conciliação fiscal e contas no Caixa Master. Ocultação de infraestrutura de TI.', level: 'Nível 7 - Fiscal Core', mods: ['Contabilidade', 'Faturamento Sefaz', 'Invest Master', 'Projetos'] },
                    { role: 'Industrial PCP', desc: 'Acesso a frotas, plantas industriais, setups de IoT de manufatura e ordens de fabricação de bobinas de metalurgia.', level: 'Nível 6 - Operations Control', mods: ['Metalurgia', 'Plantas Realtime', 'Squads Kanban'] }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-white">{p.role}</span>
                        <span className="font-mono text-[9px] text-[#00E5FF] font-black uppercase text-right">{p.level}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{p.desc}</p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {p.mods.map((m, mIdx) => (
                          <span key={mIdx} className="text-[9px] font-mono font-medium px-2 py-0.5 bg-slate-900 border border-slate-800 text-[#00E5FF] rounded-md">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SIDE CONTROLS DIRECTORY BRANCHES */}
            <div className="space-y-6">
              <div className="glass-card p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Building size={14} className="text-cyan-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Diretórios de Filiais S.A.</h4>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { name: 'TitanX Holding S.A.', loc: 'São Paulo (HQ Matriz)', status: 'Ativa' },
                    { name: 'TitanX Comercial Sul Ltda.', loc: 'Porto Alegre (Branch Sul)', status: 'Ativa' },
                    { name: 'TitanX Metalurgia Branch', loc: 'Joinville (Unidade de Manufatura)', status: 'Ativa' },
                    { name: 'TitanX Europa Logist', loc: 'Roterdã (Gateway de Exportação)', status: 'Restrita IP' }
                  ].map((br, index) => (
                    <div key={index} className="p-3 bg-slate-950/70 border border-slate-900 rounded-xl relative overflow-hidden">
                      <span className="block font-bold text-white text-xs leading-normal">{br.name}</span>
                      <span className="font-mono text-[9px] text-slate-500 block uppercase">{br.loc}</span>
                      <span className={`absolute right-3 top-3 text-[8px] font-mono font-extrabold px-1.5 rounded ${
                        br.status === 'Ativa' ? 'bg-emerald-550/10 text-emerald-400' : 'bg-purple-950/50 text-purple-300 border border-purple-500/10'
                      }`}>
                        {br.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ACTIVE SESSIONS */}
        {activeTab === 'sessoes' && (
          <div className="space-y-6">
            
            <div className="p-4 bg-purple-900/15 border border-purple-500/20 text-purple-200 text-xs rounded-2xl flex gap-2 leading-relaxed">
              <AlertTriangle className="shrink-0 mt-0.5 text-purple-400" size={14} />
              <p>
                <strong>Nota de Conformidade:</strong> Sessões simultâneas consecutivas do mesmo escopo IP sofrem rate-limiting instantâneo por motivos de segurança. Caso detecte dispositivo não reconhecido, utilize o botão <strong>Quarentena (Derrubar Sessão)</strong> para forçar re-autenticação MFA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
              {sessions.map(sess => (
                <div key={sess.id} className="glass-card p-5 rounded-3xl relative overflow-hidden border-sidebar-800 hover:border-purple-500/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 blur-xl rounded-full" />
                  
                  <div className="flex items-center justify-between border-b border-slate-905 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-slate-950 flex items-center justify-center text-[#00E5FF]">
                        <Laptop size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{sess.name}</h4>
                        <span className="text-[9px] font-mono text-[#00E5FF] uppercase font-bold">{sess.role}</span>
                      </div>
                    </div>

                    <span className="text-[8.5px] font-mono block text-emerald-400 bg-emerald-550/10 px-1.5 py-0.5 rounded">
                      {sess.lastActivity}
                    </span>
                  </div>

                  <div className="space-y-2.5 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Navegador & Versão:</span>
                      <span className="text-slate-300 font-bold">{sess.browser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">IP de Origem:</span>
                      <span className="text-slate-300 font-bold">{sess.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Localização Física:</span>
                      <span className="text-slate-300 font-bold flex items-center gap-1"><Globe size={10} /> {sess.location}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-900 pt-2.5 mt-2">
                      <span className="text-slate-500">Horário Inicial:</span>
                      <span className="text-slate-400">{sess.startedAt}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-905">
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="w-full py-2 bg-slate-950 hover:bg-rose-500/10 border border-rose-550/15 hover:border-rose-500/40 text-rose-450 hover:text-rose-400 font-black text-[10px] tracking-wider rounded-xl cursor-pointer transition-all uppercase"
                    >
                      ☠️ Quarentena (Derrubar Sessão)
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: SECURITY & MFA POLICY */}
        {activeTab === 'seguranca' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* COLUMN 1 COLSPAN 2 */}
            <div className="xl:col-span-2 space-y-6">
              
              <div className="glass-card p-5 rounded-3xl space-y-6">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-905 pb-3">
                    <Lock size={14} className="text-[#00E5FF]" /> Diretrizes de Segurança Corporativa & Redundância
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* CARD 1: OTP MFA */}
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white block">MFA OTP por Dispositivo</span>
                      <span className={`h-2 w-2 rounded-full ${policies.mfaRequired ? 'bg-emerald-500' : 'bg-slate-650'}`} />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal leading-relaxed">
                      Torna obrigatória a verificação em duas etapas por tokens OTP gerados na chave de hardware Titan.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={policies.mfaRequired}
                        onChange={(e) => setPolicies({ ...policies, mfaRequired: e.target.checked })}
                        className="h-3.5 w-3.5 accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-slate-350">Exigir duplo fator para login</span>
                    </div>
                  </div>

                  {/* CARD 2: PASSWORD COMPLEXITY */}
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white block">Algoritmo de Senhas Forte LGPD</span>
                      <span className={`h-2 w-2 rounded-full ${policies.passwordComplexity ? 'bg-[#00E5FF]' : 'bg-slate-650'}`} />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      A aplicação rejeitará senhas que não possuam caracteres numéricos, especiais e maíusculas correlatas.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={policies.passwordComplexity}
                        onChange={(e) => setPolicies({ ...policies, passwordComplexity: e.target.checked })}
                        className="h-3.5 w-3.5 accent-cyan-400 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-slate-350 font-sans">Forçar complexidade estrita</span>
                    </div>
                  </div>

                  {/* INTERFACE INPUTS: MISC CONFIGS */}
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-3">
                    <span className="text-xs font-bold text-white block">Tempo de Expiração em Sessão</span>
                    <p className="text-[10px] text-slate-405 leading-relaxed">Tempo máximo de ociosidade permitida antes do logout.</p>
                    <div className="relative">
                      <input
                        type="number"
                        value={policies.sessionTimeoutMinutes}
                        onChange={(e) => setPolicies({ ...policies, sessionTimeoutMinutes: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/40 p-2 text-xs rounded-xl text-white font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-500 uppercase">Minutos</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-900 space-y-3">
                    <span className="text-xs font-bold text-white block">Tentativas de Entrada Seguras</span>
                    <p className="text-[10px] text-slate-405 leading-relaxed">Número de erros para o bloqueio instantâneo do login IP.</p>
                    <div className="relative">
                      <input
                        type="number"
                        value={policies.maxLoginAttempts}
                        onChange={(e) => setPolicies({ ...policies, maxLoginAttempts: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/40 p-2 text-xs rounded-xl text-white font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-500 uppercase">Erros</span>
                    </div>
                  </div>

                </div>

                <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900 space-y-3">
                  <span className="text-xs font-bold text-white block">Subnets IPs Permitidos (Segurança Perimetral)</span>
                  <p className="text-[10.5px] text-slate-405 leading-normal">
                    Seu firewall corporativo de rede está ativado. Subnets separadas por vírgulas autorizadas a realizar conexões SOAP/REST no ERP TitanX corporativo.
                  </p>
                  <input
                    type="text"
                    value={policies.allowedIPRange}
                    onChange={(e) => setPolicies({ ...policies, allowedIPRange: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-[#00E5FF]/50 p-2.5 rounded-xl font-mono text-xs text-cyan-400 placeholder-slate-700 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => triggerFeedback('Políticas globais de TI e controle atualizadas com maestria administrativamente.')}
                    className="py-2 px-4 bg-cyan-500 hover:bg-cyan-45 transition-colors cursor-pointer text-slate-950 font-black text-xs rounded-xl"
                  >
                    Salvar Mudanças Diretivas
                  </button>
                </div>
              </div>

            </div>

            {/* IP WHOIS AUDIT & CERTIFICATIONS */}
            <div className="space-y-6">
              
              <div className="glass-card p-5 rounded-2xl space-y-4 font-sans select-none">
                <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Globe size={14} className="text-purple-400" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Firewall e Logs de Rede IPs</h4>
                </div>
                
                <div className="space-y-2 font-mono text-[9px] text-slate-450 leading-relaxed">
                  <div className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-lg">
                    <span className="text-emerald-400 font-bold block">MATRIZ HQ PRINCIPAL:</span>
                    <span>Subnet 172.22.102.0/24</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-lg">
                    <span className="text-emerald-400 font-bold block">METALURGIA MANUFATORIA:</span>
                    <span>Subnet 172.24.40.0/24</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-lg text-rose-450 bg-rose-500/5 border-rose-500/10">
                    <span className="font-bold block">ENDEREÇOS SUSPEITOS BLOQUEADOS:</span>
                    <span>IP 192.168.12.80 (Brute force log)</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-white block">TLS SECURE CERTIFICATION</span>
                  <span className="text-[10px] text-slate-450">Symmetric Key Encrypt - AES256 SHA</span>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: SYSTEM LOGS AUDIT */}
        {activeTab === 'auditoria' && (
          <div className="space-y-4">
            
            {/* AUDIT CONTROLS BANNER */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-950/45 rounded-2xl border border-slate-900 select-none font-sans">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal size={14} className="text-purple-400" /> Histórico de Transações de TI & Segurança Corporativa
                </h3>
                <p className="text-[10px] text-slate-500">Log em formato estrito syslog formatado com ISO-TIMESTAMPS IP para auditoria fiscal.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (onExport) {
                      onExport('csv', 'Logs_Auditoria_TitanX', logs);
                    } else {
                      triggerFeedback('Logs compilados exportados com sucesso em ambiente local CSV.');
                    }
                  }}
                  className="py-2 px-3 bg-slate-900 border border-slate-800 hover:text-white transition-colors cursor-pointer text-slate-350 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Download size={13} /> Exportar CSV
                </button>
                <button
                  onClick={() => {
                    const cleanLogs = [
                      { id: 'log-clean-' + Date.now(), timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19), user: 'leonardo.admin', action: 'Console de logs recarregado administrativamente.', ip: '172.22.102.58', status: 'Sucesso', module: 'Auditoria' }
                    ];
                    setLogs(cleanLogs);
                    triggerFeedback('Terminal de Logs limpo com sucesso.');
                  }}
                  className="py-2 px-3 bg-slate-950 border border-rose-500/20 hover:border-rose-500/40 text-rose-455 transition-colors cursor-pointer text-slate-400 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  Limpar Logs
                </button>
              </div>
            </div>

            {/* GORGEOUS SYSTEM TERMINAL LOGS GRID */}
            <div className="glass-card font-mono text-[11px] overflow-hidden">
              <div className="bg-[#050915] p-3 border-b border-slate-900 text-slate-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Database size={11} className="text-[#00E5FF]" /> SYS_OPERATIONS_FEED.LOG
              </div>

              <div className="p-4 space-y-2 bg-[#02050f] h-96 overflow-y-auto scrollbar-none">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl leading-normal hover:bg-slate-950 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-905/45 pb-1 mb-1.5 text-[10px] text-slate-505">
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-400 font-extrabold flex items-center gap-1"><Clock size={10} /> {log.timestamp}</span>
                        <span className="text-slate-600">|</span>
                        <span>MOD: <strong className="text-cyan-400">{log.module}</strong></span>
                        <span className="text-slate-600">|</span>
                        <span>USER: <strong className="text-white bg-slate-900 px-1 rounded">{log.user}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#00E5FF]">{log.ip}</span>
                        <span className="text-slate-600">|</span>
                        <span className={`font-black uppercase text-[9px] ${
                          log.status === 'Sucesso' || log.status.includes('concl') || log.status.includes('autorizada')
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-350">{log.action}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* DIALOG MASTER FORM MODAL FOR CREATE OR EDIT USERS */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none font-sans">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 border-b border-slate-850 bg-slate-950/40 flex justify-between items-center">
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                {editingUser ? 'Ficha e Perfil do Colaborador' : 'Cadastrar Colaborador S.A.'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingUser(null);
                }}
                className="text-slate-450 hover:text-white cursor-pointer"
              >
                fechar
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-400">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Letícia Ferreira Ramos"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Username Único</label>
                  <input
                    type="text"
                    required
                    placeholder="leticia.ramis"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Email Corporativo</label>
                  <input
                    type="email"
                    required
                    placeholder="leticia@titanxerp.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Cargo / Função Permissão</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Diretoria">Diretoria</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Comercial">Comercial</option>
                    <option value="TI">TI</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Usuário Comum">Usuário Comum</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Departamento Operacional</label>
                  <input
                    type="text"
                    placeholder="TI, Finanças, Comercial"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Empresa / Filial S.A.</label>
                <select
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="TitanX Holding S.A.">TitanX Holding S.A. (HQ Matriz)</option>
                  <option value="TitanX Comercial Sul Ltda.">TitanX Comercial Sul Ltda.</option>
                  <option value="TitanX Metalurgia Branch">TitanX Metalurgia Branch</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1 flex flex-col justify-center">
                  <span className="text-slate-400 block mb-1">Status Corporativo</span>
                  <div className="flex gap-2">
                    {['Ativo', 'Bloqueado', 'Inativo'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormStatus(st as any)}
                        className={`py-1 px-2.5 rounded text-[10px] font-bold border transition-colors ${
                          formStatus === st
                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40 font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block mb-1">Segurança MFA</span>
                  <div className="flex items-center gap-2 h-8">
                    <input
                      type="checkbox"
                      checked={formMfa}
                      onChange={(e) => setFormMfa(e.target.checked)}
                      className="h-4 w-4 accent-[#00E5FF] cursor-pointer"
                    />
                    <span className="text-slate-350">MFA Ativo no Perfil</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-750 transition-colors text-slate-400 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-40 hover:opacity-90 transition-colors text-slate-950 font-black uppercase tracking-wider"
                >
                  {editingUser ? 'Salvar Perfil' : 'Criar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
