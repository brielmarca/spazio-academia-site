import ScrollReveal from "./ScrollReveal";

const AboutSection = () => (
  <section id="sobre" className="section-padding bg-gradient-to-br from-[hsl(120,20%,95%)] to-card">
    <div className="container-narrow text-center max-w-3xl mx-auto">
      <ScrollReveal>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          Sobre Nós
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.15}>
        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
          Na Academia Spazio, acreditamos que cada pessoa merece um espaço dedicado à sua
          evolução. Unimos força, flexibilidade e consciência corporal em um ambiente acolhedor
          e moderno, onde musculação e funcional convivem harmoniosamente com pilates e ioga.
          Nosso time de profissionais qualificados está pronto para guiar você em uma jornada
          de transformação — do corpo e da mente.
        </p>
      </ScrollReveal>
    </div>
  </section>
);

export default AboutSection;
