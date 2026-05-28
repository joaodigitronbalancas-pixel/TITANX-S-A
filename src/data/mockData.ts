import {
  User,
  InventoryItem,
  MovementRecord,
  TransportVehicle,
  FinancialRecord,
  Invoice,
  Lead,
  BrandContract,
  MarketingCampaign,
  Employee,
  ProductionOrder,
  ProjectTask,
  HelpdeskTicket,
  TechAsset,
  ReleaseItem,
  StrategicGoal,
  AuditLog
} from '../types';

export const defaultUsers: User[] = [
  {
    id: 'usr-1',
    username: 'superadmin',
    name: 'Super Administrador TitanX',
    email: 'admin@titanxerp.com',
    role: 'Super Admin',
    company: 'TitanX Holding S/A',
    mfaEnabled: true,
    mustChangePassword: true
  },
  {
    id: 'usr-2',
    username: 'diretorialeonardo',
    name: 'Leonardo Albuquerque',
    email: 'leonardo@titanxerp.com',
    role: 'Diretoria',
    company: 'TitanX S/A - Indústria',
    mfaEnabled: true
  },
  {
    id: 'usr-3',
    username: 'financeirobeatriz',
    name: 'Beatriz Vasconcelos',
    email: 'beatriz.v@titanxerp.com',
    role: 'Financeiro',
    company: 'TitanX Holding S/A',
    mfaEnabled: true
  }
];

export const defaultInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    code: 'MAT-PCM-001',
    name: 'Aço Carbono Premium AISI 1045',
    category: 'Matéria-Prima',
    quantity: 4500,
    minStock: 1000,
    unit: 'kg',
    warehouse: 'Galpão Principal A',
    status: 'Em Estoque',
    lastMovement: '2026-05-28T14:30:00Z'
  },
  {
    id: 'inv-2',
    code: 'MAT-ALU-002',
    name: 'Liga Alumínio T6 Fundido',
    category: 'Matéria-Prima',
    quantity: 820,
    minStock: 900,
    unit: 'kg',
    warehouse: 'Galpão Secundário C',
    status: 'Estoque Baixo',
    lastMovement: '2026-05-27T09:12:00Z'
  },
  {
    id: 'inv-3',
    code: 'PROD-NEX-400',
    name: 'Célula de Medição Digital X400',
    category: 'Estoque de Vendas',
    quantity: 124,
    minStock: 20,
    unit: 'unidades',
    warehouse: 'Expedição Log 1',
    status: 'Em Estoque',
    lastMovement: '2026-05-28T16:45:00Z'
  },
  {
    id: 'inv-4',
    code: 'MAT-ELE-090',
    name: 'Microcontrolador Cortex-M4 IP68',
    category: 'Componentes',
    quantity: 0,
    minStock: 150,
    unit: 'unidades',
    warehouse: 'Galpão Principal A',
    status: 'Fora de Estoque',
    lastMovement: '2026-05-25T11:00:00Z'
  },
  {
    id: 'inv-5',
    code: 'PROD-BAL-100',
    name: 'Balança Rodoviária TitanX-V3',
    category: 'Estoque de Vendas',
    quantity: 15,
    minStock: 5,
    unit: 'unidades',
    warehouse: 'Pátio de Carga 2',
    status: 'Em Estoque',
    lastMovement: '2026-05-28T10:15:00Z'
  },
  {
    id: 'inv-6',
    code: 'MAT-PNT-05',
    name: 'Tinta Epóxi Industrial Anticorrosiva',
    category: 'Insumos',
    quantity: 340,
    minStock: 500,
    unit: 'L',
    warehouse: 'Galpão Secundário C',
    status: 'Estoque Baixo',
    lastMovement: '2026-05-24T15:20:00Z'
  }
];

export const defaultMovements: MovementRecord[] = [
  {
    id: 'mov-1',
    itemId: 'inv-1',
    itemName: 'Aço Carbono Premium AISI 1045',
    type: 'Entrada',
    quantity: 2000,
    responsible: 'Adilson Silveira (Log)',
    date: '2026-05-28T14:30:00Z',
    docRef: 'NF-10293'
  },
  {
    id: 'mov-2',
    itemId: 'inv-3',
    itemName: 'Célula de Medição Digital X400',
    type: 'Saída',
    quantity: 12,
    responsible: 'Juliana Castro (Vendas)',
    date: '2026-05-28T16:45:00Z',
    docRef: 'PED-45920'
  }
];

