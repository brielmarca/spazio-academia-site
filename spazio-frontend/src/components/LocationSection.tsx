import { MapPin, Phone, Clock, Mail } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const LocationSection = () => {
  return (
    <section id="localizacao" className="py-16 md:py-24 bg-gradient-to-br from-spazio-dark to-spazio-dark/95">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Onde Estamos
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[hsl(120,25%,35%)]/15 to-transparent border-l-2 border-[hsl(120,25%,35%)]">
                <div className="w-10 h-10 rounded-full bg-[hsl(120,25%,35%)]/20 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[hsl(120,25%,35%)]" />
                </div>
                <div>
                  <p className="font-body text-sm text-white font-medium mb-1">Endereço</p>
                  <p className="font-body text-sm text-white/60">
                    R. Gen. Telles, 710 - Centro, Pelotas - RS, 96010-310
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[hsl(120,25%,35%)]/15 to-transparent border-l-2 border-[hsl(120,25%,35%)]">
                <div className="w-10 h-10 rounded-full bg-[hsl(120,25%,35%)]/20 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[hsl(120,25%,35%)]" />
                </div>
                <div>
                  <p className="font-body text-sm text-white font-medium mb-1">WhatsApp</p>
                  <a href="https://wa.me/5553991498222" className="font-body text-sm text-white/60 hover:text-[hsl(120,25%,35%)] transition-colors">
                    (53) 99149-8222
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[hsl(120,25%,35%)]/15 to-transparent border-l-2 border-[hsl(120,25%,35%)]">
                <div className="w-10 h-10 rounded-full bg-[hsl(120,25%,35%)]/20 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[hsl(120,25%,35%)]" />
                </div>
                <div>
                  <p className="font-body text-sm text-white font-medium mb-1">Horário de Funcionamento</p>
                  <p className="font-body text-sm text-white/60 whitespace-pre-line">
                    Seg-Sex 7h-13h | 16h-21h{'\n'}Sáb. 10h-13h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[hsl(120,25%,35%)]/15 to-transparent border-l-2 border-[hsl(120,25%,35%)]">
                <div className="w-10 h-10 rounded-full bg-[hsl(120,25%,35%)]/20 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-[hsl(120,25%,35%)]" />
                </div>
                <div>
                  <p className="font-body text-sm text-white font-medium mb-1">Email</p>
                  <a href="mailto:contato@spazioacademia.com.br" className="font-body text-sm text-white/60 hover:text-[hsl(120,25%,35%)] transition-colors">
                    contato@spazioacademia.com.br
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="rounded-xl overflow-hidden border border-white/10 h-[350px] shadow-xl">
              <iframe
                title="Localização Academia Spazio"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3400.0!2d-52.3425!3d-31.7654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ1JzU1LjQiUyA1MsKwMjAnMzMuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
