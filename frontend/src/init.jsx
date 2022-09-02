import React from 'react';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider as StoreProvider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';

import ApiProvider from './contexts/ApiContext.jsx';
import initSocketApi from './socketApi.js';
import App from './components/App.jsx';
import store from './slices/index.js';
import resources from './locales/index.js';

const init = async (socket) => {
  const api = initSocketApi(socket);

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.NODE_ENV,
    },
  };

  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  filter.add(filter.getDictionary('ru'));

  const vdom = (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <StoreProvider store={store}>
          <ApiProvider socketApi={api}>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </ApiProvider>
        </StoreProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );

  return vdom;
};

export default init;
