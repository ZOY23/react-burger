import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Input,
  Button
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Register.module.css';

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Обработка регистрации
    console.log({ name, email, password });
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-medium`}>Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={handleNameChange}
          name="name"
          error={false}
          errorText="Ошибка"
          size="default"
          extraClass="mb-6"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
          name="email"
          error={false}
          errorText="Ошибка"
          size="default"
          extraClass="mb-6"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Пароль"
          value={password}
          onChange={handlePasswordChange}
          icon={isPasswordVisible ? "HideIcon" : "ShowIcon"}
          onIconClick={() => setIsPasswordVisible(!isPasswordVisible)}
          name="password"
          error={false}
          errorText="Ошибка"
          size="default"
          extraClass="mb-6"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
        >
          Зарегистрироваться
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