export const defaultVehicles: TransportVehicle[] = [
  {
    id: 'vh-1',
    plate: 'NEX-8I92',
    model: 'Caminhão Mercedes-Benz Actros 2651',
    driver: 'Marcos Roberto Mendes',
    status: 'Em Transporte',
    loadCapacity: '25 Toneladas'
  },
  {
    id: 'vh-2',
    plate: 'NEX-4A22',
    model: 'Scania R540 Traçado',
    driver: 'Renato Nogueira',
    status: 'Disponível',
    loadCapacity: '35 Toneladas'
  },
  {
    id: 'vh-3',
    plate: 'NEX-3X88',
    model: 'Iveco Daily 35-150 Furgão',
    driver: 'Eduardo Guedes Alves',
    status: 'Manutenção',
    loadCapacity: '3.5 Toneladas'
  }
];

export const defaultFinancials: FinancialRecord[] = [
  {
    id: 'fin-1',
    type: 'Receita',
    category: 'Vendas Corporativas',
    description: 'Faturamento de Venda - Balança Pesada R-100 S/A',
    amount: 145000.00,
    date: '2026-05-28',
    status: 'Liquidado',
    costCenter: 'Vendas Internas - Sul'
  },
  {
    id: 'fin-2',
    type: 'Receita',
    category: 'Vendas Corporativas',
    description: 'Anuidade Licença Plataforma TitanX IoT Cloud',
    amount: 18450.00,
    date: '2026-05-27',
    status: 'Pendente',
    costCenter: 'SaaS SaaS e Licenças'
  },
  {
    id: 'fin-3',
    type: 'Despesa',
    category: 'Custos de Matéria-Prima',
    description: 'Pagamento Fornecedor Gerdau Ltda - Bobinas de Aço',
    amount: 87400.00,
    date: '2026-05-28',
    status: 'Liquidado',
    costCenter: 'Supri_Fábrica'
  },
  {
    id: 'fin-4',
    type: 'Despesa',
    category: 'Salários e Encargos',
    description: 'Folha de Pagamento Consolidada - TitanX RH 05/2026',
    amount: 324500.00,
    date: '2026-05-30',
    status: 'Pendente',
    costCenter: 'Corporativo Geral'
  },
  {
    id: 'fin-5',
    type: 'Despesa',
    category: 'Infraestrutura Tecnológica',
    description: 'Hospedagem Google Cloud Platform & BigQuery',
    amount: 14200.00,
    date: '2026-05-25',
    status: 'Liquidado',
    costCenter: 'TI Cloud Ops'
  },
  {
    id: 'fin-6',
    type: 'Despesa',
    category: 'Marketing e Branding',
    description: 'Campanha Google Search Ads & LinkedIn B2B',
    amount: 12000.00,
    date: '2026-05-20',
    status: 'Atrasado',
    costCenter: 'Mkt Comercial'
  }
];

export const defaultInvoices: Invoice[] = [
  {
    id: 'nf-1',
    number: 'NFE-00010942',
    client: 'Ambev Companhia de Bebidas do Brasil',
    cnpj: '03.012.355/0001-99',
    value: 235000.00,
    tax: 37600.00,
    type: 'NF-e',
    status: 'Autorizada',
    issueDate: '2026-05-28'
  },
  {
    id: 'nf-2',
    number: 'NFE-00010943',
    client: 'Klabin Embalagens S/A',
    cnpj: '89.430.122/0002-31',
    value: 12400.00,
    tax: 1984.00,
    type: 'NF-e',
    status: 'Pendente',
    issueDate: '2026-05-28'
  },
  {
    id: 'nf-3',
    number: 'NFS-00004928',
    client: 'Vale Logística Integradora S.A.',
    cnpj: '33.512.940/0001-02',
    value: 45000.00,
    tax: 2250.00,
    type: 'NFS-e',
    status: 'Autorizada',
    issueDate: '2026-05-26'
  },
  {
    id: 'nf-4',
    number: 'NFE-00010940',
    client: 'Metalúrgica Gerdau Paraná Ltda',
    cnpj: '02.112.553/0004-98',
    value: 68500.00,
    tax: 10960.00,
    type: 'NF-e',
    status: 'Cancelada',
    issueDate: '2026-05-24'
  }
];

