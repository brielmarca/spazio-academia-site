// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'PROFESSOR' | 'USER' | 'LEAD';
  phone?: string;
}

export interface Hrh {
  id: number;
  professorId: number;
  dataHora: string;
  duracao: number;
  status: 'AVAILABLE' | 'RESERVED' | 'COMPLETED' | 'CANCELLED';
  clienteId: number | null;
  professor: { id: number; name: string; email: string };
  cliente?: { id: number; name: string; email: string };
}

export interface Contract {
  id: number;
  clienteId: number;
  horasTotais: number;
  horasUsadas: number;
  horasDisponiveis: number;
  status: string;
  dataInicio: string;
  dataFim: string | null;
  cliente: { id: number; name: string; email: string; phone: string };
}

export interface Payment {
  id: number;
  contractId: number;
  valor: number;
  plano: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  dataPagamento: string | null;
  dataVencimento: string;
  metodoPagamento: string | null;
  transacaoId: string | null;
}

export interface DashboardData {
  totalHorasUsadas: number;
  totalHorasDisponiveis: number;
  totalProfessores: number;
  totalClientes: number;
  contratosAtivos: Contract[];
}

export interface Plan {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  price: number;
  hours: number;
  isActive: boolean;
}
