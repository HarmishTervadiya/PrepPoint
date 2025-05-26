import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import {useForm, Controller} from 'react-hook-form';
import {defaultStyle} from '@/themes/defaultStyles';
import Label from '@/components/text/Label';
import TextInputField from '@/components/input/TextInputField';
import SubmitButton from '@/components/SubmitButton';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {Attachment} from '@/types/auth';
import pickDocument from '@/utils/filePicker';
import {QuestionForm} from '@/types/question';
import DropdownField from '@/components/input/DropdownField';
import {getAllSubjects} from '@/redux-toolkit/features/uploadQuestion/subjectSlice';
import {Toolbar, RichText, useEditorBridge} from '@10play/tentap-editor';
import {
  updateQuestionDetails,
  getQuestionForEdit,
} from '@/redux-toolkit/features/updateQuestion/updateQuestionSlice';
import {useLocalSearchParams, useRouter} from 'expo-router';
import { Image } from 'react-native';
import BackArrow from '@/assets/images/icons/back-arrow.png';


interface ExtendedAttachment extends Attachment {
  isDeleted?: boolean;
}

const UpdateQuestion = () => {
  const {questionId} = useLocalSearchParams();
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {subjects, loading: subjectsLoading} = useAppSelector(
    state => state.subjectReducer,
  );

  const {content, loading, error} = useAppSelector(
    state => state.updateQuestionReducer,
  );

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<ExtendedAttachment[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
    reset,
  } = useForm<QuestionForm>({
    defaultValues: {
      title: '',
      subject: '',
      marks: 1,
      answer: '',
    },
  });

  useEffect(() => {
    if (questionId && !isInitialized) {
      loadQuestionDetails();
    }
  }, [questionId, isInitialized]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      // dispatch(clearError());
    }
  }, [error]);

  // Load subjects
  useEffect(() => {
    fetchSubjects();
  }, [dispatch]);

  // Handle Android hardware back button
  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [currentStep]); // Re-run when currentStep changes

  const loadQuestionDetails = async () => {
    try {
      const result = await dispatch(getQuestionForEdit(questionId as string));
      if (result.meta.requestStatus === 'fulfilled') {
        const question = result.payload;

        // Convert marks to number
        const marksValue =
          typeof question.marks === 'string'
            ? parseInt(question.marks)
            : question.marks;

        reset({
          title: question.title,
          subject: question.subject._id,
          marks: marksValue,
        });

        // Set editor content
        editor.setContent(question.content);

        // Set attachments
        const questionAttachments =
          question.attachments?.map((att: any) => ({
            uri: att.url,
            type: att.mimeType,
            size: 0,
            isDeleted: false,
          })) || [];

        setAttachments(questionAttachments);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error loading question:', error);
      Alert.alert('Error', 'Failed to load question details');
    }
  };

  const fetchSubjects = async () => {
    await dispatch(getAllSubjects());
  };

  const handleRefresh = () => {
    setRefreshLoading(true);
    fetchSubjects();
    if (questionId) {
      loadQuestionDetails();
    }
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  };

  // Custom back button handler
  const handleBackPress = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.back();
    }
  };

  // Check if URI is local
  const isLocalUri = (uri: string): boolean => {
    return (
      uri.startsWith('file://') ||
      uri.startsWith('content://') ||
      !uri.startsWith('http')
    );
  };

  const handleAddAttachment = (data: Attachment[]) => {
    const currentActiveAttachments = attachments.filter(att => !att.isDeleted);
    const totalCount = currentActiveAttachments.length + data.length;

    if (totalCount > 3) {
      Alert.alert('Error', 'You can upload only 3 files');
      return;
    }

    const newAttachments = data.map(file => ({
      ...file,
      isDeleted: false,
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleDeleteAttachment = (index: number) => {
    Alert.alert(
      'Delete Attachment',
      'Are you sure you want to delete this attachment?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAttachments(prev =>
              prev.map((att, i) =>
                i === index ? {...att, isDeleted: true} : att,
              ),
            );
          },
        },
      ],
    );
  };

  const nextStep = (data: Partial<QuestionForm>) => {
    console.log('Step 1 Data:', data);
    setCurrentStep(2);
  };

  const previousStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = async (data: QuestionForm) => {
    const content = await editor.getHTML();
    if (
      !content ||
      content === '<p>Start Writing</p>' ||
      content === 'Start Writing' ||
      content === '<p>Loading content...</p>'
    ) {
      Alert.alert('Error', 'Please add content to your answer');
      return;
    }

    // Filter out deleted attachments
    const activeAttachments = attachments.filter(att => !att.isDeleted);

    data.answer = content;
    data.attachments = activeAttachments;

    const updateData = {
      ...data,
      id: questionId as string,
    };

    const response = await dispatch(updateQuestionDetails(updateData));

    if (response.meta.requestStatus === 'fulfilled') {
      Alert.alert('Success', 'Question updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } else {
      Alert.alert('Error', response.payload || 'Failed to update question');
    }
  };

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: false,
    initialContent: content || 'Loading content...',
  });

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorWrapper}>
      <View style={styles.stepIndicatorContainer}>
        <TouchableOpacity
          onPress={() => setCurrentStep(1)}
          style={[
            styles.stepIndicator,
            {
              backgroundColor:
                currentStep >= 1
                  ? customColors.button
                  : customColors.secondaryBtn,
              borderWidth: currentStep >= 1 ? 0 : 1,
              borderColor: '#d0d0d0',
            },
          ]}>
          <Text
            style={{
              color:
                currentStep >= 1
                  ? customColors.btnText
                  : customColors.secondaryBtnText,
            }}>
            1
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Basic Details</Text>
      </View>

      <View style={styles.connectorLine} />

      <View style={styles.stepIndicatorContainer}>
        <TouchableOpacity
          onPress={() => currentStep === 2 && setCurrentStep(2)}
          style={[
            styles.stepIndicator,
            {
              backgroundColor:
                currentStep === 2
                  ? customColors.button
                  : customColors.secondaryBtn,
              borderWidth: currentStep === 2 ? 0 : 1,
              borderColor: '#d0d0d0',
            },
          ]}>
          <Text
            style={{
              color:
                currentStep === 2
                  ? customColors.btnText
                  : customColors.secondaryBtnText,
            }}>
            2
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Contents</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.form}>
      <View
        style={[
          defaultStyle.row,
          {
            width: '90%',
            justifyContent: 'flex-start',
            gap: 5,
            alignItems: 'center',
          },
        ]}>
        <Label
          value="Question Title"
          color="#333"
          textStyle={styles.fieldLabel}
        />
        {errors.title && <Text style={styles.err}>{errors.title.message}</Text>}
      </View>

      <Controller
        control={control}
        name="title"
        rules={{
          required: {value: true, message: 'Title is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInputField
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Enter Title"
            secureTextEntry={false}
          />
        )}
      />

      <View style={[defaultStyle.row, {gap: 10, alignItems: 'center'}]}>
        <Label value="Subject" color="#333" textStyle={styles.fieldLabel} />
        {errors.subject && (
          <Text style={styles.err}>{errors.subject.message}</Text>
        )}
      </View>
      <Controller
        control={control}
        name="subject"
        rules={{
          required: {value: true, message: 'Subject is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <DropdownField
            options={subjects.map(subject => ({
              label: subject.name,
              value: subject._id,
            }))}
            onSelect={selectedValue => {
              onChange(selectedValue);
            }}
            placeholder="Select Subject"
            value={value}
          />
        )}
      />

      <View
        style={[
          defaultStyle.row,
          {
            width: '90%',
            justifyContent: 'flex-start',
            gap: 5,
            alignItems: 'center',
          },
        ]}>
        <Label value="Marks" color="#333" textStyle={styles.fieldLabel} />
        {errors.marks && <Text style={styles.err}>{errors.marks.message}</Text>}
      </View>

      <Controller
        control={control}
        name="marks"
        rules={{
          required: {value: true, message: 'Marks are required'},
          min: {value: 1, message: 'Minimum of 1 mark'},
          max: {value: 10, message: 'Maximum of 10 marks'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInputField
            value={value.toString()}
            onChangeText={text => onChange(parseInt(text) || '')}
            onBlur={onBlur}
            placeholder="Enter Marks"
            secureTextEntry={false}
            keyboardType="decimal-pad"
          />
        )}
      />

      <View style={styles.attachmentsSection}>
        <View style={styles.attachmentHeaderRow}>
          <Label
            value="Attachments"
            color="#333"
            textStyle={styles.fieldLabel}
          />
          <TouchableOpacity
            style={[styles.addButton, {backgroundColor: customColors.primary}]}
            onPress={async () => {
              try {
                const files = await pickDocument({
                  multiple: true,
                  type: ['application/pdf'],
                });
                if (files && files.length > 0) {
                  const fileData = files.map(file => ({
                    uri: file.uri,
                    type: file.type,
                    size: file.size,
                  }));

                  handleAddAttachment(fileData as Attachment[]);
                }
              } catch (err) {
                console.error('Error picking document:', err);
              }
            }}
            activeOpacity={0.9}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.attachmentsRow}>
          {attachments
            .filter(att => !att.isDeleted)
            .map((file, index) => (
              <TouchableOpacity
                onPress={() =>
                  handleDeleteAttachment(
                    attachments.findIndex(att => att.uri === file.uri),
                  )
                }
                key={index}
                style={[
                  styles.attachmentBox,
                  isLocalUri(file.uri) && styles.newAttachmentBox,
                ]}>
                <Text style={styles.attachmentText}>
                  {isLocalUri(file.uri) ? 'New ' : ''}File {index + 1}
                </Text>
                <Text style={styles.deleteHint}>Tap to delete</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <SubmitButton
          text="Proceed"
          textColor="white"
          backgroundColor={customColors.button}
          onPress={handleSubmit(nextStep)}
          width="100%"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.step2Container}>
      <View style={styles.editorContainer}>
        <RichText
          editor={editor}
          allowsLinkPreview
          menuItems={[]}
          style={styles.richTextEditor}
          scrollEnabled={true}
        />
      </View>

      <View style={styles.submitButtonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, {backgroundColor: customColors.button}]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          <Text style={styles.checkmarkIcon}>{loading ? '...' : '✓'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomToolbarContainer}>
        <View style={styles.toolbar}>
          <Toolbar
            editor={editor}
            shouldHideDisabledToolbarItems
            hidden={false}
          />
        </View>
      </View>
    </View>
  );

  if (!isInitialized && loading) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading question details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f9f9f9'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={refreshLoading}
              colors={[customColors.primary]}
            />
          }
          contentContainerStyle={[
            styles.container,
            currentStep === 2 && {flexGrow: 1},
          ]}
          scrollEnabled={currentStep !== 2}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.card, {backgroundColor: customColors.backBtn}]}
              activeOpacity={0.7}
              onPress={handleBackPress}>
              <Image
                source={BackArrow}
                resizeMethod="auto"
                resizeMode="cover"
                style={styles.icon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Update Question</Text>
          </View>

          {renderStepIndicator()}

          {currentStep === 1 ? renderStep1() : renderStep2()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateQuestion;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6',
  },
  headerTitle: {
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  stepIndicatorWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignItems: 'center',
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    gap: 4,
  },
  stepIndicator: {
    height: 34,
    width: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
  },
  connectorLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  form: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#ffffff',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  attachmentsSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  attachmentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  attachmentsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  attachmentBox: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  newAttachmentBox: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  attachmentText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  deleteHint: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
  },
  step2Container: {
    flex: 1,
    position: 'relative',
    height: '100%',
    margin: 16,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ebebeb',
    paddingHorizontal: 10,
    marginBottom: 80, // Space for the bottom toolbar
  },
  richTextEditor: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
    minHeight: 300,
  },
  bottomToolbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  submitButtonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 85, // Adjusted to position alongside toolbar
    zIndex: 10, // Ensure button appears above toolbar
  },
  submitButton: {
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  checkmarkIcon: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  err: {
    width: '100%',
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
  },
  card: {
    padding: 6,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    shadowRadius: 1,
    elevation: 2,
  },
  icon: {
    height: 20,
    width: 20,
  },
});
