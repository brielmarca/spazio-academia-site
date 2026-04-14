// src/main/controllers/lead.controller.ts
import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';

const leadService = new LeadService();

export class LeadController {
  static async createLead(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, telefone } = req.body;

      // Validação básica
      if (!nome || !email) {
        res.status(400).json({ error: 'Nome e email são obrigatórios.' });
        return;
      }

      const newLead = await leadService.createLead(nome, email, telefone);

      res.status(201).json({
        message: 'Lead criado com sucesso!',
        lead: {
          id: newLead.id,
          nome: newLead.nome,
          email: newLead.email,
          telefone: newLead.telefone,
          status: newLead.status,
          createdAt: newLead.createdAt,
        },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro ao criar lead.' });
      }
    }
  }

  static async getAllLeads(req: Request, res: Response): Promise<void> {
    try {
      const leads = await leadService.getAllLeads();

      res.status(200).json({
        message: 'Leads listados com sucesso!',
        count: leads.length,
        leads,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar leads.' });
    }
  }

  static async getLeadById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;
      const leadId = parseInt(idStr);
      const lead = await leadService.getLeadById(leadId);

      if (!lead) {
        res.status(404).json({ error: 'Lead não encontrado.' });
        return;
      }

      res.status(200).json({ lead });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar lead.' });
    }
  }
}
