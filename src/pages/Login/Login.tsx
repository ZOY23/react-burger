import React, { ChangeEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Login.module.css';
import { useAppDispatch } from '../../services/store/hooks';
import { loginUser } from '../../services/actions/authActions';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        // Всегда перенаправляем на главную после логина
        navigate('/', { replace: true }); 
      })
      .catch(() => {
        // Ошибка обрабатывается в slice
      });
  };

  const inputProps = {
    onPointerEnterCapture: () => {},
    onPointerLeaveCapture: () => {},
    error: false,
    errorText: 'Ошибка',
    size: 'default' as const,
    extraClass: 'mb-6'
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-medium`}>Вход</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          name="email"
          {...inputProps}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          name="password"
          {...inputProps}
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
        >
          Войти
        </Button>
      </form>
      <div className={styles.links}>
        <p className={`${styles.text} text text_type_main-default`}>
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className={`${styles.text} text text_type_main-default`}>
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;