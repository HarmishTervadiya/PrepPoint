import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '@/api';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';

// Define the Subject type
interface Subject {
  _id: string;
  name: string;
  instituteCourseId: string;
}

// State for subjects
interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SubjectState = {
  subjects: [],
  loading: false,
  error: null,
};

// Fetch subjects by course ID
export const getSubjectsByCourse = createAsyncThunk(
  'subject/getSubjectsByCourse',
  async (instituteCourseId: string, thunkAPI) => {
    try {
      const response = await api.get(
        `/subject/getByCourse/${instituteCourseId}`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

export const getAllSubjects = createAsyncThunk(
  'subject/getAllSubjects',
  async (data, thunkAPI) => {
    try {
      const response = await api.get(`/subject/getAllSubjects/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

// Create the subject slice
export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    clearSubjects: state => {
      state.subjects = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getSubjectsByCourse.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubjectsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects.map((subject: any) => ({
          name: subject.subjectName,
          _id: subject._id,
          instituteCourseId: subject.instituteCourseId,
        }));
      })
      .addCase(getSubjectsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getAllSubjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects.map((subject: any) => ({
          name: subject.subjectName,
          _id: subject._id,
          instituteCourseId: subject.instituteCourseId,
        }));
      })
      .addCase(getAllSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearSubjects} = subjectSlice.actions;
export default subjectSlice.reducer;
