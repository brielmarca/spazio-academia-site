// src/services/api.ts - Serviço principal de API

// Helper para headers com auth
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Criar lead via formulário de contato
 */
export async function criarLead(lead: { nome: string; email: string; telefone?: string }) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao enviar formulário');
  }

  return response.json();
}

/**
 * Requisição genérica com autenticação
 * Usa proxy do Vite - todas as req vão para /api/*
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `/api${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro na requisição' }));
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  return response.json();
}

export const api = {
  criarLead,
  apiRequest,
};

export default api;
