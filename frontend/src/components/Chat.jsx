import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/index.js';

import { fetchContent, fetchingError, fetchingStatus } from '../slices/channelsSlice.js';
import { getMessages } from '../slices/messagesSlice.js';
import { getCurrentChannelId, getCurrentModalType } from '../slices/userInterfaceSlice.js';

import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import AddNewChannelModal from './modals/AddNewChannelModal.jsx';
import RemoveChannelModal from './modals/RemoveChannelModal.jsx';
import RenameChannelModal from './modals/RenameChannelModal.jsx';

const getCurrentModal = (type) => {
  if (!type) {
    return null;
  }
  const map = {
    add: AddNewChannelModal,
    rename: RenameChannelModal,
    remove: RemoveChannelModal,
  };
  return map[type];
};

const Chat = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef();
  const { getAuthHeader } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchContent(getAuthHeader()));
  }, [dispatch, getAuthHeader]);

  const currentModalType = useSelector(getCurrentModalType);
  const ModalComponent = getCurrentModal(currentModalType);
  const loadingStatus = useSelector(fetchingStatus);
  const loadingError = useSelector(fetchingError);
  if (loadingError?.name) {
    if (loadingError.name === 'AxiosError') {
      toast.error(t('errors.network'));
    } if (loadingError.name !== 'AxiosError') {
      toast.error(t('errors.unknown'));
    }
  }

  const currentChannelId = useSelector(getCurrentChannelId);
  const allMessages = useSelector(getMessages);
  const currentMessages = allMessages.filter((message) => message.channelId === currentChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [currentMessages]);

  return loadingStatus === 'rejected' ? (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div role="status" className="spinner-border text-primary">
        <span className="visually-hidden">{t('loading')}</span>
      </div>
    </div>
  ) : (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </Row>
      {ModalComponent && <ModalComponent />}
    </Container>
  );
};

export default Chat;
