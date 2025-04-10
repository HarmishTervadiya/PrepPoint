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
import {
  Toolbar,
  RichText,
  useEditorBridge,
  ToolbarItems,
} from '@10play/tentap-editor';
import {uploadQuestion} from '@/redux-toolkit/features/uploadQuestion/questionSlice';

const UploadQuestion = () => {
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();
  const {subjects, loading, error} = useAppSelector(
    state => state.subjectReducer,
  );

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: false,
    initialContent: 'Start Writing',
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<QuestionForm>({
    defaultValues: {
      title: '',
      subject: '',
      marks: 1,
      answer: '',
    },
  });

  const fetchSubjects = async () => {
    await dispatch(getAllSubjects());
  };

  useEffect(() => {
    fetchSubjects();
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshLoading(true);
    fetchSubjects();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  };

  const handleAddAttachment = (data: Attachment[]) => {
    let attachmentList = [...attachments];
    data.map(item => attachmentList.push(item));
    if (attachmentList.length > 3) {
      Alert.alert('Error', 'You can upload only 3 files');
      return;
    }
    setAttachments(attachmentList);
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
      content === 'Start Writing'
    ) {
      Alert.alert('Error', 'Please add content to your answer');
      return;
    }

    data.answer = content;
    data.attachments = attachments;
    const response = await dispatch(uploadQuestion(data));

    if (response.meta.requestStatus === 'fulfilled') {
      Alert.alert('Success', 'Question uploaded successfully');
    }else{
      Alert.alert('Error', response.payload);
    }
  };

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
          max: {value: 10, message: 'Miaximum of 10 mark'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInputField
            value={value.toString()}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Enter Marks"
            secureTextEntry={false}
            keyboardType="decimal-pad"
            // style={styles.input}
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
                const files = await pickDocument({multiple: true});
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
          {attachments.map((file, index) => (
            <TouchableOpacity
              onPress={() => {
                setAttachments(
                  attachments.filter((file, fileIndex) => index != fileIndex),
                );
              }}
              key={index}
              style={styles.attachmentBox}>
              <Text style={styles.attachmentText}>File {index + 1}</Text>
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
          // icon="chevron-right"
          // iconPosition="right"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.step2Container}>
      {/* Editor Section */}
      <View style={styles.editorContainer}>
        <RichText
          editor={editor}
          allowsLinkPreview
          menuItems={[]}
          style={styles.richTextEditor}
          scrollEnabled={true}
        />
      </View>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, {backgroundColor: customColors.button}]}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.checkmarkIcon}>✓</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Horizontal Toolbar */}
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
            <Text style={styles.headerTitle}>Upload Question</Text>
          </View>

          {renderStepIndicator()}

          {currentStep === 1 ? renderStep1() : renderStep2()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UploadQuestion;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: '#f9f9f9',
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
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
    // marginBottom: 8,
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
    // backgroundColor: '#7c4dff',
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
  attachmentText: {
    color: '#666',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
  },
  step2Container: {
    flex: 1,
    position: 'relative',
    height: '100%',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ebebeb',
    paddingHorizontal: 10,
    // marginBottom: 70, // Space for the bottom toolbar
  },
  richTextEditor: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  bottomToolbarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  submitButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 95, // Adjusted to position alongside toolbar
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
  },
  err: {
    width: '100%',
    fontSize: 12,
    fontWeight: '400',
    color: 'red',
    // marginLeft: 10,
    // marginTop: -12,
    // marginBottom: 12,
  },
});
