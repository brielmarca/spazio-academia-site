import { motion } from "framer-motion";
import heroImg from "@/assets/hero-gym.jpg";

const HeroSection = () => (
  <section id="inicio" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
    <img
      src={heroImg}
      alt="Academia Spazio - ambiente moderno de treino"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 bg-foreground/60" />

    <div className="relative z-10 text-center px-4 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6"
      >
        Bem-vindo ao seu Spazio de Transformação.
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <p className="font-body text-lg md:text-xl text-primary-foreground/95 leading-relaxed px-6 py-4 border border-spazio-gold/50 bg-black/20 backdrop-blur-sm rounded-lg">
          Na Spazio Fitness & Wellness, excelência não é um objetivo — é o padrão. Criamos um ambiente onde desempenho e bem-estar se encontram, proporcionando uma experiência única, personalizada e elegante. Aqui, cada detalhe é pensado para elevar o seu corpo, equilibrar a sua mente e redefinir o seu estilo de vida.
        </p>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
