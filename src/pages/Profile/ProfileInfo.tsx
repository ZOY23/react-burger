import { useOutletContext } from 'react-router-dom';
import { IUser } from '../../utils/types';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useState, ChangeEvent } from 'react';
import styles from './Profile.module.css';

export const ProfileInfo = () => {
  const user = useOutletContext<IUser>();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '********'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '********'
    });
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.profileForm}>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Имя"
          onChange={handleChange}
          value={formData.name}
          name="name"
          icon={isEditing ? 'CloseIcon' : 'EditIcon'}
          onIconClick={() => setIsEditing(!isEditing)}
          disabled={!isEditing}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
      <div className="mb-6">
        <Input
          type="email"
          placeholder="Логин"
          onChange={handleChange}
          value={formData.email}
          name="email"
          icon={isEditing ? 'CloseIcon' : 'EditIcon'}
          onIconClick={() => setIsEditing(!isEditing)}
          disabled={!isEditing}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
      <div className="mb-6">
        <Input
          type="password"
          placeholder="Пароль"
          onChange={handleChange}
          value={formData.password}
          name="password"
          icon={isEditing ? 'CloseIcon' : 'EditIcon'}
          onIconClick={() => setIsEditing(!isEditing)}
          disabled={!isEditing}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>

      {isEditing && (
        <div className={styles.buttons}>
          <Button 
            type="secondary" 
            size="medium" 
            onClick={handleCancel}
            htmlType="button"
          >
            Отмена
          </Button>
          <Button 
            type="primary" 
            size="medium"
            htmlType="submit"
          >
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};