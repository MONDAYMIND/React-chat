import React from 'react';
import { ApiContext } from './index.js';

const ApiProvider = ({ children, socketApi }) => {
  const {
    addNewChannel,
    renameChannel,
    removeChannel,
    addNewMessage,
  } = socketApi;

  return (
    <ApiContext.Provider value={{
      addNewChannel, renameChannel, removeChannel, addNewMessage,
    }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
