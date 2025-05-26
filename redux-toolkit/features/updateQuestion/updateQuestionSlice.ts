import api from '@/api';
import {Attachment} from '@/types/auth';
import {QuestionState, QuestionForm} from '@/types/question';
import {apiErrorMessageHandler} from '@/utils/apiMessageHandler';
import {createAsyncThunk, createSlice, nanoid} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

// Extended interface for update
export interface UpdateQuestionForm extends QuestionForm {
  id: string;
  attachments: (Attachment & { isDeleted?: boolean })[] | null;
}

const initialState: QuestionState = {
  title: '',
  subject: '',
  marks: 0,
  attachments: [],
  content: '',
  loading: false,
  error: '',
};

// Helper function to check if URI is local
const isLocalUri = (uri: string): boolean => {
  return uri.startsWith('file://') || 
         uri.startsWith('content://') || 
         !uri.startsWith('http');
};


const updateQuestionDetails = createAsyncThunk(
    '/question/updateQuestionDetails',
    async (data: UpdateQuestionForm, thunkAPI) => {
      try {
        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('title', data.title);
        formData.append('subjectId', data.subject);
        formData.append('marks', data.marks.toString());
        formData.append('content', data.answer);
  
        // Prepare current attachments (excluding deleted ones)
        const currentAttachments = (data.attachments || [])
          .filter(att => !att.isDeleted)
          .map(att => ({
            uri: att.uri,
            type: att.type,
          }));
  
        // Send current attachments info to backend
        formData.append('currentAttachments', JSON.stringify(currentAttachments));
  
        // Only append local files for upload
        const localFiles = currentAttachments.filter(att => isLocalUri(att.uri));
        
        localFiles.forEach((file, index) => {
          formData.append("attachments", {
            uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
            type: file.type,
            name: `attachment_${nanoid(5)}.${file.type.split("/")[1]}`,
          });
        });
  
        const response = await api.patch('/question/updateQuestionDetails', formData, {
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
  
  
// Get question details for editing
const getQuestionForEdit = createAsyncThunk(
  '/question/getQuestionForEdit',
  async (questionId: string, thunkAPI) => {
    try {
      const response = await api.get(`/question/getQuestionDetails/${questionId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(apiErrorMessageHandler(error));
    }
  },
);

const updateQuestionSlice = createSlice({
  initialState,
  name: 'updateQuestion',
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
    resetForm: (state) => {
      state.title = '';
      state.subject = '';
      state.marks = 0;
      state.attachments = [];
      state.content = '';
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    // Update Question reducers
    builder
      .addCase(updateQuestionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
      })
      .addCase(updateQuestionDetails.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(updateQuestionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Question for Edit reducers
    builder
      .addCase(getQuestionForEdit.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        const question = action.payload;

        state.title = question.title;
        state.content = question.content;
        state.subject = question.subjectId._id;
        state.marks = question.marks;
        state.attachments = question.attachments?.map((att:any) => ({
          uri: att.url,
          type: att.mimeType,
          size: 0, // Size not available from cloud URLs
        })) || [];
      })
      .addCase(getQuestionForEdit.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(getQuestionForEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetForm } = updateQuestionSlice.actions;
export { updateQuestionDetails, getQuestionForEdit };
export default updateQuestionSlice.reducer;