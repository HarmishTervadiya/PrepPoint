import api from '@/api';
import {Attachment} from '@/types/auth';
import {QuestionForm, QuestionListState} from '@/types/question';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid, Slice} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

const intialState: QuestionListState = {
  questions: [],
  loading: false,
  error: '',
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

const questionSlice = createSlice({
  initialState: intialState,
  name: 'question',
  reducers: {},
  extraReducers: builer => {
    // getAllQuestions reducers
    builer
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
        state.loading = false;
      })
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export {getAllQuestions};
export const {} = questionSlice.actions;
export default questionSlice.reducer;
