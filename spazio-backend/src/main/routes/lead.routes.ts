import express, { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { z } from 'zod';

const router = Router();

// Zod schema para validação
const CreateLeadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  telefone: z.string().optional(),
});

// Health check
router.get('/health', (req, res) => {
  res.json({ message: 'API da Academia Spazio está saudável! ✅' });
});

// Criar um novo lead
router.post('/leads', async (req, res) => {
  try {
    const validatedData = CreateLeadSchema.parse(req.body);
    await LeadController.createLead(
      { body: validatedData } as any,
      res,
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(500).json({ error: 'Erro ao validar dados.' });
    }
  }
});

// Listar todos os leads
router.get('/leads', async (req, res) => {
  await LeadController.getAllLeads(req, res);
});

// Buscar um lead por ID
router.get('/leads/:id', async (req, res) => {
  await LeadController.getLeadById(req, res);
});

export function setupLeadRoutes(app: express.Application): void {
  app.use('/api', router);
}

export default router;
