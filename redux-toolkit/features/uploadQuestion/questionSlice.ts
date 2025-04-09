import api from '@/api';
import {Attachment} from '@/types/auth';
import {Question, QuestionForm} from '@/types/question';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid, Slice} from '@reduxjs/toolkit';

const intialState: Question = {
  title: '',
  subject: '',
  marks: 0,
  attachments: [],
  content: '',
  loading: false,
  error: ''
};

const uploadQuestion = createAsyncThunk(
  '/question/postQuestion',
  async (data: QuestionForm, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      formData.append('marks', data.marks);
      formData.append('contents', data.answer);

      if (data.attachments && data.attachments.length > 0) {
        data.attachments.map((file, index) =>
          formData.append(`attachment${index}`, {
            uri: file.uri,
            type: file.type,
            size: file.size,
            name: `attachment${nanoid(5)}`,
          }),
        );
      }
      const response = await api.post('/question/postQuestion', formData);
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
    // uploadQuestion reducers
    builer
      .addCase(uploadQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(uploadQuestion.pending, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export {uploadQuestion}
export default questionSlice.reducer;
