// src/pages/ProfessorDashboard.tsx
import { useEffect, useState } from 'react';
import { getProfessorAgenda, createHrh, deleteHrh, updateHrh, Hrh, CreateHrhInput } from '@/services/hrh';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Plus, Trash2, Edit, Calendar, CheckCircle, XCircle } from 'lucide-react';

const ProfessorDashboard = () => {
  const [agenda, setAgenda] = useState<Hrh[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHorario, setNewHorario] = useState({ dataHora: '', duracao: 60 });

  useEffect(() => {
    loadAgenda();
  }, []);

  const loadAgenda = async () => {
    try {
      const data = await getProfessorAgenda();
      setAgenda(data);
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHorario = async () => {
    try {
      await createHrh({ dataHora: newHorario.dataHora, duracao: newHorario.duracao } as CreateHrhInput);
      setShowAddModal(false);
      setNewHorario({ dataHora: '', duracao: 60 });
      loadAgenda();
    } catch (error) {
      console.error('Erro ao adicionar horário:', error);
    }
  };

  const handleDeleteHorario = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) return;
    try {
      await deleteHrh(id);
      loadAgenda();
    } catch (error) {
      console.error('Erro ao excluir horário:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-700';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircle className="h-4 w-4" />;
      case 'RESERVED':
        return <Clock className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDateTime = (dataHora: string) => {
    const date = new Date(dataHora);
    return date.toLocaleString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel do Professor</h1>
            <p className="text-gray-600 mt-2">Gerencie seus horários disponíveis</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Horário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Horário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data e Hora</label>
                  <Input
                    type="datetime-local"
                    value={newHorario.dataHora}
                    onChange={(e) => setNewHorario({ ...newHorario, dataHora: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                  <Input
                    type="number"
                    value={newHorario.duracao}
                    onChange={(e) => setNewHorario({ ...newHorario, duracao: Number(e.target.value) })}
                    min={30}
                    max={120}
                  />
                </div>
                <Button onClick={handleAddHorario} className="w-full">
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Horários</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{agenda.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Disponíveis</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {agenda.filter((h) => h.status === 'AVAILABLE').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Reservados</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {agenda.filter((h) => h.status === 'RESERVED').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agenda de Horários</CardTitle>
          </CardHeader>
          <CardContent>
            {agenda.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum horário cadastrado</p>
                <p className="text-sm text-gray-400">Adicione seus horários disponíveis</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agenda.map((hrh) => (
                  <div
                    key={hrh.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getStatusColor(hrh.status)}`}>
                        {getStatusIcon(hrh.status)}
                      </div>
                      <div>
                        <p className="font-medium">{formatDateTime(hrh.dataHora)}</p>
                        <p className="text-sm text-gray-500">
                          Duração: {hrh.duracao}min
                          {hrh.cliente && (
                            <span className="ml-2">• Cliente: {hrh.cliente.name}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(hrh.status)}`}>
                        {hrh.status === 'AVAILABLE' && 'Disponível'}
                        {hrh.status === 'RESERVED' && 'Reservado'}
                        {hrh.status === 'COMPLETED' && 'Finalizado'}
                        {hrh.status === 'CANCELLED' && 'Cancelado'}
                      </span>
                      {hrh.status === 'AVAILABLE' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteHorario(hrh.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
