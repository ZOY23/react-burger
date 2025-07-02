import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ResetPassword.module.css';
import { resetPassword } from '../../services/actions/authActions';
import { useAppDispatch } from '../../services/store/hooks';

const ResetPassword: React.FC = () => {
  const [form, setForm] = useState({
    password: '',
    token: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(resetPassword(form)).unwrap();
      if (result.success) {
        setMessage('Пароль успешно изменен');
        localStorage.removeItem('resetPasswordVisited');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-medium`}>Восстановление пароля</h1>
      {error && (
        <p className={`${styles.error} text text_type_main-default`}>
          {error}
        </p>
      )}
      {message && (
        <p className={`${styles.message} text text_type_main-default`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          type="password"
          placeholder="Введите новый пароль"
          value={form.password}
          onChange={handleChange}
          name="password"
          size="default"
          extraClass="mb-6"
          required
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <Input
          type="text"
          placeholder="Введите код из письма"
          value={form.token}
          onChange={handleChange}
          name="token"
          size="default"
          extraClass="mb-6"
          required
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
          disabled={!form.password || !form.token}
        >
          Сохранить
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

export default ResetPassword;