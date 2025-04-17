import api from '@/api';
import {Attachment} from '@/types/auth';
import {InstituteState} from '@/types/institute';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid, Slice} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

const initialState: InstituteState = {
  institutes: [],
  instituteDetails: null,
  institutesLoading: false,
  institutesError: null,
};

const getAllInstitutes = createAsyncThunk(
  '/institute/getAllInstitutes',
  async (data, thunkAPI) => {
    try {
      const response = await api.get('/institute/getAllInstitutes');
      return response.data;
    } catch (institutesError) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(institutesError));
    }
  },
);

const instituteSlice = createSlice({
  initialState: initialState,
  name: 'institute',
  reducers: {
    clearinstituteDetails: state => {
      state.instituteDetails = null;
      state.institutesError = null;
    },
  },
  extraReducers: builder => {
    // getAllInstitutes reducers
    builder
      .addCase(getAllInstitutes.fulfilled, (state, action) => {
        state.institutesLoading = false;
        state.institutesError = null;
        state.institutes = action.payload;
      })
      .addCase(getAllInstitutes.pending, (state, action) => {
        state.institutesLoading = true;
        state.institutesError = null;
      })
      .addCase(getAllInstitutes.rejected, (state, action) => {
        state.institutesLoading = false;
        state.institutesError = action.payload as string;
      });
  },
});

export {getAllInstitutes};
export const {clearinstituteDetails} = instituteSlice.actions;
export default instituteSlice.reducer;
