import api from '@/api';
import {Contributor, ContributorListState} from '@/types/user';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState: ContributorListState = {
  contributors: [],
};

const getTopContributors = createAsyncThunk(
  'getTopContributors',
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/student/getTopContributors/`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

const contributorSlice = createSlice({
  initialState,
  name: 'contributor',
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTopContributors.fulfilled, (state, action) => {
        state.contributors = action.payload
    })
    .addCase(getTopContributors.rejected, (state, action) => {
        state.contributors = []
    })
  },
});

export {getTopContributors}
export default contributorSlice.reducer