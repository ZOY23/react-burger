import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  return (
    <div className={styles.container}>
      <h1>Регистрация</h1>
      <form className={styles.form}>
        <input type="text" placeholder="Имя" required />
        <input type="email" placeholder="E-mail" required />
        <input type="password" placeholder="Пароль" required />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <div className={styles.links}>
        <p>Уже зарегистрированы? <Link to="/login">Войти</Link></p>
      </div>
    </div>
  );
};

export default Register;
export {};