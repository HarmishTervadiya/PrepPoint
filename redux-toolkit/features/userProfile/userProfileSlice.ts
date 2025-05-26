import api from '@/api';
import {Attachment} from '@/types/auth';
import {UserProfileState} from '@/types/user';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

const initialState: UserProfileState = {
  user: {
    _id: '',
    name: '',
    username: '',
    email: '',
    institute: {
      _id: '',
      instituteName: '',
      createAt: '',
      instituteLogo: {
        uri: '',
        type: '',
        size: 0
      }
    },
    course: {
      _id: '',
      courseName: '',
      createAt: '',
    },
    profilePic: {
      uri: '',
      type: '',
      size: 0,
    },
    createdAt: '',
  },
  userQuestions: [],
  loading: false,
  error: null,
  searchResults: [],
};

export const getUserProfileDetails = createAsyncThunk(
  '/student/getUserProfileDetails',
  async (data: string, thunkAPI) => {
    try {
      const userData = await Promise.all([
        api.get(`/student/getUserDetails/${data}`),
        api.get(`/student/student-posts/${data}`),
      ]);

      console.log('User Details', userData);

      return [userData[0].data, userData[1].data];
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  '/student/updateUserProfile',
  async (data: any, thunkAPI) => {
    try {
      const response = await api.patch(
        `/student/updateUserProfile/${data._id}`,
        {name: data.name, username: data.username},
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

export const updateUserProfilePicture = createAsyncThunk(
  '/student/updateProfilePic',
  async (data: any, thunkAPI) => {
    try {
      const formData = new FormData();

      if (data.uri && data.type) {
        formData.append('profilePic', {
          uri:
            Platform.OS === 'ios' ? data.uri.replace('file://', '') : data.uri,
          type: data.type,
          name: `profilePic_${nanoid(5)}.${data.type.split('/')[1]}`, // ensure file has proper extension
        });
      } else {
        thunkAPI.rejectWithValue('Profile picture is required');
      }

      console.log(formData);

      const response = await api.patch(
        `/student/updateProfilePic/${data._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    searchQuestion: (state, action) => {
      state.searchResults = state.userQuestions.filter(question =>
        question.title.includes(action.payload),
      );
    },
    deleteQuestionFromList: (state, action) => {
      state.userQuestions = state.userQuestions.filter(quetion => quetion.id != action.payload)
    } 
  },
  extraReducers: builder => {
    builder
      .addCase(getUserProfileDetails.fulfilled, (state, action) => {
        state.user = action.payload[0];
        state.userQuestions = action.payload[1].map((question: any) => ({
          id: question._id,
          owner: question.owner,
          title: question.title,
          subject: question.subject.subjectName,
          marks: question.marks,
          attachments: question.attachments as Attachment[],
          content: question.content,
          reads: question.reads,
          date: question.createdAt,
        }));
        state.loading = false;
        state.error = null;
      })

      .addCase(getUserProfileDetails.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    });

    builder.addCase(updateUserProfilePicture.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    });
  },
});

export const {searchQuestion, deleteQuestionFromList} = userProfileSlice.actions;
export default userProfileSlice.reducer;
