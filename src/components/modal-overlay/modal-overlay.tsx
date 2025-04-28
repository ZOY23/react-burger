import React from 'react';
import { useAppDispatch } from '../../services/store/hooks';
import { closeModal } from '../../services/modal/actions';
import styles from './ModalOverlay.module.css';

interface ModalOverlayProps {
  onClose?: () => void;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  
  const handleClose = () => {
    dispatch(closeModal());
    onClose?.();
  };

  return <div className={styles.overlay} onClick={handleClose} />;
};