export const defaultLeads: Lead[] = [
  {
    id: 'led-1',
    name: 'Roberto Arruda (Diretor Infra)',
    company: 'CCR Rodovias do Sul',
    value: 450000.00,
    status: 'Em Negociação',
    email: 'roberto.arruda@ccrsul.com.br',
    phone: '(11) 98845-3122',
    assignedTo: 'Carlos Eduardo (Comercial)',
    lastContact: '2026-05-27'
  },
  {
    id: 'led-2',
    name: 'Letícia Malta (Compradora)',
    company: 'Braskem Química Nordeste',
    value: 290000.00,
    status: 'Proposta Enviada',
    email: 'leticia.malta@braskem.com',
    phone: '(81) 94432-8211',
    assignedTo: 'Carlos Eduardo (Comercial)',
    lastContact: '2026-05-28'
  },
  {
    id: 'led-3',
    name: 'Guilherme Peixoto (Diretor Op)',
    company: 'Coopercitrus Cooperativa Agro',
    value: 120000.00,
    status: 'Ganha',
    email: 'guilherme.p@coopercitrus.com.br',
    phone: '(16) 99876-1212',
    assignedTo: 'Patrícia Sales (Comercial)',
    lastContact: '2026-05-26'
  },
  {
    id: 'led-4',
    name: 'Tatiana Gouveia (Suprimentos)',
    company: 'Usiminas S/A Cubatão',
    value: 650000.00,
    status: 'Contato Inicial',
    email: 'tatiana.gouveia@usiminas.com.br',
    phone: '(13) 91223-4554',
    assignedTo: 'Patrícia Sales (Comercial)',
    lastContact: '2026-05-28'
  }
];

export const defaultContracts: BrandContract[] = [
  {
    id: 'ct-1',
    code: 'CON-2026-0589',
    client: 'Ambev Companhia de Bebidas',
    value: 1450000.00,
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    status: 'Ativo'
  },
  {
    id: 'ct-2',
    code: 'CON-2026-0312',
    client: 'Vale Logística S.A.',
    value: 890000.00,
    startDate: '2026-03-15',
    endDate: '2027-03-14',
    status: 'Ativo'
  },
  {
    id: 'ct-3',
    code: 'CON-2024-0112',
    client: 'Gerdau Paraná S/A',
    value: 320000.00,
    startDate: '2024-06-01',
    endDate: '2026-06-01',
    status: 'Em Revisão'
  }
];

export const defaultCampaigns: MarketingCampaign[] = [
  {
    id: 'cmp-1',
    name: 'TitanX Agro-Scale B2B Core',
    channels: ['Google Search Ads', 'LinkedIn Ads', 'Agro Eventos'],
    budget: 35000.00,
    spent: 28400.00,
    leadsGenerated: 145,
    conversions: 24,
    status: 'Ativa',
    roi: 4.8
  },
  {
    id: 'cmp-2',
    name: 'Lançamento Sensoriamento IoT X',
    channels: ['E-mail Marketing', 'Webinars', 'Portais de Tecnologia'],
    budget: 15000.00,
    spent: 14850.00,
    leadsGenerated: 82,
    conversions: 15,
    status: 'Finalizada',
    roi: 3.2
  },
  {
    id: 'cmp-3',
    name: 'Reconhecimento de Marca Logística 2026',
    channels: ['Revistas Logística', 'Google Display Network'],
    budget: 20000.00,
    spent: 8000.00,
    leadsGenerated: 34,
    conversions: 3,
    status: 'Ativa',
    roi: 1.5
  }
];

export const defaultEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Roberto Antunes Albuquerque',
    role: 'Engenheiro de Automação Pleno',
    department: 'Desenvolvimento de Hardware',
    salary: 11400.00,
    joinDate: '2023-04-15',
    status: 'Ativo',
    email: 'roberto@titanxerp.com',
    performanceScore: 4.8
  },
  {
    id: 'emp-2',
    name: 'Mariana de Souza Neves',
    role: 'Coordenadora de Atendimento TI',
    department: 'Tecnologia da Informação',
    salary: 8200.00,
    joinDate: '2024-02-10',
    status: 'Ativo',
    email: 'mariana.s@titanxerp.com',
    performanceScore: 4.5
  },
  {
    id: 'emp-3',
    name: 'Carlos Alberto Santos',
    role: 'Operador de Prensa Sênior',
    department: 'Manufatura e Produção',
    salary: 4900.00,
    joinDate: '2025-01-20',
    status: 'Ativo',
    email: 'carlos.alberto@titanxerp.com',
    performanceScore: 4.2
  },
  {
    id: 'emp-4',
    name: 'Patrícia Sales Linhares',
    role: 'Gerente Comercial B2B Sênior',
    department: 'Vendas Corporativas',
    salary: 16500.00,
    joinDate: '2022-11-01',
    status: 'Ativo',
    email: 'patricia@titanxerp.com',
    performanceScore: 4.9
  },
  {
    id: 'emp-5',
    name: 'Renata Vasconcelos Garcia',
    role: 'Líder de Desenvolvimento RH',
    department: 'Recursos Humanos',
    salary: 10200.00,
    joinDate: '2023-11-20',
    status: 'Férias',
    email: 'renata@titanxerp.com',
    performanceScore: 4.6
  }
];

