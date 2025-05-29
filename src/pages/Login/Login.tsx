import React, { ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Login.module.css';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { loginUser } from '../../services/actions/authActions';

const Login = () => {
  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isLoading } = useAppSelector(state => state.auth);
  const from = location.state?.from || '/';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  const inputProps = {
    onPointerEnterCapture: () => {},
    onPointerLeaveCapture: () => {},
    error: !!error,
    errorText: error || 'Ошибка',
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
          value={form.email}
          onChange={handleChange}
          name="email"
          {...inputProps}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          name="password"
          {...inputProps}
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Войти'}
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