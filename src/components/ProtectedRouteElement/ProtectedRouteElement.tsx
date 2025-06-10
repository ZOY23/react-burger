import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { checkUserAuth } from '../../services/actions/authActions';
import { getCookie } from '../../utils/cookie';
import Loader from '../../components/loader/loader';

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
  const dispatch = useAppDispatch();
  const { isAuth, isLoading } = useAppSelector(state => state.auth);
  const resetPasswordVisited = localStorage.getItem('resetPasswordVisited');
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    if (accessToken || refreshToken) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, accessToken, refreshToken]);

  if (isLoading && (accessToken || refreshToken)) {
    return <Loader />;
  }

  if (onlyForReset && !resetPasswordVisited) {
    return <Navigate to="/forgot-password" replace />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return React.cloneElement(element, { key: location.pathname });
};

export default ProtectedRouteElement;