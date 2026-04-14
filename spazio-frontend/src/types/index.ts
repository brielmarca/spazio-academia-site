// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface Aluno {
  id: string;
  name: string;
  cpf: string;
  plano: 'BASICO' | 'PREMIUM' | 'VIP';
  matricula: string;
  createdAt: Date;
}

export interface Treino {
  id: string;
  nome: string;
  horario: string;
  instrutor: string;
  capacidade: number;
  alunos: Aluno[];
}