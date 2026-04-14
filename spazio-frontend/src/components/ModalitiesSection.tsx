import { Dumbbell, Zap, Heart, Leaf } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import musculacaoImg from "@/assets/musculacao.jpg";
import funcionalImg from "@/assets/funcional.jpg";
import pilatesImg from "@/assets/pilates.jpg";
import yogaImg from "@/assets/yoga.jpg";

const modalities = [
  {
    title: "Musculação",
    desc: "Ganhe força, defina o corpo e eleve sua autoestima com treinos personalizados e equipamentos de ponta.",
    img: musculacaoImg,
    icon: Dumbbell,
  },
  {
    title: "Funcional",
    desc: "Melhore sua resistência, agilidade e coordenação com exercícios dinâmicos que desafiam todo o corpo.",
    img: funcionalImg,
    icon: Zap,
  },
  {
    title: "Pilates",
    desc: "Fortaleça o core, corrija a postura e encontre equilíbrio entre corpo e mente com movimentos controlados.",
    img: pilatesImg,
    icon: Heart,
  },
  {
    title: "Ioga",
    desc: "Conecte-se consigo através da respiração, flexibilidade e meditação em um ambiente de paz e serenidade.",
    img: yogaImg,
    icon: Leaf,
  },
];

const ModalitiesSection = () => (
  <section id="modalidades" className="section-padding bg-gradient-to-br from-[hsl(120,20%,92%)] to-[hsl(120,15%,97%)]">
    <div className="container-narrow">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          Nossas Modalidades
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modalities.map((m, i) => (
          <ScrollReveal key={m.title} delay={i * 0.1}>
            <div className="group bg-card rounded-lg overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-spazio-moss flex items-center justify-center">
                  <m.icon size={18} className="text-white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{m.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ModalitiesSection;
