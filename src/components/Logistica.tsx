import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  PackageCheck,
  AlertTriangle,
  Layers,
  MapPin,
  ClipboardList,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  Download,
  Flame,
  Activity,
  History,
  TrendingUp,
  FileUp,
  MessageSquare,
  Sparkles,
  Calendar,
  GripVertical,
  CheckCircle,
  HelpCircle,
  Map,
  BadgeAlert,
  Send,
  Sliders,
  ChevronDown,
  Inbox,
  User,
  Wrench,
  Clock
} from 'lucide-react';
import { InventoryItem, MovementRecord, TransportVehicle } from '../types';
import { defaultInventory, defaultMovements, defaultVehicles } from '../data/mockData';

export interface LogisticaProps {
  searchText: string;
  onExport: (format: 'pdf' | 'csv' | 'xlsx', moduleName: string, data: any) => void;
}

interface LogisticsComment {
  id: string;
  user: string;
  role: string;
  message: string;
  timestamp: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  uploader: string;
  timestamp: string;
}

export default function Logistica({ searchText, onExport }: LogisticaProps) {
  // CORE ENTERPRISE STATE
  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventory);
  const [movements, setMovements] = useState<MovementRecord[]>(() => {
    // Enrich movements list to make it richer
    return [
      ...defaultMovements,
      {
        id: 'mov-3',
        itemId: 'inv-2',
        itemName: 'Liga Alumínio T6 Fundido',
        type: 'Saída',
        quantity: 150,
        responsible: 'Roberto Antunes (PCP)',
        date: '2026-05-28T10:11:00Z',
        docRef: 'PED-49012'
      },
      {
        id: 'mov-4',
        itemId: 'inv-4',
        itemName: 'Microcontrolador Cortex-M4 IP68',
        type: 'Saída',
        quantity: 40,
        responsible: 'Almoxarifado Norte S/A',
        date: '2026-05-27T16:00:00Z',
        docRef: 'REK-01933'
      },
      {
        id: 'mov-5',
        itemId: 'inv-5',
        itemName: 'Balança Rodoviária TitanX-V3',
        type: 'Entrada',
        quantity: 4,
        responsible: 'Patrária Sales (Audit)',
        date: '2026-05-26T11:45:00Z',
        docRef: 'OPE-99441'
      }
    ] as MovementRecord[];
  });
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(defaultVehicles);

  // NAVIGATION TABS
  const [activeTab, setActiveTab] = useState<'operacoes' | 'estoque' | 'movimentacoes' | 'frota'>('operacoes');

  // SUB-LEVEL SELECTION
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>('vh-1');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>('inv-2');

  // INTERACTIVE WORKFLOW STATES
  const [comments, setComments] = useState<LogisticsComment[]>([
    { id: 'com-1', user: 'Adilson Silveira', role: 'Gerente Logística', message: 'Caminhão Mercedes-Benz Actros (Placa NEX-8I92) em trânsito prioritário para Ambev S/A. Documentação fiscal vinculada com sucesso.', timestamp: '18:14' },
    { id: 'com-2', user: 'Beatriz Vasconcelos', role: 'Direção Financeira', message: 'Aprovação de verba especial de transporte internacional autorizada para a carga da Scania nas próximas 24 horas.', timestamp: '17:50' }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    { id: 'file-1', name: 'MANIFESTO_CARGA_AMBEV_NEX8I92.pdf', size: '1.4 MB', uploader: 'Adilson Silveira', timestamp: '2026-05-28' },
    { id: 'file-2', name: 'LAUDO_CALIBRACAO_TITANXV3.xlsx', size: '640 KB', uploader: 'Roberto Antunes', timestamp: '2026-05-27' }
  ]);
  const [dragOver, setDragOver] = useState(false);

  // SIMULATED AUTO UPDATE LIVE TICKER
  const [liveLogs, setLiveLogs] = useState<string[]>([
    '🟢 [SISTEMA] Central de Monitoramento de Frotas Iniciada com redundância de satélite.',
    '🚚 [FROTA] Mercedes-Benz NEX-8I92 alterou status para "Em Trânsito" (Coordenadas: -23.5505, -46.6333)',
    '⚙️ [ESTOQUE] Saída efetuada: 12x Célula de Medição Digital X400 (Almoxarifado Geral)'
  ]);

  // MODAL TO ADD INSULATING STOCK
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState<number>(0);
  const [newUnit, setNewUnit] = useState('kg');
  const [newCategory, setNewCategory] = useState('Matéria-Prima');
  const [newWarehouse, setNewWarehouse] = useState('Galpão Principal A');

  // ADVANCED CONTROLLER FILTERS
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  
  // DRAG AND DROP STORAGE HEATMAP SELECTOR
  const [selectedHeatGrid, setSelectedHeatGrid] = useState<string | null>('B2');

  // WAREHOUSE SHELVING HEAT GRID OCCUPANCY DATA
  const heatGrids = [
    { id: 'A1', name: 'Bloco A - Prateleira 1', occupancy: 95, category: 'Matéria-Prima', status: 'Ruptura' },
    { id: 'A2', name: 'Bloco A - Prateleira 2', occupancy: 82, category: 'Componentes', status: 'Normal' },
    { id: 'B1', name: 'Bloco B - Prateleira 1', occupancy: 40, category: 'Componentes', status: 'Normal' },
    { id: 'B2', name: 'Bloco B - Prateleira 2', occupancy: 12, category: 'Matéria-Prima', status: 'Crítico' },
    { id: 'C1', name: 'Bloco C - Setor Geral 1', occupancy: 65, category: 'Componentes', status: 'Normal' },
    { id: 'C2', name: 'Bloco C - Setor Geral 2', occupancy: 0, category: 'Estoque de Vendas', status: 'Vazio' },
    { id: 'D1', name: 'Bloco D - Pátio Aberto 1', occupancy: 88, category: 'Estoque de Vendas', status: 'Normal' },
    { id: 'D2', name: 'Bloco D - Pátio Aberto 2', occupancy: 100, category: 'Insumos', status: 'Lotado' }
  ];

  // Simulating live operational stream updates
  useEffect(() => {
    const timer = setInterval(() => {
      const liveEvents = [
        `🔄 [TELEMETRIA] Scania NEX-4A22 reportou velocidade média de 80km/h na BR-101.`,
        `📦 [ESTOQUE BAINHO] Nível crítico de sensor apontado no Galpão Secundário C.`,
        `📡 [M2M] Integrador IoT detectou leitura de peso de 42.5 Mil kg no canal R-100.`,
        `🚚 [ROTA S/A] Veículo Furgão NEX-3X88 programado para coleta às 08:00 de amanhã.`,
        `📥 [DOCUMENTAL] Certidão de Origem Digital anexada para NF-e Ambev.`
      ];
      const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      setLiveLogs(prev => [randomEvent, ...prev.slice(0, 15)]);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'baixo' && item.status === 'Estoque Baixo') ||
      (statusFilter === 'zerado' && item.status === 'Fora de Estoque') ||
      (statusFilter === 'ok' && item.status === 'Em Estoque');

    const matchesWarehouse =
      warehouseFilter === 'todos' || item.warehouse === warehouseFilter;

    const matchesCategory =
      categoryFilter === 'todos' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesWarehouse && matchesCategory;
  });

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName || newQty < 0) return;

    const statusValue = newQty === 0 ? 'Fora de Estoque' : newQty < 200 ? 'Estoque Baixo' : 'Em Estoque';

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      code: newCode,
      name: newName,
      category: newCategory,
      quantity: newQty,
      minStock: 200,
      unit: newUnit,
      warehouse: newWarehouse,
      status: statusValue,
      lastMovement: new Date().toISOString()
    };

    setInventory([newItem, ...inventory]);

    // Push new movement record
    const newMov: MovementRecord = {
      id: `mov-${Date.now()}`,
      itemId: newItem.id,
      itemName: newItem.name,
      type: 'Entrada',
      quantity: newQty,
      responsible: 'Almoxarifado Geral - Operação Principal',
      date: new Date().toISOString(),
      docRef: 'AJUSTE-ESTOQUE-AUTOMATICO'
    };

    setMovements([newMov, ...movements]);
    setSelectedInventoryItem(newItem.id);

    // Reset standard fields
    setNewCode('');
    setNewName('');
    setNewQty(0);
    setShowAddModal(false);

    // Stream update log
    setLiveLogs(prev => [`📥 [REGISTRO] Novo Insumo adicinado ao portfólio: ${newName} (${newQty} ${newUnit})`, ...prev]);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: LogisticsComment = {
      id: `com-${Date.now()}`,
      user: 'Leonardo Albuquerque',
      role: 'Diretor Geral S/A',
      message: newCommentText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const file = e.dataTransfer.files[0];
    const newAttached: AttachedFile = {
      id: `file-${Date.now()}`,
      name: file.name.toUpperCase(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploader: 'Leonardo Albuquerque',
      timestamp: new Date().toISOString().split('T')[0]
    };

    setAttachedFiles([newAttached, ...attachedFiles]);
  };

  const handleSimulateDispatch = (vehicleId: string) => {
    setVehicles(prev =>
      prev.map(v => (v.id === vehicleId ? { ...v, status: v.status === 'Disponível' ? 'Em Transporte' : 'Disponível' } : v))
    );
    const updatedVehicle = vehicles.find(v => v.id === vehicleId);
    if (updatedVehicle) {
      setLiveLogs(prev => [
        `🔄 [FROTA] Operador despachou veículo Placa ${updatedVehicle.plate}. Novo status: ${updatedVehicle.status === 'Disponível' ? 'Em Rota' : 'Pátio Principal'}`,
        ...prev
      ]);
    }
  };

  const executeExport = (format: 'pdf' | 'csv' | 'xlsx') => {
    onExport(format, 'Controle de Logística Estratégica e Cadeia de Fornecedores', inventory);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#00E5FF]/10 text-[#00E5FF] dark:text-[#00E5FF] border border-[#00E5FF]/30 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest leading-none">
              Control Tower S/A
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-400">GPS & Satélites Sincronizados</span>
          </div>
          <h1 className="text-2xl font-black mt-1.5 tracking-tight text-slate-850 dark:text-slate-100 flex items-center gap-2.5">
            <Truck className="text-[#00E5FF]" size={24} />
            Módulo de Logística, Frotas & Cadeia Global
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestão inteligente de armazenagem, armazéns 3D, monitoramento real-time por satélite e fluxo de faturamento fiscal ERP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-gradient-to-r from-sky-502 via-indigo-600 to-[#00E5FF] hover:from-sky-600 hover:to-indigo-750 font-black text-xs text-white rounded-xl shadow-[0_4px_15px_rgba(0,229,255,0.25)] hover:shadow-[0_4px_25px_rgba(0,229,255,0.4)] cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus size={14} /> Registrar Novo Insumo B2B
          </button>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-850 rounded-xl">
            <button
              onClick={() => executeExport('xlsx')}
              className="p-2 py-1.5 hover:bg-white dark:hover:bg-slate-900 border border-transparent rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-1"
              title="Exportar para Microsoft Excel"
            >
              <FileSpreadsheet size={13} className="text-emerald-500" /> Exportar (XLSX)
            </button>
            <button
              onClick={() => executeExport('pdf')}
              className="p-2 py-1.5 hover:bg-white dark:hover:bg-slate-900 border border-transparent rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-1"
              title="Emitir Dossiê de Auditoria Logística PDF"
            >
              <Download size={13} className="text-rose-500" /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRICS WITH INTERACTIVE TRENDS & GLOW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#00E5FF]/5 group-hover:bg-[#00E5FF]/10 blur-xl rounded-full" />
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">Volumetria de Armazenamento</span>
            <div className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">
              {inventory.reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()} <span className="text-slate-400 text-xs font-normal">UNIDADES</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 font-mono mt-1">
              <TrendingUp size={11} /> +12.4% vs Mês Anterior
            </div>
          </div>
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-[#00E5FF] border border-sky-100 dark:border-slate-800 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
            <Layers size={20} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 group-hover:bg-amber-500/10 blur-xl rounded-full" />
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">Índice Ruptura & Críticos</span>
            <div className="text-2xl font-black text-amber-500 tracking-tight">
              {inventory.filter(i => i.status === 'Estoque Baixo' || i.status === 'Fora de Estoque').length} Insumos
            </div>
            <span className="text-[9.5px] text-slate-400 font-medium block mt-1">Sendo 1 item com ruptura total hoje</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-100 dark:border-slate-800 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
            <AlertTriangle size={20} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 group-hover:bg-emerald-500/10 blur-xl rounded-full" />
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">Monitoramento de Frotas</span>
            <div className="text-2xl font-black text-emerald-500 tracking-tight">
              {vehicles.filter(v => v.status === 'Em Transporte').length} ativos / {vehicles.length}
            </div>
            <span className="text-[9.5px] text-slate-450 block mt-1">Média SLA das transportadoras: 98.4%</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-100 dark:border-slate-800 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
            <Truck size={20} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 group-hover:bg-purple-500/10 blur-xl rounded-full" />
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest font-mono">Auditoria do Almoxarifado</span>
            <div className="text-2xl font-black text-indigo-400 tracking-tight">
              100% Digitalizado
            </div>
            <span className="text-[9.5px] text-slate-405 block mt-1">Check-in de material indexado via RFID</span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-400 border border-purple-100 dark:border-slate-800 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
            <PackageCheck size={20} />
          </div>
        </div>

      </div>

      {/* CORE CONTROL DIVISION: MAIN INTERACTION SCREEN & SIDE FEED TIMELINE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT / CENTER DOUBLE MODULE WORKSPACE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* NAVIGATION SUITE CHANNELS */}
          <div className="flex border-b border-slate-200 dark:border-slate-800/80 text-xs font-bold gap-1 pb-1">
            <button
              onClick={() => setActiveTab('operacoes')}
              className={`p-2.5 px-4.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'operacoes' ? 'bg-[#00E5FF]/15 text-[#00E5FF] dark:text-[#00E5FF] border border-[#00E5FF]/20 shadow-sm font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-905'
              }`}
            >
              <Activity size={14} /> TORRE DE OPERAÇÕES LOGÍSTICAS
            </button>
            <button
              id="tab-estoque-grade"
              onClick={() => setActiveTab('estoque')}
              className={`p-2.5 px-4.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'estoque' ? 'bg-[#00E5FF]/15 text-[#00E5FF] dark:text-[#00E5FF] border border-[#00E5FF]/20 shadow-sm font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-905'
              }`}
            >
              <Layers size={14} /> GRADE CENTRAL DE ESTOQUES & INSUMOS
            </button>
            <button
              onClick={() => setActiveTab('movimentacoes')}
              className={`p-2.5 px-4.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'movimentacoes' ? 'bg-[#00E5FF]/15 text-[#00E5FF] dark:text-[#00E5FF] border border-[#00E5FF]/20 shadow-sm font-black' : 'text-[#059ff] dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History size={14} /> HISTÓRICO FISCAL DE MOVIMENTAÇÕES
            </button>
            <button
              onClick={() => setActiveTab('frota')}
              className={`p-2.5 px-4.5 rounded-xl cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'frota' ? 'bg-[#00E5FF]/15 text-[#00E5FF] dark:text-[#00E5FF] border border-[#00E5FF]/20 shadow-sm font-black' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck size={14} /> GESTÃO DE VEÍCULOS & FROTAS S/A
            </button>
          </div>

          {/* TAB 1: OPERATIONS TOWER WITH SVG FLEET MAP & HEATMAP */}
          {activeTab === 'operacoes' && (
            <div className="space-y-6">
              
              {/* INTERACTIVE TRACKING GRID MAP */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-[#00E5FF]/5 blur-2xl pointer-events-none rounded-full" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Map size={16} className="text-[#00E5FF]" />
                      Mapa de Rastreamento de Frotas Ativas (LatAm GPS Telemetria)
                    </h3>
                    <p className="text-[11px] text-slate-400">Pulsos de satélite demonstrando rotas de transporte de balanças e recebimento de matérias-primas.</p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-950 text-[10px] font-mono text-[#00E5FF] rounded-lg border border-slate-850">
                    <span className="h-2 w-2 rounded-full bg-[#00E5FF] animate-ping"></span>
                    <span>ATUALIZANDO AGORA (REALTIME SECURE)</span>
                  </div>
                </div>

                {/* SVG MAP DRAWING VISUAL */}
                <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-850 overflow-hidden flex items-center justify-center p-2">
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-5 pointer-events-none">
                    {Array.from({ length: 72 }).map((_, i) => (
                      <div key={i} className="border border-white/50 font-mono text-[7px] p-0.5">X-{i}</div>
                    ))}
                  </div>

                  {/* SVG CONTINENTAL ROUTING MAP */}
                  <svg className="w-full h-full max-h-[290px] text-slate-800 pr-5" viewBox="0 0 800 350" fill="none">
                    {/* Outline representing transport routes */}
                    <path d="M 120,40 C 240,110 320,130 450,180 C 520,200 680,250 710,290" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 5" />
                    <path d="M 280,310 C 340,250 450,180 550,140" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
                    <path d="M 100,280 C 250,225 350,150 450,180" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="3" strokeLinecap="round" />

                    {/* Route connection lines */}
                    <line x1="150" y1="80" x2="450" y2="180" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="450" y1="180" x2="650" y2="280" stroke="#6366f1" strokeWidth="1.5" />
                    <line x1="280" y1="310" x2="450" y2="180" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />

                    {/* Nodes Map points */}
                    <circle cx="150" cy="80" r="8" fill="#1e293b" stroke="#00E5FF" strokeWidth="2.5" className="cursor-pointer" />
                    <circle cx="150" cy="80" r="3" fill="#00E5FF" />
                    <text x="135" y="62" fill="#fff" className="text-[10px] uppercase font-mono font-black">Matriz SP</text>

                    <circle cx="450" cy="180" r="10" fill="#1e293b" stroke="#6366f1" strokeWidth="3" />
                    <circle cx="450" cy="180" r="4" fill="#6366f1" className="animate-pulse" />
                    <text x="465" y="184" fill="#6366f1" className="text-[10px] uppercase font-mono font-black font-semibold">Hub Sul (PR)</text>

                    <circle cx="650" cy="280" r="8" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="650" cy="280" r="3" fill="#10b981" />
                    <text x="630" y="300" fill="#10b981" className="text-[10px] uppercase font-mono font-black">Filial RJ</text>

                    <circle cx="280" cy="310" r="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="280" cy="310" r="3" fill="#f59e0b" />
                    <text x="295" y="315" fill="#f59e0b" className="text-[10px] uppercase font-mono font-black">LatAm Hub</text>

                    {/* Dynamic moving trucks visual */}
                    <g transform="translate(300,130)" className="cursor-pointer">
                      <polygon points="0,0 20,-10 40,0 40,10 0,10" fill="#00E5FF" opacity="0.8" />
                      <circle cx="10" cy="10" r="4" fill="#fff" />
                      <circle cx="30" cy="10" r="4" fill="#fff" />
                      <text x="4" y="-14" fill="#00E5FF" className="text-[8px] font-mono font-bold uppercase tracking-wider">Actros NEX-8I92</text>
                    </g>

                    <g transform="translate(530,220)">
                      <rect width="36" height="15" rx="3" fill="#6366f1" opacity="0.85" />
                      <circle cx="10" cy="15" r="3" fill="#111" />
                      <circle cx="28" cy="15" r="3" fill="#111" />
                      <text x="2" y="-5" fill="#a5b4fc" className="text-[8px] font-mono leading-none font-bold">Scania NEX-4A22</text>
                    </g>
                  </svg>

                  {/* FLOAT CARD MAP EXPLORATION */}
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded bg-indigo-505/20 text-[#00E5FF] border border-indigo-500/20 flex items-center justify-center">
                        <MapPin size={14} className="animate-bounce" />
                      </div>
                      <div className="text-left font-sans">
                        <p className="font-extrabold text-white">Mercedes NEX-8I92 em Trânsito</p>
                        <p className="text-[10px] text-slate-400">Condutor: Marcos Mendes | Carga: Balanças Rodoviárias Ambev S/A</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 w-full sm:w-auto">
                      <button 
                        onClick={() => handleSimulateDispatch('vh-1')} 
                        className="flex-1 sm:flex-none p-2 px-3.5 bg-slate-950 hover:bg-slate-850 text-[11px] font-black border border-slate-800 hover:border-slate-700 rounded-lg text-[#00E5FF] cursor-pointer transition-all"
                      >
                        Bypass Localizador GPS
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* OUTWARD ROW: WAREHOUSE STOCKS STORAGE HEATMAP AREA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* SHELVING OCCUPANCY HEATMAP */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4.5 space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono flex items-center gap-1">
                      <Flame size={12} className="text-rose-500" />
                      Heatmap de Ocupação S/A
                    </h3>
                    <p className="text-[11px] text-slate-500">Mapeamento físico de prateleiras.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    {heatGrids.map((grid) => {
                      const isSelected = selectedHeatGrid === grid.id;
                      return (
                        <button
                          key={grid.id}
                          onClick={() => setSelectedHeatGrid(grid.id)}
                          className={`p-3 rounded-xl border flex flex-col justify-between items-center cursor-pointer transition-all ${
                            isSelected ? 'ring-2 ring-[#00E5FF]/80 scale-[1.01]' : ''
                          } ${
                            grid.occupancy >= 95 ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-bold' :
                            grid.occupancy >= 80 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold' :
                            grid.occupancy === 0 ? 'bg-slate-100 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850/50 text-slate-510' :
                            'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-medium'
                          }`}
                        >
                          <span className="font-mono font-black text-[12px]">{grid.id}</span>
                          <span className="text-[9px] mt-1 font-semibold">{grid.occupancy === 0 ? 'Vazio' : `${grid.occupancy}% Cheio`}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-2 text-[10px] text-slate-400 rounded-lg border border-slate-150 dark:border-slate-850/80">
                    💡 <span className="font-bold">Setor D2 (Lote Epóxi)</span> atingiu limite físico de armazenagem segura. Proposta de remanejamento para Bloco C em análise.
                  </div>
                </div>

                {/* SELECTED HEAT GRID DETAIL */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 md:col-span-2 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase font-mono text-[#00E5FF]">Setor de Almoxarifado Selecionado</h4>
                        <p className="text-[11px] text-slate-400">Detalhes métricos da prateleira {selectedHeatGrid}</p>
                      </div>
                      <span className="p-1 px-2.5 bg-slate-100 dark:bg-slate-950 font-mono text-[10px] font-black rounded-lg text-indigo-400 border border-slate-200 dark:border-slate-850">
                        Galpão Principal A
                      </span>
                    </div>

                    {selectedHeatGrid ? (
                      (() => {
                        const gridDetails = heatGrids.find(g => g.id === selectedHeatGrid);
                        if (!gridDetails) return null;
                        return (
                          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-150 dark:border-slate-850 rounded-xl">
                                <span className="text-[10px] text-slate-400 block uppercase font-mono">Espaço Ocupado</span>
                                <span className="text-base font-black text-slate-800 dark:text-white">{gridDetails.occupancy}% ocupação</span>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-150 dark:border-slate-850 rounded-xl">
                                <span className="text-[10px] text-slate-400 block uppercase font-mono">Alocação de Conteúdo</span>
                                <span className="text-base font-black text-indigo-400 font-sans">{gridDetails.category}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase font-mono">Recomendação Operacional</span>
                              <p className="p-3 bg-slate-950 border border-slate-850 rounded-xl font-mono text-[10.5px]">
                                {gridDetails.occupancy >= 95 ? (
                                  <span className="text-rose-400 font-bold block">🚨 ALERTA: Capacidade crítica estourada. Suspender recepção de matérias no galpão até liberação física dos estoques de vendas e exportação de balanças.</span>
                                ) : gridDetails.occupancy <= 20 ? (
                                  <span className="text-[#00E5FF] font-bold block">✔ ESPAÇO DISPONÍVEL: Excelente espaço para remanejamento de liga de ferro fundida atualmente sob risco do Galpão C.</span>
                                ) : (
                                  <span className="text-emerald-400 font-semibold block">🍀 OPERAÇÃO NORMAL: A divisão de prateleiras atende perfeitamente a segurança de carregamento e temperatura ambiente exigida.</span>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-slate-400 italic text-center py-8">Selecione uma prateleira no calorímetro ao lado para inspecionar.</p>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-805 pt-3.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium font-mono">SLA de Calibração Balança:</span>
                    <span className="text-emerald-500 font-black">✔ Certificado Inmetro Válido</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: INVENTORY TABLE REDESIGN */}
          {activeTab === 'estoque' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
              
              {/* FILTERS PANEL */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/80 rounded-2xl text-xs font-semibold select-none">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Status sub filters */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Estoque Crítico</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="todos">Visualizar Todos Status</option>
                      <option value="ok">Disponíveis (Em Estoque)</option>
                      <option value="baixo">Alerta Estoque Baixo</option>
                      <option value="zerado">Ruptura (Fora de Estoque)</option>
                    </select>
                  </div>

                  {/* Category filters */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Categoria</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="todos">Todas Categorias</option>
                      <option value="Matéria-Prima">Matéria-Prima</option>
                      <option value="Componentes">Componentes</option>
                      <option value="Insumos">Insumos</option>
                      <option value="Estoque de Vendas">Estoque de Vendas</option>
                    </select>
                  </div>

                  {/* Warehouse filters */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Armazém</span>
                    <select
                      value={warehouseFilter}
                      onChange={(e) => setWarehouseFilter(e.target.value)}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="todos">Todos Armazéns</option>
                      <option value="Galpão Principal A">Galpão Principal A</option>
                      <option value="Galpão Secundário C">Galpão Secundário C</option>
                      <option value="Expedição Log 1">Expedição Log 1</option>
                      <option value="Pátio de Carga 2">Pátio de Carga 2</option>
                    </select>
                  </div>
                </div>

                {/* Counter indicator */}
                <div className="text-right text-[10px] font-mono text-slate-500 font-bold shrink-0">
                  <span className="text-[#00E5FF]">{filteredInventory.length}</span> itens correspondendo aos critérios
                </div>
              </div>

              {/* ACTIVE FILTER CHIPS ROW */}
              {(statusFilter !== 'todos' || warehouseFilter !== 'todos' || categoryFilter !== 'todos') && (
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[10px]">
                  <span className="font-mono text-slate-500 uppercase font-bold mr-1">Chips Ativos:</span>
                  {statusFilter !== 'todos' && (
                    <span className="inline-flex items-center gap-1 bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 border border-[#00E5FF]/20 rounded-full font-mono">
                      Status: {statusFilter}
                      <button onClick={() => setStatusFilter('todos')} className="hover:text-white cursor-pointer ml-1">×</button>
                    </span>
                  )}
                  {categoryFilter !== 'todos' && (
                    <span className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2 py-0.5 border border-indigo-500/20 rounded-full">
                      Categoria: {categoryFilter}
                      <button onClick={() => setCategoryFilter('todos')} className="hover:text-white cursor-pointer ml-1">×</button>
                    </span>
                  )}
                  {warehouseFilter !== 'todos' && (
                    <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-0.5 border border-purple-500/20 rounded-full">
                      Armazém: {warehouseFilter}
                      <button onClick={() => setWarehouseFilter('todos')} className="hover:text-white cursor-pointer ml-1">×</button>
                    </span>
                  )}
                  <button 
                    onClick={() => { setStatusFilter('todos'); setWarehouseFilter('todos'); setCategoryFilter('todos'); }}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer ml-auto underline"
                  >
                    Resetar Filtros
                  </button>
                </div>
              )}

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto border border-slate-150 dark:border-slate-850 rounded-2xl bg-slate-50/15 dark:bg-slate-950/20">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-950/50 text-slate-600 dark:text-slate-4c0 border-b border-slate-205 dark:border-slate-850 uppercase font-mono tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5"><div className="flex items-center gap-1"><GripVertical size={11} className="text-slate-500 shrink-0" /> Código</div></th>
                      <th className="p-3.5">Nome Consolidado</th>
                      <th className="p-3.5">Categoria</th>
                      <th className="p-3.5 text-right">Saldo Atual</th>
                      <th className="p-3.5">Armazém Alocado</th>
                      <th className="p-3.5">Mínimo Crítico</th>
                      <th className="p-3.5">Última Telemetria</th>
                      <th className="p-3.5">Status Alerta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-slate-700 dark:text-slate-305">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                          Nenhum insumo encontrado nesta categoria. Tente usar outros filtros.
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((item) => {
                        const isItemSelected = selectedInventoryItem === item.id;
                        return (
                          <tr 
                            key={item.id} 
                            onClick={() => setSelectedInventoryItem(item.id)}
                            className={`transition-colors cursor-pointer ${
                              isItemSelected 
                                ? 'bg-indigo-500/10 dark:bg-indigo-950/30' 
                                : 'hover:bg-slate-50/70 dark:hover:bg-slate-900/30'
                            }`}
                          >
                            <td className="p-3.5 font-mono font-black text-slate-500 select-all">{item.code}</td>
                            <td className="p-3.5">
                              <div className="flex flex-col">
                                <span className="font-extrabold text-slate-900 dark:text-slate-100">{item.name}</span>
                                <span className="text-[10px] text-slate-450 mt-0.5">UID: {item.id}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="p-1 px-2.5 bg-slate-100 dark:bg-slate-800 text-[9.5px] font-bold text-slate-505 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-750">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-3.5 text-right font-mono font-black text-[13px] text-slate-900 dark:text-slate-205">
                              {item.quantity.toLocaleString()} <span className="text-[9.5px] text-slate-400 font-sans font-normal">{item.unit}</span>
                            </td>
                            <td className="p-3.5 font-medium text-slate-502">
                              <div className="flex items-center gap-1">
                                <MapPin size={11} className="text-[#00E5FF]" />
                                <span>{item.warehouse}</span>
                              </div>
                            </td>
                            <td className="p-3.5 font-mono text-slate-400 text-right">{item.minStock.toLocaleString()} {item.unit}</td>
                            <td className="p-3.5 text-slate-400 font-mono text-[11px]">{new Date(item.lastMovement).toLocaleDateString('pt-BR')} {new Date(item.lastMovement).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="p-3.5">
                              <span
                                className={`inline-block border text-[10px] font-black font-mono tracking-wide px-2.5 py-0.5 rounded-full ${
                                  item.status === 'Em Estoque'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                    : item.status === 'Estoque Baixo'
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 animate-pulse'
                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                                }`}
                              >
                                {item.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION / EXPORT DRAWER DESIGN BAR */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-850 pt-4.5 gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Colunas Congeladas:</span>
                  <span className="p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded font-code">Código</span>
                  <span className="p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded font-code">Saldo Atual</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Visualizando 1-{filteredInventory.length} de {inventory.length} insumos catalogados</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: HISTORY OF MOVEMENTS */}
          {activeTab === 'movimentacoes' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-105 dark:border-slate-850 pb-3">
                <h3 className="text-xs font-black font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                  <ClipboardList size={14} /> Histórico Auditado de Entradas, Ajustes & Saídas Fiscais
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Total de {movements.length} logs consolidados</span>
              </div>

              <div className="overflow-x-auto border border-slate-150 dark:border-slate-850 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 border-b border-slate-150 dark:border-slate-850 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="p-3.5">Registro UID</th>
                      <th className="p-3.5">Responsável S/A</th>
                      <th className="p-3.5">Insumo</th>
                      <th className="p-3.5">Tipo Operacional</th>
                      <th className="p-3.5 text-right">Volumetria</th>
                      <th className="p-3.5">Doc Ref Fiscal</th>
                      <th className="p-3.5">Selo Temporal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                    {movements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-all font-sans">
                        <td className="p-3.5 font-mono text-slate-400 text-[10.5px]">{mov.id}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-950 text-[10px] font-bold text-[#00E5FF] dark:text-[#00E5FF] border border-slate-200 dark:border-slate-850 flex items-center justify-center shrink-0">
                              {mov.responsible.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-extrabold text-[#00E5FF] dark:text-[#00E5FF]">{mov.responsible}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800 dark:text-white">{mov.itemName}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 p-1 px-2 text-[10px] uppercase font-black font-code rounded ${
                            mov.type === 'Entrada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-450'
                          }`}>
                            {mov.type === 'Entrada' ? '+' : '-'} {mov.type}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-mono font-black text-slate-900 dark:text-slate-100">{mov.quantity.toLocaleString()}</td>
                        <td className="p-3.5 font-mono text-indigo-400 font-bold select-all tracking-wider">{mov.docRef}</td>
                        <td className="p-3.5 text-slate-400 font-mono text-[10.5px]">
                          {new Date(mov.date).toLocaleDateString('pt-BR')} {new Date(mov.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-wider block">Notas Digitais Sefaz Integradas</span>
                <p className="text-[11px] text-slate-400">
                  Os registros de saídas com prefixo <span className="text-white font-mono font-bold">PED-</span> e <span className="text-white font-mono font-bold">REK-</span> são gerados e validados automaticamente pela API XML da Receita Nacional de conformidade fiscal ativa.
                </p>
              </div>

            </div>
          )}

          {/* TAB 4: VEHICLES & EXTRA FLEET LOGS */}
          {activeTab === 'frota' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-3">
                <div>
                  <h3 className="text-xs font-black font-mono uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                    <Truck size={14} /> Gestão e Cobertura Geográfica de Frotas de Transportadoras S/A
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Acione o botão Bypass para alterar em tempo real simulated via telemetry payload.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicles.map((v) => {
                  const isSelected = selectedVehicle === v.id;
                  return (
                    <div 
                      key={v.id} 
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`bg-slate-50 dark:bg-slate-950/40 border rounded-xl p-4 flex flex-col space-y-3.5 transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected ? 'border-[#00E5FF] dark:border-[#00E5FF] shadow-[0_4px_15px_rgba(0,229,255,0.1)]' : 'border-slate-250 dark:border-slate-850 hover:border-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="p-1 px-2.5 bg-slate-200 dark:bg-slate-850 text-slate-800 dark:text-slate-201 rounded font-mono text-[10px] font-black">
                          PLACA: {v.plate}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                          <span className={`h-2.5 w-2.5 rounded-full ${
                            v.status === 'Disponível' ? 'bg-emerald-500' : v.status === 'Em Transporte' ? 'bg-sky-500 animate-pulse' : 'bg-rose-500'
                          }`}></span>
                          <span className="font-bold text-slate-400">{v.status.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 group-hover:text-[#00E5FF] transition-colors">{v.model}</h4>
                        <p className="text-[11px] text-slate-400">Condutor Terceirizado: <span className="font-extrabold text-slate-500 dark:text-slate-300">{v.driver}</span></p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-[11.5px] font-semibold text-slate-400 font-mono">
                        <span>Capacidade Base Load:</span>
                        <span className="font-mono text-[#00E5FF] font-bold">{v.loadCapacity}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateDispatch(v.id);
                        }}
                        className="w-full text-center py-2.5 text-[11px] font-mono font-black border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-900 hover:bg-[#00E5FF] hover:text-slate-950 transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Activity size={12} className={v.status === 'Em Transporte' ? 'animate-spin' : ''} />
                        Bypass Status Operacional
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* DETAILED DRILL ANALYSIS */}
              {selectedVehicle && (
                <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-850/80 space-y-3 text-xs">
                  {(() => {
                    const activeVehicle = vehicles.find(v => v.id === selectedVehicle);
                    if (!activeVehicle) return null;
                    return (
                      <>
                        <h4 className="font-mono text-[10px] font-black text-[#00E5FF] uppercase">Relatório de Telemetria Consolidada ({activeVehicle.plate})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-400 block font-mono">Consumo Médio</span>
                            <span className="font-bold text-slate-800 dark:text-white">3.4 km/L Diesel S10</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-400 block font-mono">Odômetro Geral</span>
                            <span className="font-mono text-slate-800 dark:text-white">124.908 km</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-400 block font-mono">Rotômetro Atual</span>
                            <span className="font-mono text-[#00E5FF] font-bold">BR-101 KM 324 Sul</span>
                          </div>
                          <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-400 block font-mono">Próxima Manutenção</span>
                            <span className="font-mono text-amber-500 font-bold">Daqui a 4.100 km</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

            </div>
          )}

        </div>

        {/* RIGHT COLUMN (30%): REAL-TIME LOGS FEED, COMMENTS ACCORDION, UPLOAD INTERACTION PANEL */}
        <div className="space-y-6">
          
          {/* LOGS EVENT ENGINE STREAM CONTROLLER */}
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col h-60 justify-between">
            <div className="absolute top-0 right-0 h-16 w-16 bg-[#00E5FF]/5 blur-xl rounded-full" />
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <span className="text-[10px] font-mono uppercase bg-slate-950 p-1 px-2 border border-slate-850 rounded text-slate-400 font-extrabold flex items-center gap-1.5">
                <Flame size={11} className="text-rose-500 inline-block animate-ping" />
                Doutrina Telemetria IoT (Realtime)
              </span>
              <button 
                onClick={() => {
                  setLiveLogs(prev => [`📥 [MANUAL TRIGGER] Evento simulado de auditoria geral às ${new Date().toLocaleTimeString()} - GPS Ativo`, ...prev]);
                }} 
                className="text-[10px] text-sky-400 hover:text-white underline cursor-pointer"
              >
                Pulsar Evento
              </button>
            </div>

            {/* SCROLL STREAM */}
            <div className="flex-1 overflow-y-auto font-mono text-[9.5px] text-slate-350 space-y-1.5 py-2 pr-1 select-none scrollbar-thin">
              {liveLogs.map((log, index) => (
                <div key={index} className="hover:text-white transition-colors">
                  <span className="text-[#00E5FF]/85 mr-1 font-bold">[{new Date().toLocaleDateString('pt-BR').substring(0, 5)}]</span>
                  {log}
                </div>
              ))}
            </div>

            <div className="text-[9px] text-slate-500 text-center border-t border-slate-800/80 pt-2 font-mono mt-1">
              Satélite IP-SEC GPS ativo de latência média de 40ms.
            </div>
          </div>

          {/* DRAG & DROP DIGITAL FILE ATTACHERS */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            className={`transition-all bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between ${
              dragOver ? 'border-[#00E5FF] dark:bg-[#00E5FF]/5 bg-sky-502/10Scale-[1.01]' : 'border-slate-200 dark:border-slate-800/80 focus-within:border-[#00E5FF]'
            }`}
          >
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase font-mono tracking-widest flex items-center gap-1.5">
                <FileUp size={14} className="text-[#00E5FF]" />
                Central de Manifestos & Certidões S/A
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Arraste e solte o XML/PDF da NF-e para arquivamento ou anexação ao Manifesto Sefaz.</p>
            </div>

            {/* DRAG ZONE BOX */}
            <div className="border border-dashed border-slate-300 dark:border-slate-800/80 hover:border-[#00E5FF]/40 rounded-xl p-4 text-center cursor-pointer relative group bg-slate-50 dark:bg-slate-950/20">
              <input 
                type="file" 
                multiple={false} 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const newAttached: AttachedFile = {
                      id: `file-${Date.now()}`,
                      name: file.name.toUpperCase(),
                      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                      uploader: 'Leonardo Albuquerque',
                      timestamp: new Date().toISOString().split('T')[0]
                    };
                    setAttachedFiles([newAttached, ...attachedFiles]);
                    setLiveLogs(prev => [`📥 [ARQUIVO] Documento anexado com sucesso: ${file.name.toUpperCase()}`, ...prev]);
                  }
                }}
              />
              <FileUp className="mx-auto text-slate-400 group-hover:text-[#00E5FF] transition-all" size={24} />
              <p className="text-[10px] text-slate-500 mt-2">Clique ou solte arquivo XML do DANFE</p>
              <p className="text-[8.5px] font-mono text-slate-502">Max: 10MB por lote</p>
            </div>

            {/* LIST OF ATTACHED ARCHVES */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-extrabold tracking-wider block mb-1">Dossiê de Arquivos Anexados ({attachedFiles.length})</span>
              {attachedFiles.map((file) => (
                <div key={file.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileSpreadsheet size={13} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-700 dark:text-slate-100 truncate pr-2">{file.name}</span>
                  </div>
                  <span className="font-mono text-slate-400 shrink-0 text-[10px]">{file.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHIEF LOGISTICS MANAGER COMENTS & WORKFLOW APPROVAL LOG */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase font-mono tracking-widest flex items-center gap-1.5">
                <MessageSquare size={14} className="text-indigo-400" />
                Mural de Comentários Internos & Alertas
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Comentários com carimbo de login super-criptografado do operador.</p>
            </div>

            {/* COMMENTS LOOP */}
            <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
              {comments.map((com) => (
                <div key={com.id} className="space-y-1 border-b border-slate-100 dark:border-slate-805 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 dark:text-white text-[11.5px]">{com.user}</span>
                      <span className="p-0.5 px-1.5 bg-slate-100 dark:bg-slate-950 text-[8.5px] font-mono text-[#00E5FF] dark:text-[#00E5FF] border border-slate-200 dark:border-slate-850 rounded">
                        {com.role}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px]">{com.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed font-sans mt-1">
                    {com.message}
                  </p>
                </div>
              ))}
            </div>

            {/* FORM INPUT FOR COMMENT */}
            <form onSubmit={handlePostComment} className="flex gap-2.5 items-center pt-2">
              <input
                type="text"
                placeholder="Insira notas operacionais de frotas..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-[#00E5FF]/40 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <button 
                type="submit" 
                className="p-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl shadow cursor-pointer transition-all shrink-0 border border-transparent"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* COMPACT REALTIME ALARMS NOTIFIER FOOTER PANEL */}
      <div className="p-4 rounded-xl bg-gradient-to-tr from-sky-503/10 via-indigo-950/20 to-slate-950/20 border border-[#00E5FF]/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <BadgeAlert size={16} className="text-[#00E5FF] shrink-0 animate-bounce" />
          <div className="text-left">
            <span className="font-black text-slate-850 dark:text-white block md:inline">Torre de Controle Ativa:</span>
            <span className="text-slate-500 dark:text-slate-400 pl-0 md:pl-2">Atualmente sincronizado com 4 filiais TitanX no Brasil e LatAm para conformidade de estoque.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 shrink-0 select-none">
          <CheckCircle size={10} className="text-emerald-500" /> Criptografia TitanX v3 CISA ativada
        </div>
      </div>

      {/* MODAL WINDOW INSIGHT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-55 p-4">
          {/* Box frame */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#00E5FF]/10 text-[#00E5FF] dark:text-[#00E5FF] border border-[#00E5FF]/15 rounded-xl">
                  <Layers size={16} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Registrar Insumo no Catálogo B2B S/A
                  </h2>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-[#00E5FF]">Alocação de estoque automatizada</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white roundedcursor-pointer bg-transparent">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="space-y-4 mt-6 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Código Identificador</label>
                  <input
                    type="text"
                    required
                    placeholder="MAT-ALU-003"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Unidade de Medida</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none cursor-pointer font-bold text-slate-400"
                  >
                    <option value="kg">kg (Quilogramas)</option>
                    <option value="unidades">unidades (Peças)</option>
                    <option value="L">L (Litros)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Nome Detalhado do Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Liga de Cobre 200 Amperes"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Saldo Inicial de Lote</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 focus:outline-none font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Armazém Destinatário</label>
                  <select
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none font-bold text-slate-400"
                  >
                    <option value="Galpão Principal A">Galpão Principal A</option>
                    <option value="Galpão Secundário C">Galpão Secundário C</option>
                    <option value="Expedição Log 1">Expedição Log 1</option>
                    <option value="Pátio de Carga 2">Pátio de Carga 2</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">Categoria Cadastral</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 cursor-pointer focus:outline-none font-bold text-slate-400"
                >
                  <option value="Matéria-Prima">Matéria-Prima</option>
                  <option value="Componentes">Componentes</option>
                  <option value="Insumos">Insumos</option>
                  <option value="Estoque de Vendas">Estoque de Vendas</option>
                </select>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 text-center py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-905 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl font-bold cursor-pointer text-slate-500 hover:text-slate-800 transition-all"
                >
                  Cancelar Operação
                </button>
                <input 
                  type="submit" 
                  value="Confirmar Cadastro de Lote" 
                  className="flex-1 bg-gradient-to-r from-sky-500 to-[#00E5FF] hover:from-sky-600 text-[#000a12] font-black py-3 rounded-xl cursor-pointer transition-all block text-center" 
                />
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
