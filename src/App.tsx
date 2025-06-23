import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from './components/app-header';
import styles from './App.module.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Profile } from './pages/Profile';
import { ProfileInfo } from './pages/Profile/ProfileInfo';
import ProtectedRouteElement from './components/ProtectedRouteElement/ProtectedRouteElement';
import Home from './pages/Home';
import IngredientDetails from './pages/IngredientDetails';
import NotFound from './pages/NotFound';
import { Modal } from './components/modal/modal';
import { OrdersHistory } from './pages/Profile/Orders/OrdersHistory';
import { useAppDispatch, useAppSelector } from './services/store/hooks';
import { IngredientDetails as IngredientDetailsComponent } from './components/ingredient-details/ingredient-details';
import { forceLogout } from './services/slices/authSlice';
import { IIngredient } from './utils/types';
import { Feed } from './pages/Feed/Feed';
import { FeedOrderDetails } from './pages/Feed/FeedOrderDetails';
import { OrderDetails as ProfileOrderDetails } from './pages/Profile/Orders/OrderDetails';
import { clearCurrentOrder } from './services/slices/orderSlice';

interface LocationState {
  background?: Location;
  from?: string;
}

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const background = (location.state as LocationState)?.background;
  const currentIngredient = useAppSelector(state => state.ingredients.currentIngredient);

  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      if (event.detail?.message === 'jwt expired' || event.detail?.message === 'No tokens available') {
        dispatch(forceLogout());
        navigate('/login', { state: { from: location.pathname } });
      }
    };

    window.addEventListener('unauthorized', handleUnauthorized as EventListener);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized as EventListener);
    };
  }, [dispatch, navigate, location]);

  const handleModalClose = () => {
    dispatch(clearCurrentOrder());
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Routes location={background || location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <ProtectedRouteElement element={<Login />} onlyUnAuth />
          } />
          <Route path="/register" element={
            <ProtectedRouteElement element={<Register />} onlyUnAuth />
          } />
          <Route path="/forgot-password" element={
            <ProtectedRouteElement element={<ForgotPassword />} onlyUnAuth />
          } />
          <Route path="/reset-password" element={
            <ProtectedRouteElement element={<ResetPassword />} onlyUnAuth onlyForReset />
          } />
          <Route path="/profile" element={
            <ProtectedRouteElement element={<Profile />} />
          }>
            <Route index element={<ProfileInfo />} />
            <Route path="orders" element={<OrdersHistory />} />
          </Route>
          <Route path="/ingredients/:id" element={<IngredientDetails />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/:number" element={<FeedOrderDetails />} />
          <Route path="/profile/orders/:number" element={
            <ProtectedRouteElement element={<ProfileOrderDetails />} />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path="/ingredients/:id"
              element={
                <Modal title="Детали ингредиента" onClose={handleModalClose}>
                  {currentIngredient && <IngredientDetailsComponent ingredient={currentIngredient} />}
                </Modal>
              }
            />
            <Route
              path="/feed/:number"
              element={
                <Modal title="Детали заказа" onClose={handleModalClose}>
                  <FeedOrderDetails />
                </Modal>
              }
            />
            <Route
              path="/profile/orders/:number"
              element={
                <Modal title="Детали заказа" onClose={handleModalClose}>
                  <ProfileOrderDetails />
                </Modal>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default App;