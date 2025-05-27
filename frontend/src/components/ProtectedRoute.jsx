import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRole = userData.rol;
  const token = localStorage.getItem('token');

  // Verificar si el usuario está autenticado
  if (!token || !userRole) {
    // Limpiar cualquier dato residual
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    
    // Redirigir a login y limpiar el historial
    return <Navigate to="/loginCliente" replace state={{ from: location }} />;
  }

  // Verificar si el usuario tiene el rol permitido
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirigir según el rol del usuario
    if (userRole === 'cliente') {
      return <Navigate to="/Tienda" replace />;
    } else if (userRole === 'administrador') {
      return <Navigate to="/admin/inicio" replace />;
    }
    // Si no tiene un rol válido, redirigir al login
    return <Navigate to="/loginCliente" replace />;
  }

  // Si todo está bien, renderizar el componente protegido
  return children;
};

export default ProtectedRoute;