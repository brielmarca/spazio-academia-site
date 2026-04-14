// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/auth';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rotas privadas
 * Redireciona para /login se usuário não estiver autenticado
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
