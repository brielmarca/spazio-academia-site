// src/main/types/index.ts
import { Request } from 'express';
import { Role, SubscriptionStatus } from '@prisma/client';

// User Types
export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// Auth Types
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: Role;
  };
  token: string;
}

// Plan Types
export interface CreatePlanInput {
  name: string;
  displayName: string;
  description?: string;
  price: number;
  abacatepayPlanId?: string;
}

// Subscription Types
export interface CreateSubscriptionInput {
  userId: number;
  planId: number;
}

export interface AbacatePayCustomer {
  name: string;
  email: string;
  phone?: string;
  taxpayerId?: string; // CPF/CNPJ
}

export interface AbacatePaySubscription {
  id: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}

// Webhook Types
export interface WebhookPayload {
  event: string;
  data: {
    id: string;
    status?: string;
    subscription?: {
      id: string;
      status: string;
    };
    customer?: {
      id: string;
    };
    [key: string]: any;
  };
}

// Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
