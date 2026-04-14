import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import trainer1 from "@/assets/trainer1.jpg";
import trainer2 from "@/assets/trainer2.jpg";
import trainer3 from "@/assets/trainer3.jpg";

const trainers = [
  { name: "Rafael Mendes", role: "Musculação & Funcional", img: trainer1 },
  { name: "Camila Torres", role: "Pilates & Reabilitação", img: trainer2 },
  { name: "Lucas Ferreira", role: "Ioga & Meditação", img: trainer3 },
];

const TrainersSection = () => (
  <section id="professores" className="section-padding bg-card">
    <div className="container-narrow">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          Nossos Professores
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {trainers.map((t, i) => (
          <ScrollReveal key={t.name} delay={i * 0.12}>
            <div className="text-center group">
              <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[hsl(120,25%,35%)]/30 group-hover:border-spazio-moss transition-colors duration-300">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{t.name}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">{t.role}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3}>
        <div className="text-center mt-10">
          <Link to="/professores">
            <Button className="bg-primary hover:brightness-110 text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Ver Todos e Agendar
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default TrainersSection;
