import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '@/api/index';
import {LoginForm, RegisterForm} from '@/types/auth';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {clearAuthData, saveAuthData} from '@/utils/authStorage';

// Define the auth state interface
interface AuthState {
  user: {
    id: string;
    email: string;
    profilePic: {
      url: string;
      publicId: string;
    };
  };
  isLoggedIn: boolean;
  forgotPassword: {
    studentId: string;
    otpSent: boolean;
    otpVerified: boolean;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AuthState = {
  user: {id: '', email: '', profilePic: {url: '', publicId: ''}},
  isLoggedIn: false,
  forgotPassword: {
    studentId: '',
    otpSent: false,
    otpVerified: false,
    loading: false,
    error: null,
  },
};

// Generate OTP for password reset
const generateOtp = createAsyncThunk(
  'auth/generateOtp',
  async (email: string, thunkAPI) => {
    try {
      const response = await api.post('/student/generateOtp', {email});
      return response.data;
    } catch (error) {
      const errorMessage = apiErrorMessageHandler(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Verify OTP
const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: {studentId: string; otp: string}, thunkAPI) => {
    try {
      const response = await api.post('/student/verifyOtp', {
        studentId: data.studentId,
        otp: data.otp,
      });
      return response.data;
    } catch (error) {
      const errorMessage = apiErrorMessageHandler(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Reset password with verified OTP
const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    data: {studentId: string; otp: string; newPassword: string},
    thunkAPI,
  ) => {
    try {
      const response = await api.post('/student/resetPassword', {
        studentId: data.studentId,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      return response.data;
    } catch (error) {
      const errorMessage = apiErrorMessageHandler(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Login user
const authenticateUser = createAsyncThunk(
  'auth/login',
  async (data: LoginForm, thunkAPI) => {
    try {
      const response = await api.post('/student/login/', {
        email: data.email,
        password: data.password,
      });
      return response.data;
    } catch (error) {
      const errorMessage = apiErrorMessageHandler(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Signup user
const signupUser = createAsyncThunk(
  'auth/signup',
  async (data: RegisterForm, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);

      const response = await api.post('/student/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage = apiErrorMessageHandler(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Get user details
const getUserDetails = createAsyncThunk(
  'auth/getUserDetails',
  async (userId: string, thunkAPI) => {
    try {
      const response = await api.get(`/student/getUserDetails/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = apiErrorMessageHandler(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, thunkAPI) => {
    try {
    } catch (error) {
      console.log(error);
      const errorMessage = apiErrorMessageHandler(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

const clearUserData = createAsyncThunk(
  '/student/logout/',
  async (_, thunkAPI) => {
    try {
      await clearAuthData();
      return true;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetForgotPasswordState: state => {
      state.forgotPassword = {
        studentId: '',
        otpSent: false,
        otpVerified: false,
        loading: false,
        error: null,
      };
    },
    logoutUser: state => {
      state.user = {id: '', email: '', profilePic: {url: '', publicId: ''}};
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    // Authentication reducers
    builder
      .addCase(authenticateUser.pending, state => {
        state.isLoggedIn = false;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        const user = action.payload.user;
        state.user = {
          id: user._id,
          email: user.email,
          profilePic: user.profilePic,
        };
        state.isLoggedIn = true;
        saveAuthData(
          user._id,
          action.payload.accessToken,
          action.payload.refreshToken,
        );
      })
      .addCase(authenticateUser.rejected, state => {
        state.user = {id: '', email: '', profilePic: {url: '', publicId: ''}};
        state.isLoggedIn = false;
      });

    // Signup reducers
    builder
      .addCase(signupUser.pending, state => {
        state.isLoggedIn = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = {
          id: action.payload._id,
          email: action.payload.email,
          profilePic: action.payload.profilePic,
        };
        state.isLoggedIn = true;
      })
      .addCase(signupUser.rejected, state => {
        state.user = {id: '', email: '', profilePic: {url: '', publicId: ''}};
        state.isLoggedIn = false;
      });

    // Get user details reducers
    builder
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.user = {
          id: action.payload._id,
          email: action.payload.email,
          profilePic: action.payload.profilePic,
        };
        state.isLoggedIn = true;
      })
      .addCase(getUserDetails.rejected, state => {
        state.user = {id: '', email: '', profilePic: {url: '', publicId: ''}};
        state.isLoggedIn = false;
      });

    // OTP generation reducers
    builder
      .addCase(generateOtp.pending, state => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = null;
      })
      .addCase(generateOtp.fulfilled, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.studentId = action.payload.studentId;
        state.forgotPassword.otpSent = true;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.otpSent = false;
        console.log(action.payload)
        state.forgotPassword.error = action.payload as string;
      });

    // OTP verification reducers
    builder
      .addCase(verifyOtp.pending, state => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = null;
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.forgotPassword.loading = false;
        state.forgotPassword.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.otpVerified = false;
        state.forgotPassword.error = action.payload as string;
      });

    // Reset password reducers
    builder
      .addCase(resetPassword.pending, state => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.forgotPassword = {
          studentId: '',
          otpSent: false,
          otpVerified: false,
          loading: false,
          error: null,
        };
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.error = action.payload as string;
      });

    // Change password reducers
    builder.addCase(changePassword.fulfilled, (state, action) => {});

    builder.addCase(clearUserData.fulfilled, (state, action) => {
      state.user = {id: '', email: '', profilePic: {url: '', publicId: ''}};
      state.isLoggedIn = false;
    });

    builder.addCase(clearUserData.rejected, (state, action) => {
      console.log(action.payload);
    });
  },
});

export {
  authenticateUser,
  signupUser,
  getUserDetails,
  generateOtp,
  verifyOtp,
  resetPassword,
  changePassword,
  clearUserData
};
export const {resetForgotPasswordState, logoutUser} = authSlice.actions;
export default authSlice.reducer;
