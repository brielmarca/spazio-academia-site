// src/services/user.ts - Serviço para gestão de usuários (Admin)
import { apiRequest } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'PROFESSOR' | 'USER' | 'LEAD';
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'ADMIN' | 'PROFESSOR' | 'USER' | 'LEAD';
}

// Listar todos os usuários
export async function listUsers() {
  return apiRequest('/users');
}

// Buscar usuário por ID
export async function getUserById(id: number) {
  return apiRequest(`/users/${id}`);
}

// Criar usuário
export async function createUser(data: CreateUserInput) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Atualizar usuário
export async function updateUser(id: number, data: Partial<CreateUserInput>) {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Excluir usuário
export async function deleteUser(id: number) {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
}

export const userService = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userService;
