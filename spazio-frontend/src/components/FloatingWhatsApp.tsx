import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/555332220491?text=Ol%C3%A1!%20Vi%20o%20site%20e%20gostaria%20de%20agendar%20uma%20aula%20experimental.";

const FloatingWhatsApp = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
      aria-label="WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" />
    </a>
  );
};

export default FloatingWhatsApp;
