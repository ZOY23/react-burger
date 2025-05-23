// src/pages/ResetPassword/ResetPassword.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://norma.nomoreparties.space/api/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Пароль успешно изменен');
        localStorage.removeItem('fromForgotPassword');
        navigate('/login');
      } else {
        setMessage('Ошибка: ' + (data.message || 'Неизвестная ошибка'));
      }
    } catch (error) {
      setMessage('Ошибка сети');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Восстановление пароля</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Введите код из письма"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        {message && <p className={styles.message}>{message}</p>}
        <button type="submit">Сохранить</button>
      </form>
      <div className={styles.links}>
        <p>Вспомнили пароль? <Link to="/login">Войти</Link></p>
      </div>
    </div>
  );
};

export default ResetPassword;