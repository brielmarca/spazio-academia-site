// src/services/auth.ts
import { apiRequest } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'PROFESSOR' | 'LEAD';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * Registrar novo usuário
 */
export async function register(data: RegisterInput): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar conta');
  }

  const result = await response.json();
  saveAuth(result);
  return result;
}

/**
 * Login de usuário
 */
export async function login(data: LoginInput): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Email ou senha incorretos');
  }

  const result = await response.json();
  saveAuth(result);
  return result;
}

/**
 * Salvar dados de autenticação no localStorage
 */
function saveAuth(data: AuthResponse): void {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

/**
 * Logout
 */
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Obter usuário logado
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Verificar se usuário está logado
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

/**
 * Verificar se é admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'ADMIN';
}

/**
 * Verificar se é professor
 */
export function isProfessor(): boolean {
  const user = getCurrentUser();
  return user?.role === 'PROFESSOR';
}

/**
 * Obter perfil do usuário logado
 */
export async function getProfile(): Promise<{ user: User }> {
  return apiRequest('/auth/me');
}

/**
 * Atualizar perfil
 */
export async function updateProfile(data: { name?: string; phone?: string }): Promise<{ user: User }> {
  return apiRequest('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Alterar senha
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/**
 * Verificar se token ainda é válido
 */
export async function verifyToken(): Promise<{ valid: boolean; user: User }> {
  return apiRequest('/auth/verify');
}