export const defaultProductionOrders: ProductionOrder[] = [
  {
    id: 'po-1',
    code: 'OP-2026-0245',
    product: 'Balança Rodoviária TitanX-V3 IP67',
    quantity: 10,
    startDate: '2026-05-25',
    endDate: '2026-06-05',
    status: 'Em Produção',
    rawMaterialStatus: 'Suficiente',
    efficiency: 94.2
  },
  {
    id: 'po-2',
    code: 'OP-2026-0246',
    product: 'Sensor de Tensão C3 Premium 200kg',
    quantity: 150,
    startDate: '2026-05-28',
    endDate: '2026-06-10',
    status: 'Agendada',
    rawMaterialStatus: 'Suficiente',
    efficiency: 98.0
  },
  {
    id: 'po-3',
    code: 'OP-2026-0243',
    product: 'Indicador Digital TitanX Touch T500',
    quantity: 40,
    startDate: '2026-05-21',
    endDate: '2026-05-28',
    status: 'Qualidade',
    rawMaterialStatus: 'Alerta',
    efficiency: 89.5
  },
  {
    id: 'po-4',
    code: 'OP-2026-0242',
    product: 'Plataforma Metálica 12x3 metros',
    quantity: 3,
    startDate: '2026-05-15',
    endDate: '2026-05-26',
    status: 'Concluída',
    rawMaterialStatus: 'Suficiente',
    efficiency: 91.0
  }
];

export const defaultTasks: ProjectTask[] = [
  {
    id: 'tsk-1',
    title: 'Integração de Firmware IoT com Banco de Dados',
    description: 'Criar webhook de recepção JSON das balanças no backend NestJS de produção.',
    project: 'SaaS TitanX Cloud IoT',
    priority: 'Crítica',
    column: 'inprogress',
    assignee: 'Roberto Antunes (Hardware)',
    hoursSpent: 14,
    estimatedHours: 20,
    dueDate: '2026-05-31'
  },
  {
    id: 'tsk-2',
    title: 'Migração de Servidores Legados para GCP Instance',
    description: 'Planejar downtime e transferir banco de dados local para Cloud SQL.',
    project: 'Migração Nuvem Infra',
    priority: 'Alta',
    column: 'todo',
    assignee: 'Guilherme Ferreira (Infra)',
    hoursSpent: 0,
    estimatedHours: 40,
    dueDate: '2026-06-15'
  },
  {
    id: 'tsk-3',
    title: 'Refatoração da Interface do Dashboard Comercial',
    description: 'Melhorar responsividade e incluir gráficos de funil de vendas em SVG.',
    project: 'Plataforma Web ERP v2',
    priority: 'Média',
    column: 'review',
    assignee: 'Mariana de Souza (UX/TI)',
    hoursSpent: 18,
    estimatedHours: 15,
    dueDate: '2026-05-29'
  },
  {
    id: 'tsk-4',
    title: 'Desenho do Novo Layout da NFS-e Simplificada',
    description: 'Ajustar alinhamento de ISS e deduções fiscais no PDF gerado.',
    project: 'Atualizações Normativas Fiscais',
    priority: 'Baixa',
    column: 'done',
    assignee: 'Beatriz Vasconcelos (Financeiro)',
    hoursSpent: 6,
    estimatedHours: 6,
    dueDate: '2026-05-25'
  }
];

