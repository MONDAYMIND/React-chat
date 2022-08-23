import React from 'react';
import { useDispatch } from 'react-redux';
import { ApiContext } from './index.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

const ApiProvider = ({ children, socket }) => {
  const dispatch = useDispatch();

  const addNewChannel = (channel) => socket.emit('newChannel', channel, (response) => {
    const { status, data } = response;
    if (status === 'ok') {
      dispatch(channelsActions.switchCurrentChannelId(data.id));
    } else {
      console.log(response.status);
    }
  });

  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addChannel(channel));
  });

  const renameChannel = (channel) => socket.emit('renameChannel', channel, (response) => {
    const { status } = response;
    if (status !== 'ok') {
      console.log(status);
    }
  });

  socket.on('renameChannel', (channel) => {
    dispatch(channelsActions.updateChannel({
      id: channel.id,
      changes: {
        name: { ...channel },
      },
    }));
  });

  const removeChannel = (channel) => socket.emit('removeChannel', { id: channel.id }, (response) => {
    const { status } = response;
    if (status !== 'ok') {
      console.log(status);
    }
  });

  socket.on('removeChannel', (channel) => {
    dispatch(channelsActions.removeChannel(channel.id));
  });

  const addNewMessage = (message) => socket.emit('newMessage', message, (response) => {
    console.log(message);
    const { status } = response;
    if (status !== 'ok') {
      console.log(status);
    }
  });

  socket.on('newMessage', (message) => {
    dispatch(messagesActions.addMessage(message));
  });

  return (
    <ApiContext.Provider value={{
      addNewChannel, renameChannel, removeChannel, addNewMessage,
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
