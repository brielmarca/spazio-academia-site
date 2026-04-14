// src/pages/Plans.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Check, Crown, Dumbbell, Heart, Zap, Package, LogOut, User } from 'lucide-react';
import { logout, getCurrentUser } from '@/services/auth';
import { getPlans, createSubscription, formatPrice, getMySubscriptions, Plan, Subscription } from '@/services/subscription';

const planIcons: Record<string, React.ReactNode> = {
  musculacao: <Dumbbell className="w-6 h-6" />,
  pilates: <Heart className="w-6 h-6" />,
  funcional: <Zap className="w-6 h-6" />,
  combo: <Crown className="w-6 h-6" />,
  'meio-periodo': <Package className="w-6 h-6" />,
  '5-dias': <Package className="w-6 h-6" />,
  '7-dias': <Package className="w-6 h-6" />,
};

export default function Plans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const plansData = await getPlans();
      setPlans(plansData.plans || []);
      
      try {
        const subsData = await getMySubscriptions();
        setSubscriptions(subsData.subscriptions || []);
      } catch (subErr) {
        console.log('Erro ao carregar assinaturas (pode não ter feitas):', subErr);
        setSubscriptions([]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setSubscribing(planId);
    setError('');
    setSuccess('');

    try {
      const result = await createSubscription(planId);
      setPaymentUrl(result.paymentUrl || result.checkoutUrl);
      setSuccess('Assinatura criada! Redirecionando para o pagamento...');
      setShowSuccessDialog(true);

      // Recarregar dados
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar assinatura');
    } finally {
      setSubscribing(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const hasActiveSubscription = (planId: number) => {
    return subscriptions.some(
      (sub) => sub.planId === planId && (sub.status === 'ACTIVE' || sub.status === 'PENDING')
    );
  };

  const getSubscriptionForPlan = (planId: number) => {
    return subscriptions.find(
      (sub) => sub.planId === planId && (sub.status === 'ACTIVE' || sub.status === 'PENDING')
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spazio-dark to-spazio-dark/90">
        <Loader2 className="w-12 h-12 text-spazio-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spazio-dark to-spazio-dark/95">
      {/* Header */}
      <header className="border-b border-white/10 bg-spazio-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-spazio-gold to-spazio-accent rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-spazio-dark" />
              </div>
              <div>
                <h1 className="text-xl font-display text-white">Spazio Academia</h1>
                <p className="text-sm text-white/50">Escolha seu plano</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-white/70">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/50">
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Escolha seu Plano
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Comece sua transformação hoje. Todos os planos incluem acesso completo
            à estrutura da academia.
          </p>
        </div>

        {/* Plan Cards */}
        {plans.length === 0 && !loading ? (
          <div className="col-span-full text-center py-12">
            <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/50">Nenhum plano disponível no momento.</p>
            <Button
              onClick={loadData}
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isSubscribed = hasActiveSubscription(plan.id);
            const subscription = getSubscriptionForPlan(plan.id);
            const isPopular = plan.name === 'combo' || plan.name === '7-dias';

            return (
              <Card
                key={plan.id}
                className={`relative border-0 overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isPopular
                    ? 'bg-gradient-to-b from-spazio-gold/20 to-spazio-dark/90 ring-2 ring-spazio-gold'
                    : 'bg-white/5 backdrop-blur-sm'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-spazio-gold text-spazio-dark text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MAIS POPULAR
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      isPopular ? 'bg-spazio-gold text-spazio-dark' : 'bg-white/10 text-white'
                    }`}>
                      {planIcons[plan.name] || <Package className="w-6 h-6" />}
                    </div>
                    <CardTitle className={`text-xl ${
                      isPopular ? 'text-spazio-gold' : 'text-white'
                    }`}>
                      {plan.displayName}
                    </CardTitle>
                  </div>

                  <CardDescription className="text-white/60">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <span className={`text-4xl font-display ${
                      isPopular ? 'text-spazio-gold' : 'text-white'
                    }`}>
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-white/50">/mês</span>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Features */}
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-spazio-gold shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">
                        Acesso ilimitado
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-spazio-gold shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">
                        Sem taxa de matrícula
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-spazio-gold shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">
                        Cancelamento a qualquer momento
                      </span>
                    </li>
                  </ul>

                  {isSubscribed ? (
                    <div className="space-y-2">
                      <Badge className={`w-full py-2 ${
                        subscription?.status === 'ACTIVE'
                          ? 'bg-green-500 hover:bg-green-500'
                          : 'bg-yellow-500 hover:bg-yellow-500'
                      }`}>
                        {subscription?.status === 'ACTIVE' ? 'ASSINATURA ATIVA' : 'PENDENTE'}
                      </Badge>
                      {subscription?.currentPeriodEnd && (
                        <p className="text-xs text-white/50 text-center">
                          Renova em{' '}
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                            'pt-BR'
                          )}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribing === plan.id}
                      className={`w-full ${
                        isPopular
                          ? 'bg-spazio-gold text-spazio-dark hover:bg-spazio-gold/90'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {subscribing === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Assinar Agora'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}


        {/* Back to home */}
        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white/50 hover:text-white"
          >
            Voltar para página inicial
          </Button>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              Assinatura Criada!
            </DialogTitle>
            <DialogDescription>
              Sua assinatura foi criada com sucesso. Agora você será redirecionado
              para a página de pagamento para confirmar sua compra.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => {
                window.open(paymentUrl, '_blank');
                setShowSuccessDialog(false);
              }}
              className="w-full bg-spazio-accent hover:bg-spazio-gold"
            >
              Ir para Pagamento
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
