// src/components/ProtectedRouteElement/ProtectedRouteElement.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store/store';

interface ProtectedRouteElementProps {
  element: React.ReactElement;
  onlyUnAuth?: boolean;
  onlyForReset?: boolean;
}

const ProtectedRouteElement: React.FC<ProtectedRouteElementProps> = ({ 
  element, 
  onlyUnAuth = false,
  onlyForReset = false 
}) => {
  const location = useLocation();
  const { isAuth, isLoading } = useSelector((state: RootState) => state.auth);
  const fromForgotPassword = localStorage.getItem('fromForgotPassword') === 'true';

  if (isLoading) {
    return null; // или загрузочный спиннер
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyForReset && !fromForgotPassword) {
    return <Navigate to="/forgot-password" replace />;
  }

  return element;
};

export default ProtectedRouteElement;