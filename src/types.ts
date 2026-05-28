/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'Super Admin'
  | 'Diretoria'
  | 'Financeiro'
  | 'RH'
  | 'Comercial'
  | 'Marketing'
  | 'Logística'
  | 'Industrial'
  | 'Produção'
  | 'TI'
  | 'Desenvolvimento'
  | 'Projetos'
  | 'Usuário Comum';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  mfaEnabled: boolean;
  mustChangePassword?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  ip: string;
  status: 'Suceso' | 'Falha';
}

// LOGISTICS
export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  warehouse: string;
  status: 'Em Estoque' | 'Estoque Baixo' | 'Fora de Estoque';
  lastMovement: string;
}

export interface MovementRecord {
  id: string;
  itemId: string;
  itemName: string;
  type: 'Entrada' | 'Saída';
  quantity: number;
  responsible: string;
  date: string;
  docRef: string;
}

export interface TransportVehicle {
  id: string;
  plate: string;
  model: string;
  driver: string;
  status: 'Disponível' | 'Em Transporte' | 'Manutenção';
  loadCapacity: string;
}

// FINANCIAL
export interface FinancialRecord {
  id: string;
  type: 'Receita' | 'Despesa';
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'Liquidado' | 'Pendente' | 'Atrasado';
  costCenter: string;
}

// INVOICES (FATURAMENTO)
export interface Invoice {
  id: string;
  number: string;
  client: string;
  cnpj: string;
  value: number;
  tax: number;
  type: 'NF-e' | 'NFS-e';
  status: 'Autorizada' | 'Pendente' | 'Cancelada';
  issueDate: string;
  xmlUrl?: string;
}

// COMMERCIAL
export interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  status: 'Contato Inicial' | 'Proposta Enviada' | 'Em Negociação' | 'Ganha' | 'Perdida';
  email: string;
  phone: string;
  assignedTo: string;
  lastContact: string;
}

export interface BrandContract {
  id: string;
  code: string;
  client: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'Ativo' | 'Em Revisão' | 'Expirado';
}

// MARKETING
export interface MarketingCampaign {
  id: string;
  name: string;
  channels: string[];
  budget: number;
  spent: number;
  leadsGenerated: number;
  conversions: number;
  status: 'Ativa' | 'Planejada' | 'Finalizada';
  roi: number;
}

// HR (RECURSOS HUMANOS)
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  joinDate: string;
  status: 'Ativo' | 'Férias' | 'Afastado';
  email: string;
  performanceScore: number;
}

// INDUSTRIAL & PRODUCTION
export interface ProductionOrder {
  id: string;
  code: string;
  product: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'Agendada' | 'Em Produção' | 'Qualidade' | 'Concluída';
  rawMaterialStatus: 'Suficiente' | 'Alerta' | 'Faltando';
  efficiency: number; // %
}

// PROJECTS
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  column: 'todo' | 'inprogress' | 'review' | 'done';
  assignee: string;
  hoursSpent: number;
  estimatedHours: number;
  dueDate: string;
}

// TI HELP-DESK
export interface HelpdeskTicket {
  id: string;
  code: string;
  title: string;
  requester: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  status: 'Aberto' | 'Em Atendimento' | 'Pendente' | 'Resolvido';
  assignedTo: string;
  slaLimit: string;
  category: string;
}

export interface TechAsset {
  id: string;
  name: string;
  type: 'Notebook' | 'Servidor' | 'Switch' | 'Licença';
  serial: string;
  assignedTo: string;
  status: 'Em Uso' | 'Estoque' | 'Manutenção';
}

// DEVELOPMENT
export interface ReleaseItem {
  id: string;
  version: string;
  title: string;
  type: 'Feature' | 'Bugfix' | 'Hotfix' | 'Melhoria';
  status: 'Backlog' | 'Em Dev' | 'Em QA' | 'Deployado';
  milestone: string;
  percentage: number;
}

// STRATEGIC / COMPLIANCE
export interface StrategicGoal {
  id: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  riskLevel: 'Baixo' | 'Moderado' | 'Alto';
  owner: string;
}
