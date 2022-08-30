import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

import { useAuth } from '../hooks/index.js';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { actions as userInterfaceActions } from '../slices/userInterfaceSlice.js';
import routes from '../routes.js';

import NewMessage from './NewMessage.jsx';
import ChatSelectionButton from './ChatSelectionButton.jsx';
import AddNewChannelModal from './modals/AddNewChannelModal.jsx';
import RemoveChannelModal from './modals/RemoveChannelModal.jsx';
import RenameChannelModal from './modals/RenameChannelModal.jsx';

const getCurrentModal = (eventKey) => {
  const map = {
    add: AddNewChannelModal,
    rename: RenameChannelModal,
    remove: RemoveChannelModal,
  };
  return map[eventKey];
};

const Chat = () => {
  const { t } = useTranslation();
  const { getAuthHeader } = useAuth();
  const dispatch = useDispatch();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [currentModalEvent, setCurrentModalEvent] = useState({ event: null, channel: null });
  const notifyConnectionError = () => toast.error(t('errors.network'));
  const notifyUnknownError = () => toast.error(t('errors.unknown'));

  useEffect(() => {
    const fetchContent = async () => {
      setDataLoaded(false);
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
        const { channels, messages, currentChannelId } = data;
        dispatch(userInterfaceActions.setCurrentChannelId(currentChannelId));
        dispatch(channelsActions.addChannels(channels));
        dispatch(messagesActions.addMessages(messages));
        setDataLoaded(true);
      } catch (err) {
        console.error(err);
        if (!err.isAxiosError) {
          notifyUnknownError();
        } else {
          notifyConnectionError();
        }
      }
    };
    fetchContent();
  }, []);

  const switchChannel = (e) => {
    dispatch(userInterfaceActions.setCurrentChannelId(Number(e.target.id)));
  };
  const ModalComponent = getCurrentModal(currentModalEvent.event);
  const allChannels = useSelector(channelsSelectors.selectAll);
  const { currentChannelId } = useSelector((state) => state.userInterface);
  const currentChannel = allChannels.find((channel) => channel.id === currentChannelId);

  const allMessages = useSelector(messagesSelectors.selectAll);
  const currentMessages = allMessages.filter((message) => message.channelId === currentChannelId);
  const messagesCount = currentMessages.length;

  return !dataLoaded ? (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div role="status" className="spinner-border text-primary">
        <span className="visually-hidden">{t('loading')}</span>
      </div>
    </div>
  ) : (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col xs={4} md={2} className="border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
            <span>{t('chat.channels')}</span>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical border-0"
              onClick={() => {
                setCurrentModalEvent({ event: 'add', channel: currentChannel });
                setModalShow(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul className="nav flex-column nav-pills nav-fill px-2">
            {allChannels.map((channel) => (
              <li key={channel.id} className="nav-item w-100">
                <ChatSelectionButton
                  channel={channel}
                  switchChannel={switchChannel}
                  setCurrentModalEvent={setCurrentModalEvent}
                  setModalShow={setModalShow}
                />
              </li>
            ))}
          </ul>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  #
                  {' '}
                  {currentChannel?.name}
                </b>
              </p>
              <span className="text-muted">{t('chat.message', { count: messagesCount })}</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
              {currentMessages.map(({ author, text, id }) => (
                <div key={id} className="text-break mb-2">
                  <b>{author}</b>
                  :
                  {' '}
                  {filter.clean(text)}
                </div>
              ))}
            </div>
            <NewMessage channelId={currentChannel?.id} />
          </div>
        </Col>
      </Row>
      {modalShow && (
        <ModalComponent
          onHide={() => setModalShow(false)}
          currentChannel={currentModalEvent.channel}
        />
      )}
    </Container>
  );
};

export default Chat;