export const defaultTickets: HelpdeskTicket[] = [
  {
    id: 'tkt-1',
    code: 'HDP-04910',
    title: 'Erro de Autenticação MFA no Login Comercial',
    requester: 'Carlos Eduardo (Comercial)',
    priority: 'Urgente',
    status: 'Em Atendimento',
    assignedTo: 'Mariana de Souza',
    slaLimit: '2h de limite restante',
    category: 'Sistemas Internos'
  },
  {
    id: 'tkt-2',
    code: 'HDP-04911',
    title: 'Falha de comunicação - Impressora NF-e Fábrica',
    requester: 'Operador Fábrica C',
    priority: 'Alta',
    status: 'Aberto',
    assignedTo: 'Suporte Terceirizado',
    slaLimit: '4h de limite restante',
    category: 'Hardware e Periféricos'
  },
  {
    id: 'tkt-3',
    code: 'HDP-04905',
    title: 'Substituição de Bateria - Coletor de Dados Galpão',
    requester: 'Adilson Silveira (Log)',
    priority: 'Baixa',
    status: 'Resolvido',
    assignedTo: 'Mariana de Souza',
    slaLimit: 'Concluidor dentro do SLA',
    category: 'Manutenção Equipamentos'
  }
];

export const defaultAssets: TechAsset[] = [
  {
    id: 'ast-1',
    name: 'Servidor Dell PowerEdge R750 Raw Power',
    type: 'Servidor',
    serial: 'SV-POWER-750912',
    assignedTo: 'Fábrica Principal Server-Room',
    status: 'Em Uso'
  },
  {
    id: 'ast-2',
    name: 'MacBook Pro 16" M3 Max 64GB',
    type: 'Notebook',
    serial: 'APL-M3MX-994200',
    assignedTo: 'Diretoria Executiva',
    status: 'Em Uso'
  },
  {
    id: 'ast-3',
    name: 'Notebook ThinkPad L14 Ryzen 7',
    type: 'Notebook',
    serial: 'LNV-L14-99042',
    assignedTo: 'Patrícia Sales (Comercial)',
    status: 'Em Uso'
  }
];

export const defaultReleases: ReleaseItem[] = [
  {
    id: 'rel-1',
    version: 'v2.4.0-rc3',
    title: 'Módulo de Integração Industrial Automatizada',
    type: 'Feature',
    status: 'Em QA',
    milestone: 'Sprint 24 - Transformação Digital',
    percentage: 85
  },
  {
    id: 'rel-2',
    version: 'v2.3.5',
    title: 'Correção de Bug de Rendimento Logístico',
    type: 'Bugfix',
    status: 'Deployado',
    milestone: 'Estabilização de Lançamento',
    percentage: 100
  },
  {
    id: 'rel-3',
    version: 'v2.5.0-alpha',
    title: 'Portal do Fornecedor e Cotação de Preços Inteligente',
    type: 'Feature',
    status: 'Em Dev',
    milestone: 'Sprint 25 - Suprimentos integrados',
    percentage: 30
  }
];

export const defaultGoals: StrategicGoal[] = [
  {
    id: 'gl-1',
    title: 'Faturamento Anual TitanX Holding',
    target: 'R$ 45.000.000,00',
    current: 'R$ 18.235.400,00',
    progress: 40.5,
    riskLevel: 'Baixo',
    owner: 'Leonardo Albuquerque (Diretor)'
  },
  {
    id: 'gl-2',
    title: 'Redução de Perdas nas Ordens Industriais',
    target: '< 1.5% de perda metalúrgica',
    current: '2.1% de perdas',
    progress: 71.4,
    riskLevel: 'Moderado',
    owner: 'Carlos Alberto (Operações)'
  },
  {
    id: 'gl-3',
    title: 'Adequação Completa de Processamento à LGPD',
    target: '100% de conformidade auditada',
    current: '88% de conformidade',
    progress: 88,
    riskLevel: 'Alto',
    owner: 'Guilherme Ferreira (CISO/TI)'
  }
];

export const defaultAuditLogs: AuditLog[] = [
  {
    id: 'lg-1',
    timestamp: '2026-05-28T17:45:00Z',
    userId: 'usr-1',
    username: 'superadmin',
    action: 'Login com Autenticação MFA Autorizada',
    module: 'CONTROLE DE ACESSO',
    ip: '192.168.10.45',
    status: 'Suceso'
  },
  {
    id: 'lg-2',
    timestamp: '2026-05-28T17:32:15Z',
    userId: 'usr-3',
    username: 'financeirobeatriz',
    action: 'Alteração de status do faturamento NFE-00010943',
    module: 'FINANCEIRO / FATURAMENTO',
    ip: '192.168.10.122',
    status: 'Suceso'
  },
  {
    id: 'lg-3',
    timestamp: '2026-05-28T16:10:00Z',
    userId: 'usr-2',
    username: 'diretorialeonardo',
    action: 'Tentativa de alteração de dados de RH sem assinatura digital',
    module: 'SISTEMA DE RH / REGRAS',
    ip: '177.20.144.33',
    status: 'Falha'
  }
];
