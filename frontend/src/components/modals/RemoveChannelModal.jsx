import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/index.js';
import {
  getCurrentModalType,
  getChannelForModal,
  actions as userInterfaceActions,
} from '../../slices/userInterfaceSlice.js';

const RemoveChannelModal = () => {
  const { t } = useTranslation();
  const { removeChannel } = useSocket();
  const isModalShown = !!useSelector(getCurrentModalType);
  const channel = useSelector(getChannelForModal);
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setDisabled(true);
    try {
      removeChannel(channel);
      dispatch(userInterfaceActions.hideModal());
      toast.success(t('modals.channelRemoved'));
    } catch (e) {
      setDisabled(false);
    }
  };

  return (
    <Modal
      show={isModalShown}
      onHide={() => dispatch(userInterfaceActions.hideModal())}
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
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => dispatch(userInterfaceActions.hideModal())}
          >
            {t('modals.canceling')}
          </Button>
          <Button variant="danger" disabled={disabled} onClick={handleClick}>{t('modals.removeButton')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannelModal;
