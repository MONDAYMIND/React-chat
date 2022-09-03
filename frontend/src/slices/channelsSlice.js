/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import routes from '../routes.js';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({ error: null, status: null });

export const fetchContent = createAsyncThunk(
  'fetchContent',
  async (heared) => {
    const { data } = await axios.get(routes.dataPath(), { headers: heared });
    return data;
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    updateChannel: channelsAdapter.updateOne,
    removeChannel: channelsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.fulfilled, (state, action) => {
        const { channels } = action.payload;
        channelsAdapter.setAll(state, channels);
        state.fetchingError = null;
        state.status = 'fulfilled';
      })
      .addCase(fetchContent.rejected, (state, action) => {
        console.log(action.error);
        state.fetchingError = action.error;
        state.status = 'rejected';
      });
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const getChannels = (state) => selectors.selectAll(state);
export const fetchingError = (state) => state.channels.fetchingError;
export const fetchingStatus = (state) => state.channels.status;
