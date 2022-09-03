import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
  getChannels,
} from '../slices/channelsSlice.js';
import {
  actions as userInterfaceActions,
} from '../slices/userInterfaceSlice.js';

import ChannelSelectionButton from './ChannelSelectionButton.jsx';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allChannels = useSelector(getChannels);

  const switchChannel = (e) => {
    dispatch(userInterfaceActions.setCurrentChannelId(Number(e.target.id)));
  };

  return (
    <Col xs={4} md={2} className="border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('chat.channels')}</span>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical border-0"
          onClick={() => dispatch(userInterfaceActions.setCurrentModal({ type: 'add', channel: null }))}
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
            <ChannelSelectionButton
              channel={channel}
              switchChannel={switchChannel}
            />
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default Channels;
