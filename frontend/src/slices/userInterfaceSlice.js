/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const uiAdapter = createEntityAdapter();
const initialState = uiAdapter.getInitialState({
  currentChannelId: 1,
  currentModalType: null,
  channelForModal: null,
});

const userInterfaceSlice = createSlice({
  name: 'userInterface',
  initialState,
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    setCurrentModal: (state, action) => {
      const { type, channel } = action.payload;
      state.currentModalType = type;
      state.channelForModal = channel;
    },
    hideModal: (state) => {
      state.currentModalType = null;
      state.channelForModal = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      if (action.payload === state.currentChannelId) {
        state.currentChannelId = 1;
      }
    });
  },
});

export const actions = userInterfaceSlice.actions;
export default userInterfaceSlice.reducer;
export const getCurrentChannelId = (state) => state.userInterface.currentChannelId;
export const getCurrentModalType = (state) => state.userInterface.currentModalType;
export const getChannelForModal = (state) => state.userInterface.channelForModal;
