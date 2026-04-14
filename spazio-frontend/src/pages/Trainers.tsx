// src/pages/Trainers.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Calendar, ArrowLeft, Dumbbell, Heart, Zap, Leaf } from 'lucide-react';
import { getTrainers, Trainer, shortDayNames } from '@/services/trainer';
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

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const data = await getTrainers();
      setTrainers(data.trainers);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar professores');
    } finally {
      setLoading(false);
    }
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
      <header className="border-b border-white/10 bg-spazio-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl font-display text-white">Professores</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Nossos Professores
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Escolha um professor e marque sua aula experimental ou agende seus treinos.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <Card
              key={trainer.id}
              className="bg-white/5 backdrop-blur-sm border-0 overflow-hidden hover:bg-white/10 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={trainerImages[trainer.name] || trainer1}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spazio-dark to-transparent" />
              </div>

              <CardContent className="p-6 -mt-16 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-spazio-gold bg-spazio-dark">
                    <img
                      src={trainerImages[trainer.name] || trainer1}
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-white">{trainer.name}</h3>
                    <p className="text-sm text-white/60">{trainer.role}</p>
                  </div>
                </div>

                {trainer.bio && (
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">{trainer.bio}</p>
                )}

                {trainer.specialties && (
                  <div className="flex flex-wrap gap-2 mb-4">
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

                {trainer.availabilities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-white/50 mb-2">Dias disponíveis:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set(trainer.availabilities.map((a) => a.dayOfWeek))).map(
                        (day) => (
                          <span
                            key={day}
                            className="px-2 py-0.5 rounded bg-spazio-gold/20 text-spazio-gold text-xs"
                          >
                            {shortDayNames[day]}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                <Link to={`/professores/${trainer.id}`}>
                  <Button className="w-full bg-spazio-gold text-spazio-dark hover:bg-spazio-gold/90">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Aula
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
