import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../services/actions/authActions';
import { resetUserData } from '../../services/slices/authSlice';
import { AppDispatch, RootState } from '../../services/store/store';

const ProfileInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, initialUserData, error } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    name: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        password: '',
      });
    }
  }, [user]);

  const validate = () => {
    let valid = true;
    const newErrors = {
      email: '',
      name: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email некорректен';
      valid = false;
    }

    if (!formData.name) {
      newErrors.name = 'Имя обязательно';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch(updateUser(formData))
        .unwrap()
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          // Ошибка обрабатывается в slice
        });
    }
  };

  const handleCancel = () => {
    dispatch(resetUserData());
    setIsEditing(false);
  };

  return (
    <div className={styles.profileInfo}>
      <h1 className={styles.title}>Профиль</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Имя</label>
          {isEditing ? (
            <>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </>
          ) : (
            <span className={styles.value}>{user?.name}</span>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Логин</label>
          {isEditing ? (
            <>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </>
          ) : (
            <span className={styles.value}>{user?.email}</span>
          )}
        </div>
        {isEditing && (
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Введите новый пароль"
            />
          </div>
        )}
        <div className={styles.buttons}>
          {isEditing ? (
            <>
              <button type="submit" className={styles.saveButton}>
                Сохранить
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Редактировать
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;