import store from './slices/index.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as userInterfaceActions } from './slices/userInterfaceSlice.js';

const initSocketApi = (socket) => {
  const addNewChannel = (channel) => socket.emit('newChannel', channel, (response) => {
    const { status, data } = response;
    if (status === 'ok') {
      store.dispatch(userInterfaceActions.setCurrentChannelId(data.id));
    } else {
      console.log(response.status);
    }
  });

  socket.on('newChannel', (channel) => {
    store.dispatch(channelsActions.addChannel(channel));
  });

  const renameChannel = (channel) => socket.emit('renameChannel', channel, (response) => {
    const { status } = response;
    if (status !== 'ok') {
      console.log(status);
    }
  });

  socket.on('renameChannel', (channel) => {
    store.dispatch(channelsActions.updateChannel({
      id: channel.id,
      changes: { ...channel },
    }));
  });

  const removeChannel = (channel) => socket.emit('removeChannel', { id: channel.id }, (response) => {
    const { status } = response;
    if (status !== 'ok') {
      console.log(status);
    }
  });

  socket.on('removeChannel', (channel) => {
    store.dispatch(channelsActions.removeChannel(channel.id));
  });

  const addNewMessage = (message) => socket.emit('newMessage', message, (response) => {
    const { status } = response;
    if (status !== 'ok') {
      console.log(status);
    }
  });

  socket.on('newMessage', (message) => {
    store.dispatch(messagesActions.addMessage(message));
  });

  return {
    addNewChannel,
    renameChannel,
    removeChannel,
    addNewMessage,
  };
};

export default initSocketApi;
