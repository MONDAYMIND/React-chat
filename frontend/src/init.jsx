import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import SocketProvider from './contexts/ApiContext.jsx';
import App from './components/App.jsx';
import store from './slices/index.js';
import resources from './locales/index.js';

export default async (socket) => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  const vdom = (
    <StoreProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <SocketProvider socket={socket}>
          <App />
        </SocketProvider>
      </I18nextProvider>
    </StoreProvider>
  );

  return vdom;
};
