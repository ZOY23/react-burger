import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
        setError('');
        localStorage.setItem('fromForgotPassword', 'true');
        navigate('/reset-password');
      } else {
        setError(data.message || 'Неизвестная ошибка');
        setMessage('');
      }
    } catch (error) {
      setError('Ошибка сети');
      setMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-medium`}>Восстановление пароля</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          error={!!error}
          errorText={error}
          size="default"
          extraClass="mb-6"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        {message && (
          <p className={`${styles.message} text text_type_main-default`}>
            {message}
          </p>
        )}
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
        >
          Восстановить
        </Button>
      </form>
      <div className={styles.links}>
        <p className={`${styles.text} text text_type_main-default`}>
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;