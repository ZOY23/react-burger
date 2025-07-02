import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-large`}>404</h1>
      <p className={`${styles.text} text text_type_main-medium`}>
        Страница не найдена
      </p>
      <Link to="/" className={`${styles.link} text text_type_main-default`}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;