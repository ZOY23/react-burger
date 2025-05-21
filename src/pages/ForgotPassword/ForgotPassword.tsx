// src/pages/ForgotPassword/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://norma.nomoreparties.space/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Инструкции отправлены на email');
        localStorage.setItem('fromForgotPassword', 'true');
        navigate('/reset-password');
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
          type="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <p className={styles.message}>{message}</p>}
        <button type="submit">Восстановить</button>
      </form>
      <div className={styles.links}>
        <p>Вспомнили пароль? <Link to="/login">Войти</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;