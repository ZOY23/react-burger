import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../services/actions/authActions';
import { AppDispatch } from '../../services/store/store';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store/store';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        // Ошибка обрабатывается в slice
      });
  };

  if (!user) {
    return null; // или загрузочный спиннер
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <nav className={styles.navigation}>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) => 
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            Профиль
          </NavLink>
          <NavLink
            to="/profile/orders"
            className={({ isActive }) => 
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            История заказов
          </NavLink>
          <button 
            onClick={handleLogout}
            className={styles.link}
          >
            Выход
          </button>
        </nav>
        <p className={styles.note}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;