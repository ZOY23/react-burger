import React, { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Register.module.css';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { registerUser } from '../../services/actions/authActions';

const Register = () => {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, isLoading } = useAppSelector(state => state.auth);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(form))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(() => {});
  };

  const inputProps = {
    onPointerEnterCapture: () => {},
    onPointerLeaveCapture: () => {},
    error: false,
    errorText: 'Ошибка',
    size: 'default' as const,
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-medium`}>Регистрация</h1>
      {error && (
        <p className={`${styles.error} text text_type_main-default`}>
          {error}
        </p>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          name="name"
          {...inputProps}
        />
        <Input
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          name="email"
          {...inputProps}
        />
        <Input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          icon={isPasswordVisible ? "HideIcon" : "ShowIcon"}
          onIconClick={() => setIsPasswordVisible(!isPasswordVisible)}
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
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </form>
      <div className={styles.links}>
        <p className={`${styles.text} text text_type_main-default`}>
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;