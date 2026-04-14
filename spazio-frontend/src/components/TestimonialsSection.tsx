import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    name: "Ana Paula S.",
    text: "Entrei no Spazio sem motivação e hoje não consigo ficar sem treinar. Os professores são incríveis e o ambiente é super acolhedor!",
  },
  {
    name: "Marcos Oliveira",
    text: "O funcional mudou minha vida. Perdi 12kg em 6 meses e ganhei uma disposição que não tinha há anos. Recomendo demais!",
  },
  {
    name: "Juliana Costa",
    text: "O pilates me ajudou a resolver uma dor crônica nas costas que eu tinha há 3 anos. A Camila é uma profissional excepcional.",
  },
  {
    name: "Pedro Henrique",
    text: "Comecei a ioga por curiosidade e hoje é a parte mais importante da minha rotina. Encontrei paz e foco que não imaginava.",
  },
];

const TestimonialsSection = () => {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section id="depoimentos" className="section-padding bg-secondary">
      <div className="container-narrow max-w-2xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
            O que dizem nossos alunos
          </h2>
        </ScrollReveal>

        <div className="relative bg-card rounded-xl p-8 md:p-12 shadow-[var(--shadow-card)] min-h-[220px] flex flex-col items-center justify-center border border-[hsl(120,25%,35%)]/10">
          <Quote size={32} className="text-primary/30 mb-4" />
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-body text-base md:text-lg text-foreground leading-relaxed italic mb-6">
                "{testimonials[idx].text}"
              </p>
              <p className="font-body text-sm font-semibold text-primary">
                — {testimonials[idx].name}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
