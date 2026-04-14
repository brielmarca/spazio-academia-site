// src/main/services/scheduler.service.ts
import { resetExpiredHrh } from './hrh.service';

/**
 * Worker para processar tarefas agendadas
 * Este serviço é chamado periodicamente para:
 * - Resetar horários expirados
 * - Atualizar status de contratos
 * - Etc.
 */

// Intervalo padrão: a cada 5 minutos
const DEFAULT_INTERVAL = 5 * 60 * 1000;

let intervalId: NodeJS.Timeout | null = null;

/**
 * Iniciar o worker scheduler
 */
export function startScheduler(intervalMs: number = DEFAULT_INTERVAL) {
  if (intervalId) {
    console.log('⚠️ Scheduler já está rodando');
    return;
  }

  console.log(`🚀 Iniciando scheduler (intervalo: ${intervalMs / 1000}s)`);

  // Executar imediatamente na inicialização
  processExpiredHrhs();

  // Configurar intervalo
  intervalId = setInterval(() => {
    processExpiredHrhs();
  }, intervalMs);
}

/**
 * Parar o worker scheduler
 */
export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('⏹️ Scheduler parado');
  }
}

/**
 * Processar horários expirados
 * Esta função:
 * 1. Busca horários que já passaram do horário atual
 * 2. Se estavam disponíveis, remove-os
 * 3. Se estavam reservados, marca como completo e deduz horas
 */
async function processExpiredHrhs() {
  try {
    console.log('⏰ Processando horários expirados...');
    const results = await resetExpiredHrh();
    console.log(`✅ Processados ${results.length} horários expirados`);
  } catch (error) {
    console.error('❌ Erro ao processar horários expirados:', error);
  }
}

/**
 * Endpoint manual para processar expirados (para testes)
 */
export async function manualProcessExpired() {
  return processExpiredHrhs();
}
