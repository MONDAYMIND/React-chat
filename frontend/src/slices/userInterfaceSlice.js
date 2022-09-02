/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const uiAdapter = createEntityAdapter();
const initialState = uiAdapter.getInitialState({ currentChannelId: 1 });

const userInterfaceSlice = createSlice({
  name: 'userInterface',
  initialState,
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
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

export const { setCurrentChannelId } = userInterfaceSlice.actions;
export default userInterfaceSlice.reducer;
export const getCurrentChannelId = (state) => state.userInterface.currentChannelId;
