import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions, fetchContent } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, action) => {
        const { id } = action.payload;
        const restEntities = Object.values(state.entities).filter((e) => e.channelId !== id);
        messagesAdapter.setAll(state, restEntities);
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.setAll(state, messages);
      });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const getMessages = (state) => selectors.selectAll(state);
