// src/main/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { RegisterInput, LoginInput, AuthResponse, UserPayload } from '../types';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'spazio-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Hash da senha
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Comparar senha com hash
 */
async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Gerar token JWT
 */
function generateToken(user: UserPayload): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

/**
 * Verificar e decodificar token JWT
 */
export function verifyToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}

/**
 * Registrar novo usuário
 */
export async function register(data: RegisterInput): Promise<AuthResponse> {
  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email já está em uso');
  }

  // Criar hash da senha
  const hashedPassword = await hashPassword(data.password);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: Role.USER,
    },
  });

  // Gerar token
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
    },
    token,
  };
}

/**
 * Login de usuário
 */
export async function login(data: LoginInput): Promise<AuthResponse> {
  // Buscar usuário pelo email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Email ou senha incorretos');
  }

  // Verificar senha
  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Email ou senha incorretos');
  }

  // Gerar token
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
    },
    token,
  };
}

/**
 * Buscar usuário pelo ID
 */
export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
}

/**
 * Atualizar usuário
 */
export async function updateUser(
  id: number,
  data: { name?: string; phone?: string }
) {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return user;
}

/**
 * Alterar senha do usuário
 */
export async function changePassword(
  id: number,
  currentPassword: string,
  newPassword: string
) {
  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar senha atual
  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new Error('Senha atual incorreta');
  }

  // Criar hash da nova senha
  const hashedNewPassword = await hashPassword(newPassword);

  // Atualizar senha
  await prisma.user.update({
    where: { id },
    data: { password: hashedNewPassword },
  });

  return { message: 'Senha alterada com sucesso' };
}
