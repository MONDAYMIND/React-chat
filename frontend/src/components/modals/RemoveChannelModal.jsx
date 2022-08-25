import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.js';

const RemoveChannelModal = ({ onHide, currentChannel }) => {
  const { t } = useTranslation();
  const { removeChannel } = useSocket();
  const handleClick = () => {
    try {
      removeChannel(currentChannel);
      onHide();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      show
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modals.removeChannel')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.removeConfirming')}</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={onHide}>{t('modals.canceling')}</Button>
          <Button variant="danger" onClick={handleClick}>{t('modals.removeButton')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannelModal;
