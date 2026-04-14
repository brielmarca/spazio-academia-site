import { Instagram, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white py-8 px-4 border-t border-border">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl font-bold text-foreground tracking-wide mb-1">
              SPAZIO
            </h3>
            <p className="font-body text-xs text-muted-foreground">
              © {new Date().getFullYear()} Spazio Academia. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/spazio_fitness_wellness"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.facebook.com/SpazioFitnessWellness/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://wa.me/5553991498222"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          </div>

          <p className="font-body text-xs text-muted-foreground">
            *Consulte condições diretamente na academia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
