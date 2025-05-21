// src/pages/Login/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../services/actions/authActions';
import { AppDispatch, RootState } from '../../services/store/store';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuth) {
      const from = location.state?.from || '/';
      navigate(from);
    }
  }, [isAuth, navigate, location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className={styles.container}>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.error}>{error as string}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
      <div className={styles.links}>
        <p>Вы - новый пользователь? <Link to="/register">Зарегистрироваться</Link></p>
        <p>Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link></p>
      </div>
    </div>
  );
};

export default Login;