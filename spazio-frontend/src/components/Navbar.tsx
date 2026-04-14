import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, CreditCard, Users, Calendar, LayoutDashboard, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticated, getCurrentUser, logout, isAdmin, isProfessor } from "@/services/auth";

const publicLinks = [
  { label: "Início", href: "#inicio" },
];

const privateLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Modalidades", href: "#modalidades" },
  { label: "Depoimentos", href: "#depoimentos" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = loggedIn ? privateLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b-2 border-spazio-moss">
      <div className="container-narrow flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="font-display text-xl font-bold text-foreground tracking-wide">
          SPAZIO
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            {loggedIn && (
              <li>
                <Link
                  to="/planos"
                  className="flex items-center gap-2 font-body text-sm font-medium text-spazio-gold hover:text-primary transition-colors"
                >
                  <CreditCard size={16} />
                  Mensalidades
                </Link>
              </li>
            )}
            {loggedIn && (
              <li>
                <Link
                  to="/professores"
                  className="flex items-center gap-2 font-body text-sm font-medium text-spazio-gold hover:text-primary transition-colors"
                >
                  <Users size={16} />
                  Professores
                </Link>
              </li>
            )}
            {loggedIn && (
              <li>
                <Link
                  to="/agendamentos"
                  className="flex items-center gap-2 font-body text-sm font-medium text-spazio-gold hover:text-primary transition-colors"
                >
                  <Calendar size={16} />
                  Agendamentos
                </Link>
              </li>
            )}
            {loggedIn && isProfessor() && (
              <li>
                <Link
                  to="/painel-professor"
                  className="flex items-center gap-2 font-body text-sm font-medium text-spazio-gold hover:text-primary transition-colors"
                >
                  <BookOpen size={16} />
                  Meu Painel
                </Link>
              </li>
            )}
            {loggedIn && isAdmin() && (
              <li>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 font-body text-sm font-medium text-spazio-gold hover:text-primary transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {loggedIn ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                <User size={16} />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-transparent bg-spazio-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-spazio-gold"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-transparent bg-spazio-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-spazio-gold"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col py-4 px-6 gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-body text-base text-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {loggedIn && (
                <li>
                  <Link
                    to="/planos"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 font-body text-base text-spazio-gold hover:text-primary transition-colors"
                  >
                    <CreditCard size={18} />
                    Mensalidades
                  </Link>
                </li>
              )}
              {loggedIn && (
                <li>
                  <Link
                    to="/professores"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 font-body text-base text-spazio-gold hover:text-primary transition-colors"
                  >
                    <Users size={18} />
                    Professores
                  </Link>
                </li>
              )}
              {loggedIn && (
                <li>
                  <Link
                    to="/agendamentos"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 font-body text-base text-spazio-gold hover:text-primary transition-colors"
                  >
                    <Calendar size={18} />
                    Agendamentos
                  </Link>
                </li>
              )}
              {loggedIn && isProfessor() && (
                <li>
                  <Link
                    to="/painel-professor"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 font-body text-base text-spazio-gold hover:text-primary transition-colors"
                  >
                    <BookOpen size={18} />
                    Meu Painel
                  </Link>
                </li>
              )}
              {loggedIn && isAdmin() && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 font-body text-base text-spazio-gold hover:text-primary transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    Admin
                  </Link>
                </li>
              )}
              {loggedIn ? (
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-spazio-accent px-4 py-2 text-base font-semibold text-white transition hover:bg-spazio-gold"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-full bg-spazio-accent px-4 py-2 text-base font-semibold text-white text-center transition hover:bg-spazio-gold"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
