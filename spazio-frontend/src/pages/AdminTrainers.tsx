// src/pages/AdminTrainers.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrainers, createAvailability, deleteAvailability, Trainer, Availability, dayNames } from '@/services/trainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Plus, Clock, ArrowLeft } from 'lucide-react';

const AdminTrainers = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [newAvailability, setNewAvailability] = useState({
    dayOfWeek: '1',
    startTime: '08:00',
    endTime: '12:00',
  });

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const data = await getTrainers();
      setTrainers(data.trainers);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvailability = async () => {
    if (!selectedTrainer) return;
    
    try {
      await createAvailability({
        trainerId: selectedTrainer.id,
        dayOfWeek: parseInt(newAvailability.dayOfWeek),
        startTime: newAvailability.startTime,
        endTime: newAvailability.endTime,
      });
      setShowAddModal(false);
      loadTrainers();
    } catch (error) {
      console.error('Erro ao adicionar disponibilidade:', error);
    }
  };

  const handleDeleteAvailability = async (availabilityId: number) => {
    try {
      await deleteAvailability(availabilityId);
      loadTrainers();
    } catch (error) {
      console.error('Erro ao remover disponibilidade:', error);
    }
  };

  const toggleAvailability = async (availability: Availability) => {
    // Por enquanto apenas visual, depois podemos adicionar endpoint para toggle
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spazio-dark via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spazio-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spazio-dark via-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-4 pl-0 text-white/70 hover:text-spazio-gold hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Gerenciar Professores</h1>
          <p className="text-white/60 mt-2">Configure os horários de cada professor</p>
        </div>

        <div className="grid gap-6">
          {trainers.map((trainer) => (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">{trainer.name}</CardTitle>
                  <p className="text-white/50 text-sm">{trainer.role}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedTrainer(trainer)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Horário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Horário - {trainer.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label>Dia da Semana</Label>
                        <Select 
                          value={newAvailability.dayOfWeek} 
                          onValueChange={(v) => setNewAvailability({ ...newAvailability, dayOfWeek: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dayNames.map((day, idx) => (
                              <SelectItem key={idx} value={idx.toString()}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Início</Label>
                          <Input 
                            type="time" 
                            value={newAvailability.startTime}
                            onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Fim</Label>
                          <Input 
                            type="time" 
                            value={newAvailability.endTime}
                            onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddAvailability} className="w-full">
                        Adicionar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="bg-transparent">
                {trainer.availabilities.length === 0 ? (
                  <p className="text-white/50 text-center py-4">Nenhum horário cadastrado</p>
                ) : (
                  <div className="space-y-2">
                    {trainer.availabilities
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map((avail) => (
                        <div 
                          key={avail.id} 
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <Clock className="w-5 h-5 text-spazio-gold" />
                            <div>
                              <span className="text-white font-medium">{dayNames[avail.dayOfWeek]}</span>
                              <span className="text-white/50 mx-2">|</span>
                              <span className="text-white/80">
                                {avail.startTime} - {avail.endTime}
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteAvailability(avail.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {trainers.length === 0 && (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="py-8 text-center">
              <p className="text-white/50">Nenhum professor cadastrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminTrainers;