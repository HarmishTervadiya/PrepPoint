import {createAsyncThunk, createSlice, nanoid} from '@reduxjs/toolkit';
import api from '@/api/index';
import {LoginForm} from '@/types/auth';
import axios from 'axios';
const initialState = {
  user: {id: '', email: '', profilePic: ''},
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
      // const response = await axios.get('http://192.168.67.108:3000/api/v1/student')
      return response.data.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const html = error.response.data;
        const match = html.match(/<pre>(.*?)<\/pre>/s); // Extract text inside <pre>

        if (match) {
          let errorMessage = match[1]
            .replace(/<br\s*\/?>/g, '\n') // Replace <br> with new line
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .trim();

          // Extract only the first sentence (before any "at ..." part)
          errorMessage = errorMessage.split('\n')[0].replace('Error: ', '');

          return thunkAPI.rejectWithValue(errorMessage);
        }
      }
      return thunkAPI.rejectWithValue('Something went wrong');
    }
  },
);

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
      state.user = {
        id: action.payload._id,
        email: action.payload.email,
        profilePic: action.payload.profilePic,
      };
      state.isLoggedIn = true;
      console.log(action.payload, 'success');
    });
    builder.addCase(authenticateUser.rejected, (state, action) => {
      state.user = {id: '', email: '', profilePic: ''};
      state.isLoggedIn = false;
      console.log(action.payload, 'error');
    });
  },
});

export {authenticateUser};
// export const { loginUser, logoutUser } = authSlice.actions
export default authSlice.reducer;
