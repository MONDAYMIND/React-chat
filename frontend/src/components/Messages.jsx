import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

import {
  getChannels,
} from '../slices/channelsSlice.js';
import { getMessages } from '../slices/messagesSlice.js';
import {
  getCurrentChannelId,
} from '../slices/userInterfaceSlice.js';

import NewMessage from './NewMessage.jsx';

const Messages = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef();

  const allChannels = useSelector(getChannels);
  const currentChannelId = useSelector(getCurrentChannelId);
  const currentChannel = allChannels.find((channel) => channel.id === currentChannelId);
  const allMessages = useSelector(getMessages);
  const currentMessages = allMessages.filter((message) => message.channelId === currentChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [currentMessages]);

  return (
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
          <span className="text-muted">{t('chat.message', { count: currentMessages.length })}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {currentMessages.map(({ author, text, id }) => (
            <div key={id} className="text-break mb-2">
              <b>{author}</b>
              :
              {' '}
              {filter.clean(text)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <NewMessage channelId={currentChannel?.id} />
      </div>
    </Col>
  );
};

export default Messages;
