import styles from './ModalOverlay.module.css';

interface ModalOverlayProps {
  onClose: () => void;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose }) => {
  return <div className={styles.overlay} onClick={onClose} />;
};