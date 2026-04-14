// src/pages/TrainerDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Calendar, Clock, Check, Dumbbell, Heart, Zap, Leaf, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getTrainerById, Trainer, getAvailableSlots, TimeSlot, dayNames, shortDayNames } from '@/services/trainer';
import { createAppointment, formatDate } from '@/services/appointment';
import { checkActiveSubscription } from '@/services/subscription';
import trainer1 from '@/assets/trainer1.jpg';
import trainer2 from '@/assets/trainer2.jpg';
import trainer3 from '@/assets/trainer3.jpg';

const trainerImages: Record<string, any> = {
  'Rafael Mendes': trainer1,
  'Camila Torres': trainer2,
  'Lucas Ferreira': trainer3,
};

const specialtyIcons: Record<string, React.ReactNode> = {
  musculacao: <Dumbbell size={14} />,
  funcional: <Zap size={14} />,
  pilates: <Heart size={14} />,
  ioga: <Leaf size={14} />,
};

export default function TrainerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [checkingPlan, setCheckingPlan] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (id) {
      loadTrainer();
      checkPlan();
    }
  }, [id]);

  useEffect(() => {
    if (trainer && selectedDate) {
      loadSlots();
    }
  }, [selectedDate, trainer]);

  const loadTrainer = async () => {
    try {
      setLoading(true);
      const data = await getTrainerById(parseInt(id!));
      setTrainer(data.trainer);

      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 30);
      setSelectedDate(today.toISOString().split('T')[0]);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar professor');
    } finally {
      setLoading(false);
    }
  };

  const checkPlan = async () => {
    try {
      setCheckingPlan(true);
      const data = await checkActiveSubscription();
      setHasActivePlan(data.hasActiveSubscription);
    } catch {
      setHasActivePlan(false);
    } finally {
      setCheckingPlan(false);
    }
  };

  const loadSlots = async () => {
    if (!trainer || !selectedDate) return;

    try {
      setLoadingSlots(true);
      const data = await getAvailableSlots(trainer.id, selectedDate);
      setSlots(data.slots);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar horários');
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    if (!trainer || !selectedDate || !selectedSlot) return;

    setBooking(true);
    try {
      const dateTime = `${selectedDate}T${selectedSlot}:00`;
      await createAppointment({
        trainerId: trainer.id,
        date: dateTime,
        notes: notes || undefined,
      });
      toast.success('Aula agendada com sucesso!');
      navigate('/agendamentos');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao agendar aula');
    } finally {
      setBooking(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  };

  if (loading || checkingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spazio-dark to-spazio-dark/90">
        <Loader2 className="w-12 h-12 text-spazio-gold animate-spin" />
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-spazio-dark to-spazio-dark/90 p-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <p className="text-white/70 text-center mb-4">{error || 'Professor não encontrado'}</p>
        <Link to="/professores">
          <Button variant="ghost" className="text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Professores
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spazio-dark to-spazio-dark/95">
      <header className="border-b border-white/10 bg-spazio-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/professores">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl font-display text-white">Agendar Aula</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-0">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={trainerImages[trainer.name] || trainer1}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spazio-dark to-transparent" />
              </div>
              <CardContent className="p-6 -mt-16 relative">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-spazio-gold bg-spazio-dark -mt-14 mb-4">
                  <img
                    src={trainerImages[trainer.name] || trainer1}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-display text-white text-center mb-1">
                  {trainer.name}
                </h2>
                <p className="text-white/60 text-center mb-4">{trainer.role}</p>

                {trainer.bio && (
                  <p className="text-white/70 text-sm mb-4">{trainer.bio}</p>
                )}

                {trainer.specialties && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {trainer.specialties.split(',').map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs"
                      >
                        {specialtyIcons[specialty.trim()] || <Dumbbell size={14} />}
                        {specialty.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <p className="text-xs text-white/50 mb-2 text-center">Horários de trabalho:</p>
                  <div className="space-y-1">
                    {Array.from(new Set(trainer.availabilities.map((a) => a.dayOfWeek))).map(
                      (day) => {
                        const dayAvails = trainer.availabilities.filter((a) => a.dayOfWeek === day);
                        return (
                          <div key={day} className="flex justify-between text-xs text-white/70">
                            <span>{dayNames[day]}</span>
                            <span>
                              {dayAvails.map((a) => `${a.startTime}-${a.endTime}`).join(', ')}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-spazio-gold" />
                  Selecione a Data e Horário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasActivePlan ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-medium mb-2">
                          Você precisa de uma assinatura ativa
                        </p>
                        <p className="text-white/70 text-sm mb-3">
                          Para agendar aulas, você precisa ter uma mensalidade ativa.
                        </p>
                        <Link to="/planos">
                          <Button className="bg-spazio-gold text-spazio-dark hover:bg-spazio-gold/90">
                            Ver Planos
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Escolha a data (próximos 30 dias):
                      </label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={getMinDate()}
                        max={getMaxDate()}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-3">
                        {selectedDate ? (
                          <>Horários disponíveis em {formatDate(selectedDate)}:</>
                        ) : (
                          'Selecione uma data para ver os horários'
                        )}
                      </label>

                      {loadingSlots ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-8 h-8 text-spazio-gold animate-spin" />
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="text-center py-8 text-white/50">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Não há horários disponíveis para este dia.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {slots.map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedSlot(slot.time)}
                              disabled={!slot.available}
                              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                !slot.available
                                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                  : selectedSlot === slot.time
                                  ? 'bg-spazio-gold text-spazio-dark'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {slot.time}
                              {selectedSlot === slot.time && (
                                <Check className="w-3 h-3 inline ml-1" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedSlot && (
                      <>
                        <div>
                          <label className="block text-white/70 text-sm mb-2">
                            Observações (opcional):
                          </label>
                          <Input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ex: Primeira aula, alguma restrição..."
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>

                        <div className="bg-spazio-gold/10 border border-spazio-gold/30 rounded-lg p-4">
                          <h4 className="text-spazio-gold font-medium mb-2">Resumo do agendamento:</h4>
                          <div className="space-y-1 text-white/80 text-sm">
                            <p>
                              <strong>Professor:</strong> {trainer.name}
                            </p>
                            <p>
                              <strong>Data:</strong> {formatDate(selectedDate)}
                            </p>
                            <p>
                              <strong>Horário:</strong> {selectedSlot}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={handleBooking}
                          disabled={booking}
                          className="w-full bg-spazio-gold text-spazio-dark hover:bg-spazio-gold/90"
                        >
                          {booking ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Confirmando...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Confirmar Agendamento
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
