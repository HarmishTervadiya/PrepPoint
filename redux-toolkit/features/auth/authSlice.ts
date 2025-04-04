import {createAsyncThunk, createSlice, nanoid} from '@reduxjs/toolkit';
import api from '@/api/index';
import {LoginForm, RegisterForm} from '@/types/auth';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import { saveAuthData } from '@/utils/authStorage';
const initialState = {
  user: {id: '', email: '', profilePic: {url: '', publicId: ''}},
  isLoggedIn: false,
};

const authenticateUser = createAsyncThunk(
  '/student/login',
  async (data: LoginForm, thunkAPI) => {
    try {
      const response = await api.post('/student/login/', {
        email: data.email,
        password: data.password,
      });

      return response.data;
    } catch (error: any) {
          const errorMessage = apiErrorMessageHandler(error);
          return thunkAPI.rejectWithValue(errorMessage);
   }
  },
);

const signupUser = createAsyncThunk('/student/signup', async (data: RegisterForm, thunkAPI)=> {
  try {

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    // formData.append('instituteId', data.institute);
    // formData.append('courseId', data.course);

    const response = await api.post('/student/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  
    response.data.password = data.password 
    return response.data;
  } catch (error: any) {
    const errorMessage = apiErrorMessageHandler(error);
    return thunkAPI.rejectWithValue(errorMessage);    
  }
})

const getUserDetails = createAsyncThunk('/student/getUserDetails', async (userId: string, thunkAPI)=> {
  try {
    const response = await api.get(`/student/getUserDetails/${userId}`)
    return response.data
  } catch (error: any) {
    const errorMessage = apiErrorMessageHandler(error)
    return thunkAPI.rejectWithValue(errorMessage)
  }
})

const generateOtp = createAsyncThunk('/student/generateOtp/', async (email: string, thunkAPI) => {
  try {
    const response = await api.post('/student/generateOtp', {email})
    return response.data
  } catch (error) {
    console.error(error)
    return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
  }
})


const verifyOtp = createAsyncThunk('/student/verifyOtp/', async (data: {studentId: string, otp: string}, thunkAPI) => {
  try {
    const response = await api.post('/student/verifyOtp', {studentId: data.studentId, otp: data.otp})
    return response.data
  } catch (error: any) {
    console.error(error)
    return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // loginUser: (state, action) => {
    //     const { email, password } = action.payload
    //     state.user.email = email
    //     state.isLoggedIn = true
    // },
    // logoutUser: (state, action) => {
    //     state.user = { id: '', email: '', profilePic: ''}
    //     state.isLoggedIn = false
    // }
  },
  extraReducers: builder => {
    builder.addCase(authenticateUser.fulfilled, (state, action) => {
      const user = action.payload.user
      state.user = {
        id: user._id,
        email: user.email,
        profilePic: user.profilePic,
      };
      state.isLoggedIn = true;

      saveAuthData(user._id, action.payload.accessToken, action.payload.refreshToken)
    });
    builder.addCase(authenticateUser.rejected, (state, action) => {
      state.user = {id: '', email: '', profilePic: {url:'', publicId: ''}};
      state.isLoggedIn = false;
    });


    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.user = {
        id: action.payload._id,
        email: action.payload.email,
        profilePic: action.payload.profilePic,
      };
      state.isLoggedIn = true;

      console.log(action.payload)
    })
    builder.addCase(signupUser.rejected, (state, action) => {
      state.user = {id: '', email: '', profilePic: {url:'', publicId: ''}};
      state.isLoggedIn = false;
      // console.log(action.payload, 'error');
    })

    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.user = {id: action.payload._id, email: action.payload.email, profilePic: action.payload.profilePic}
      state.isLoggedIn = true
    })

    
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.user = {id: '', email: '', profilePic: {url:'', publicId: ''}};
      state.isLoggedIn = false;
      // console.log(action.payload, 'error');
    })

  },
});

export {authenticateUser, signupUser, getUserDetails, generateOtp, verifyOtp};
// export const { loginUser, logoutUser } = authSlice.actions
export default authSlice.reducer;
