import { useState, type FormEvent } from "react";
import { MapPin, Phone, Clock, Instagram, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "./ScrollReveal";
import { api } from "@/services/api";

const WHATSAPP_URL = "https://wa.me/5500000000000?text=Ol%C3%A1!%20Vi%20o%20site%20e%20gostaria%20de%20agendar%20uma%20aula%20experimental.";

const ContactSection = () => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    try {
      await api.criarLead({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      });

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ nome: "", email: "", telefone: "" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contato" className="section-padding bg-card">
      <div className="container-narrow">
        <ScrollReveal>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Contato & Localização
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="(53) 99999-9999"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60"
              >
                <Send size={16} />
                {sending ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </ScrollReveal>

          {/* Info + Map */}
          <ScrollReveal delay={0.15}>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-0.5 shrink-0" />
                <p className="font-body text-sm text-muted-foreground">
                  Casa - R. Gen. Telles, 710 - Centro, Pelotas - RS, 96010-310
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-primary mt-0.5 shrink-0" />
                <p className="font-body text-sm text-muted-foreground">(53) 3222-0491</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-primary mt-0.5 shrink-0" />
                <p className="font-body text-sm text-muted-foreground whitespace-pre-line">
                  Seg-Sex 7h-13h | 16h-21h{"\n"}Sáb. 10h-13h
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
                <a
                  href="https://instagram.com/spazio_fitness_wellness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>

              {/* Google Maps */}
              <div className="rounded-lg overflow-hidden mt-4 border border-border">
                <iframe
                  title="Localização Academia Spazio"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3400.0!2d-52.3425!3d-31.7654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ1JzU1LjQiUyA1MsKwMjAnMzMuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
