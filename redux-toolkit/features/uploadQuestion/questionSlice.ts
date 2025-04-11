import api from '@/api';
import {Attachment} from '@/types/auth';
import {QuestionState, QuestionForm} from '@/types/question';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid, Slice} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

const intialState: QuestionState = {
  title: '',
  subject: '',
  marks: 0,
  attachments: [],
  content: '',
  loading: false,
  error: '',
};

const uploadQuestion = createAsyncThunk(
  '/question/postQuestion',
  async (data: QuestionForm, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subjectId', data.subject);
      formData.append('marks', data.marks.toString());
      formData.append('content', data.answer);

      if (data.attachments && data.attachments.length > 0) {
        data.attachments.forEach((file) =>
          formData.append("attachments", {
            uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
            type: file.type,
            name: `attachment_${nanoid(5)}.${file.type.split("/")[1]}`, // ensure file has proper extension
          })
        );
      }

      const response = await api.post('/question/postQuestion', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
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

export {uploadQuestion};
export default questionSlice.reducer;
