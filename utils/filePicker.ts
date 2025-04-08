import {Attachment} from '@/types/auth';
import * as DocumentPicker from 'expo-document-picker';

type DocumentPickerProps = {
  multiple: boolean;
  type?: string[];
};

const pickDocument = async ({multiple, type}: DocumentPickerProps) => {
  const selectedFiles: Attachment[] = [];

  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: type || ['application/pdf', 'image/*'],
      multiple,
    });

    if (result.assets && result.assets.length > 0) {
      return result.assets.map(file => ({
        uri: file.uri,
        type: file.mimeType,
        size: file.size
      }));
    } else if (result.canceled) {
      return null; // User canceled the picker
    }
  } catch (error) {
    console.error('Error picking document:', error);
    throw new Error('Failed to pick document');
  }
};

export default pickDocument;
