import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from './components/app-header/';
import styles from './App.module.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ProfileInfo from './pages/Profile/ProfileInfo';
import ProtectedRouteElement from './components/ProtectedRouteElement/ProtectedRouteElement';
import Home from './pages/Home';
import IngredientDetails from './pages/IngredientDetails';
import NotFound from './pages/NotFound';
import { Modal } from './components/modal/modal';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  return (
    <div className="App">
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
          </Route>
          <Route path="/ingredients/:id" element={<IngredientDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {background && (
          <Routes>
            <Route
              path="/ingredients/:id"
              element={
                <Modal onClose={() => navigate(-1)}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;