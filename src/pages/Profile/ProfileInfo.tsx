import { useOutletContext } from 'react-router-dom';
import { IUser } from '../../utils/types';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './Profile.module.css';
import { useAppDispatch } from '../../services/store/hooks';
import { updateUser } from '../../services/actions/authActions';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

export const ProfileInfo: React.FC = () => {
  const user = useOutletContext<IUser | undefined>();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '********'
  });
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const updatedData: { name: string; email: string; password?: string } = {
      name: formData.name,
      email: formData.email
    };
    
    if (formData.password !== '********') {
      updatedData.password = formData.password;
    }

    dispatch(updateUser(updatedData))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setFormData({
          ...formData,
          password: '********'
        });
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '********'
    });
    setIsEditing(false);
  };

  const handleIconClick = () => {
    setIsEditing(!isEditing);
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
          onIconClick={handleIconClick}
          disabled={!isEditing}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          error={false}
          errorText=""
          size="default"
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
          onIconClick={handleIconClick}
          disabled={!isEditing}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          error={false}
          errorText=""
          size="default"
        />
      </div>
      <div className="mb-6">
        <Input
          type={isEditing ? "text" : "password"}
          placeholder="Пароль"
          onChange={handleChange}
          value={formData.password}
          name="password"
          icon={isEditing ? 'CloseIcon' : 'EditIcon'}
          onIconClick={handleIconClick}
          disabled={!isEditing}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          error={false}
          errorText=""
          size="default"
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
            disabled={!formData.name || !formData.email || !formData.password}
          >
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};