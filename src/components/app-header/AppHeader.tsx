import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeader = () => {
  const location = useLocation();
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header} data-testid="app-header"> {/* Добавлено здесь */}
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            end
            data-testid="constructor-link" // Дополнительный тестовый атрибут
          >
            <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink 
            to="/feed" 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            data-testid="feed-link" // Дополнительный тестовый атрибут
          >
            <ListIcon type={location.pathname === '/feed' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/" data-testid="logo-link"> {/* Дополнительный тестовый атрибут */}
            <Logo />
          </NavLink>
        </div>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
          data-testid="profile-link" // Дополнительный тестовый атрибут
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </NavLink>
      </div>
    </header>
  );
};