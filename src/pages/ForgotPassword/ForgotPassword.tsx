import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ForgotPassword.module.css';
import { forgotPassword } from '../../services/actions/authActions';
import { useAppDispatch } from '../../services/store/hooks';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(forgotPassword({ email })).unwrap();
      if (result.success) {
        setMessage('Инструкции отправлены на email');
        setError('');
        localStorage.setItem('resetPasswordVisited', 'true');
        navigate('/reset-password', { state: { fromForgotPassword: true } });
      }
    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка');
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-medium`}>Восстановление пароля</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={handleChange}
          name="email"
          error={!!error}
          errorText={error}
          size="default"
          extraClass="mb-6"
          required
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
          disabled={!email}
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