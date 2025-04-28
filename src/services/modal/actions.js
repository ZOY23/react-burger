export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const openModal = (modalType, modalProps = {}) => ({
  type: OPEN_MODAL,
  payload: { modalType, modalProps }
});

export const closeModal = () => ({
  type: CLOSE_MODAL
});