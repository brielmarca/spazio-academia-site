// src/pages/MyAppointments.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Calendar, Clock, X, Check, Dumbbell, Heart, Zap, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import {
  getMyAppointments,
  cancelAppointment,
  formatDateTime,
  statusLabels,
  statusColors,
  Appointment,
} from '@/services/appointment';
import trainer1 from '@/assets/trainer1.jpg';
import trainer2 from '@/assets/trainer2.jpg';
import trainer3 from '@/assets/trainer3.jpg';

const trainerImages: Record<string, any> = {
  'Rafael Mendes': trainer1,
  'Camila Torres': trainer2,
  'Lucas Ferreira': trainer3,
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState<number | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data.appointments);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      setCanceling(id);
      await cancelAppointment(id);
      toast.success('Agendamento cancelado com sucesso');
      await loadAppointments();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cancelar agendamento');
    } finally {
      setCanceling(null);
    }
  };

  const canCancel = (apt: Appointment) => {
    const now = new Date();
    const aptDate = new Date(apt.date);
    const hoursDiff = (aptDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff > 2 && apt.status !== 'CANCELED' && apt.status !== 'COMPLETED';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spazio-dark to-spazio-dark/90">
        <Loader2 className="w-12 h-12 text-spazio-gold animate-spin" />
      </div>
    );
  }

  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= new Date() && a.status !== 'CANCELED' && a.status !== 'COMPLETED'
  );
  const past = appointments.filter(
    (a) => new Date(a.date) < new Date() || a.status === 'CANCELED' || a.status === 'COMPLETED'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-spazio-dark to-spazio-dark/95">
      <header className="border-b border-white/10 bg-spazio-dark/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-xl font-display text-white">Meus Agendamentos</h1>
            </div>
            <Link to="/professores">
              <Button size="sm" className="bg-spazio-gold text-spazio-dark hover:bg-spazio-gold/90">
                <Calendar className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400 text-center">
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-2xl font-display text-white mb-2">Nenhum agendamento</h2>
            <p className="text-white/50 mb-6">Você ainda não fez nenhum agendamento.</p>
            <Link to="/professores">
              <Button className="bg-spazio-gold text-spazio-dark hover:bg-spazio-gold/90">
                Agendar sua primeira aula
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-xl font-display text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-spazio-gold" />
                  Próximos Agendamentos
                </h2>
                <div className="grid gap-4">
                  {upcoming.map((apt) => (
                    <Card key={apt.id} className="bg-white/5 border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-spazio-dark flex-shrink-0">
                            <img
                              src={trainerImages[apt.trainer.name] || trainer1}
                              alt={apt.trainer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-display text-white">
                                  {apt.trainer.name}
                                </h3>
                                <p className="text-white/60 text-sm">{apt.trainer.role}</p>
                              </div>
                              <Badge className={statusColors[apt.status]}>
                                {statusLabels[apt.status]}
                              </Badge>
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-white/70 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDateTime(apt.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {apt.duration} min
                              </span>
                            </div>
                            {apt.notes && (
                              <p className="mt-2 text-white/50 text-sm italic">
                                "{apt.notes}"
                              </p>
                            )}
                            {canCancel(apt) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancel(apt.id)}
                                disabled={canceling === apt.id}
                                className="mt-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                {canceling === apt.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4 mr-2" />
                                )}
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-xl font-display text-white/70 mb-4">Histórico</h2>
                <div className="grid gap-4">
                  {past.map((apt) => (
                    <Card key={apt.id} className="bg-white/5 border-0 opacity-60">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-spazio-dark flex-shrink-0">
                            <img
                              src={trainerImages[apt.trainer.name] || trainer1}
                              alt={apt.trainer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-white font-medium">{apt.trainer.name}</h3>
                                <p className="text-white/50 text-sm">{formatDateTime(apt.date)}</p>
                              </div>
                              <Badge className={statusColors[apt.status]}>
                                {statusLabels[apt.status]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
