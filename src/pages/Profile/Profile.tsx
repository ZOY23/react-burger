import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { logoutUser } from '../../services/slices/authSlice';
import { IUser } from '../../utils/types';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/login'))
      .catch((err: unknown) => {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Logout failed:', errorMessage);
      });
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebar}>
        <nav className={styles.navigation}>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) => 
              `${styles.link} ${isActive ? styles.active : ''} text text_type_main-medium`
            }
          >
            Профиль
          </NavLink>
          <NavLink
            to="/profile/orders"
            className={({ isActive }) => 
              `${styles.link} ${isActive ? styles.active : ''} text text_type_main-medium`
            }
          >
            История заказов
          </NavLink>
          <button 
            onClick={handleLogout}
            className={`${styles.link} ${styles.logoutButton} text text_type_main-medium`}
            type="button"
          >
            Выход
          </button>
        </nav>
        <p className={`${styles.note} text text_type_main-default text_color_inactive`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </div>
      <div className={styles.content}>
        <Outlet context={user as IUser | undefined} />
      </div>
    </div>
  );
};