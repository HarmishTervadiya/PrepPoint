import api from '@/api';
import {Attachment} from '@/types/auth';
import {CourseState} from '@/types/course';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid, Slice} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

const initialState: CourseState = {
  courses: [],
  courseDetails: null,
  coursesLoading: false,
  coursesError: null,
};

const getAllCourses = createAsyncThunk(
  '/course/getAllCourses',
  async (data, thunkAPI) => {
    try {
      const response = await api.get('/course/getAllCourses');
      return response.data;
    } catch (coursesError) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(coursesError));
    }
  },
);

const courseSlice = createSlice({
  initialState: initialState,
  name: 'course',
  reducers: {
    clearcourseDetails: state => {
      state.courseDetails = null;
      state.coursesError = null;
    },
  },
  extraReducers: builder => {
    // getAllCourses reducers
    builder
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.coursesLoading = false;
        state.coursesError = null;
        state.courses = action.payload;
      })
      .addCase(getAllCourses.pending, (state, action) => {
        state.coursesLoading = true;
        state.coursesError = null;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.coursesLoading = false;
        state.coursesError = action.payload as string;
      });
  },
});

export {getAllCourses};
export const {clearcourseDetails} = courseSlice.actions;
export default courseSlice.reducer;
