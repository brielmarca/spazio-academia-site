// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, getProfessores, getClientes } from '@/services/contract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Clock, GraduationCap, Calendar } from 'lucide-react';

interface DashboardData {
  totalHorasUsadas: number;
  totalHorasDisponiveis: number;
  totalProfessores: number;
  totalClientes: number;
  contratosAtivos: any[];
}

interface User {
  id: number;
  name: string;
  email: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [professores, setProfessores] = useState<User[]>([]);
  const [clientes, setClientes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardData, professoresData, clientesData] = await Promise.all([
        getDashboard(),
        getProfessores(),
        getClientes(),
      ]);
      setData(dashboardData);
      setProfessores(professoresData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Horas Usadas</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.totalHorasUsadas || 0}</div>
              <p className="text-xs text-gray-500">Total consumido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Horas Disponíveis</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{data?.totalHorasDisponiveis || 0}</div>
              <p className="text-xs text-gray-500">Saldo total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Professores Ativos</CardTitle>
              <GraduationCap className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{data?.totalProfessores || 0}</div>
              <p className="text-xs text-gray-500">Na plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{data?.totalClientes || 0}</div>
              <p className="text-xs text-gray-500">Com contrato</p>
            </CardContent>
          </Card>
        </div>

        {/* Professores e Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Professores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professores</CardTitle>
            </CardHeader>
            <CardContent>
              {professores.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum professor cadastrado</p>
              ) : (
                <ul className="space-y-3">
                  {professores.map((prof) => (
                    <li key={prof.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{prof.name}</p>
                        <p className="text-sm text-gray-500">{prof.email}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/professor/${prof.id}`)}>
                        Ver Agenda
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Clientes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clientes Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {clientes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum cliente cadastrado</p>
              ) : (
                <ul className="space-y-3">
                  {clientes.slice(0, 5).map((cliente) => (
                    <li key={cliente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{cliente.name}</p>
                        <p className="text-sm text-gray-500">{cliente.email}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Contrato
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contratos Ativos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Contratos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.contratosAtivos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum contrato ativo</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Horas Totais</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Usadas</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Disponíveis</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.contratosAtivos.map((contract) => (
                      <tr key={contract.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{contract.cliente.name}</td>
                        <td className="py-3 px-4">{contract.horasTotais}h</td>
                        <td className="py-3 px-4">{contract.horasUsadas}h</td>
                        <td className="py-3 px-4 font-semibold text-green-600">{contract.horasDisponiveis}h</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {contract.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
