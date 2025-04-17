import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';

export const AppHeader = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      {/* Левый блок - Конструктор и Лента заказов */}
      <div className={styles.leftSection}>
        <div className={`${styles.navItem} ${styles.active}`}>
          <BurgerIcon type="primary" />
          <p className="text text_type_main-default ml-2">Конструктор</p>
        </div>
        <div className={styles.navItem}>
          <ListIcon type="secondary" />
          <p className="text text_type_main-default ml-2">Лента заказов</p>
        </div>
      </div>

      {/* Центр - Логотип */}
      <div className={styles.logo}>
        <Logo />
      </div>

      {/* Правый блок - Личный кабинет */}
      <div className={styles.navItem}>
        <ProfileIcon type="secondary" />
        <p className="text text_type_main-default ml-2">Личный кабинет</p>
      </div>
    </div>
  </header>
);