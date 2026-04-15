// src/pages/Checkout.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/services/subscription';
import { Loader2, CreditCard, QrCode, FileText, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Plan {
  id: number;
  name: string;
  displayName: string;
  price: number;
  description?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const { toast } = useToast();
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Card form state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    if (planId) {
      // Simulated plan data - in real app would fetch from API
      setPlan({
        id: parseInt(planId),
        name: 'combo',
        displayName: 'Combo Completo',
        price: 19990,
        description: 'Acesso ilimitado a todas as modalidades',
      });
    }
    setLoading(false);
  }, [planId]);

  const copyPixCode = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136a629e-1234-5678-9012-3456789012345204000053039865802BR5913SpazioAcademia6009São Paulo62070503***6304D1E2');
    toast({
      title: 'Código PIX copiado!',
      description: 'Agora realize o pagamento no seu banco.',
    });
  };

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      toast({
        title: 'Pagamento realizado!',
        description: 'Sua assinatura foi ativada com sucesso.',
      });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
            <p className="text-gray-600 mb-6">
              Sua assinatura do plano {plan?.displayName} foi ativada com sucesso.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar para Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Assinatura</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">{plan?.displayName}</p>
                    <p className="text-sm text-gray-500">{plan?.description}</p>
                  </div>
                  <p className="text-xl font-bold">{plan ? formatPrice(plan.price) : ''}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{plan ? formatPrice(plan.price) : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto</span>
                  <span className="text-green-600">R$ 0,00</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t">
                  <span>Total</span>
                  <span>{plan ? formatPrice(plan.price) : ''}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(v) => setPaymentMethod(v as any)}
                className="space-y-3"
              >
                <Label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="pix" className="mr-3" />
                  <QrCode className="w-5 h-5 mr-3 text-green-600" />
                  <span className="font-medium">PIX</span>
                  <span className="ml-auto text-sm text-green-600">Instantâneo</span>
                </Label>
                
                <Label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="card" className="mr-3" />
                  <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-medium">Cartão de Crédito</span>
                  <span className="ml-auto text-sm text-gray-500">Parcelado</span>
                </Label>
                
                <Label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="boleto" className="mr-3" />
                  <FileText className="w-5 h-5 mr-3 text-purple-600" />
                  <span className="font-medium">Boleto Bancário</span>
                  <span className="ml-auto text-sm text-gray-500">5 dias úteis</span>
                </Label>
              </RadioGroup>

              <div className="mt-6">
                {paymentMethod === 'pix' && (
                  <div className="text-center">
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                      <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Escaneie o QR Code</p>
                    </div>
                    <Button onClick={copyPixCode} variant="outline" className="w-full">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Código PIX
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Copie o código e realize o pagamento no seu banco
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Número do Cartão</Label>
                      <Input 
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Nome do Titular</Label>
                      <Input 
                        placeholder="Nome como está no cartão"
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Validade</Label>
                        <Input 
                          placeholder="MM/AA"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input 
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Os dados do cartão são apenas para visualização e simulação. 
                      Não são armazenados.
                    </p>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="text-center">
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                      <FileText className="w-32 h-32 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Boleto gerado</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Baixar Boleto
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      O boleto será enviado para seu email após confirmação
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handlePayment} 
                  disabled={processing}
                  className="w-full mt-6"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    `Pagar ${plan ? formatPrice(plan.price) : ''}`
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;