import api from '@/api';
import { Attachment } from '@/types/auth';
import { Analytics } from '@/types/question';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState: Analytics = {
  totalReads: 0,
  totalQuestions: 0,
  totalEarnings: 0,
  availableBalance: 0,
  recentActivity: [],
  withdrawalHistory: [],
  error: ''
};

const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (id: string, thunkAPI) => {
    try {
      const [analytics, recentActivity, withdrawalHistory] = await Promise.all([
        api.get(`/student/analytics/${id}`),
        api.get(`/question/getRecentActivity/${id}`),
        api.get(`/withdraw/requests/${id}`),
      ]);

      return {
        analytics: analytics.data,
        recentActivity: recentActivity.data,
        withdrawalHistory: withdrawalHistory.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAnalytics.fulfilled, (state, action) => {
      state.totalReads = action.payload.analytics.totalReads;
      state.totalQuestions = action.payload.analytics.totalQuestions;
      state.totalEarnings = action.payload.analytics.totalEarnings;
      state.availableBalance = action.payload.analytics.availableBalance;
      state.withdrawalHistory = action.payload.withdrawalHistory;
      state.recentActivity = action.payload.recentActivity.map((question: any) => ({
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
    });


    builder.addCase(fetchAnalytics.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export {fetchAnalytics}
export default analyticsSlice.reducer