import api from '@/api';
import {Attachment} from '@/types/auth';
import {QuestionForm, QuestionListState} from '@/types/question';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid, Slice} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

// Extended state interface to include questionDetails
interface ExtendedQuestionState extends QuestionListState {
  questionDetails: any;
  detailsLoading: boolean;
  detailsError: string | null;
}

const initialState: ExtendedQuestionState = {
  questions: [],
  loading: false,
  error: '',
  questionDetails: null,
  detailsLoading: false,
  detailsError: null,
};

const getAllQuestions = createAsyncThunk(
  '/question/getAllQuestions',
  async (data, thunkAPI) => {
    try {
      const response = await api.get('/question/getAllQuestions');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

// New thunk for getting question details
const getQuestionDetails = createAsyncThunk(
  '/question/getQuestionDetails',
  async (questionId: string, thunkAPI) => {
    try {
      const response = await api.get(`/question/getQuestionDetails/${questionId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

const questionSlice = createSlice({
  initialState: initialState,
  name: 'question',
  reducers: {
    clearQuestionDetails: (state) => {
      state.questionDetails = null;
      state.detailsError = null;
    },
  },
  extraReducers: builder => {
    // getAllQuestions reducers
    builder
      .addCase(getAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.questions = action.payload.map((question: any) => ({
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
      })
      .addCase(getAllQuestions.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // getQuestionDetails reducers
      .addCase(getQuestionDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getQuestionDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.questionDetails = {
          id: action.payload._id,
          title: action.payload.title,
          owner: action.payload.owner,
          subject: {
            id: action.payload.subject._id,
            name: action.payload.subject.subjectName,
          },
          marks: action.payload.marks,
          content: action.payload.content,
          attachments: action.payload.attachments,
          reads: action.payload.reads,
          createdAt: action.payload.createdAt,
        };
      })
      .addCase(getQuestionDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string;
      });
  },
});

export {getAllQuestions, getQuestionDetails};
export const {clearQuestionDetails} = questionSlice.actions;
export default questionSlice.reducer;