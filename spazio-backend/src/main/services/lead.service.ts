// src/main/services/lead.service.ts
import { prisma } from '../prisma';
import { Lead, LeadStatus } from '@prisma/client';

export class LeadService {
  // Valida se o email já existe no banco
  private async emailExists(email: string): Promise<boolean> {
    const lead = await prisma.lead.findUnique({ where: { email } });
    return !!lead;
  }

  // Cria um novo lead
  async createLead(nome: string, email: string, telefone?: string): Promise<Lead> {
    if (await this.emailExists(email)) {
      throw new Error('Este e-mail já está em uso.');
    }

    return prisma.lead.create({
      data: {
        nome: nome,
        email: email,
        telefone: telefone || null,
        status: LeadStatus.NEW,
      },
    });
  }

  // Busca um lead por email
  async getLeadByEmail(email: string): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: { email },
    });
  }

  // Busca um lead por ID
  async getLeadById(id: number): Promise<Lead | null> {
    return prisma.lead.findUnique({
      where: { id },
    });
  }

  // Lista todos os leads
  async getAllLeads(): Promise<Lead[]> {
    return prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Atualizar status do lead
  async updateLeadStatus(id: number, status: LeadStatus): Promise<Lead> {
    return prisma.lead.update({
      where: { id },
      data: { status },
    });
  }
}

export default new LeadService();
