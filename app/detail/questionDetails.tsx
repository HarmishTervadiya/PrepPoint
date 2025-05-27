import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {defaultStyle} from '@/themes/defaultStyles';
import Collapsible from 'react-native-collapsible';
import BackButton from '@/components/BackButton';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import Label from '@/components/text/Label';
import {Typography} from '@/themes/typography';
import {Image} from 'react-native';
import {RichText, useEditorBridge} from '@10play/tentap-editor';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {
  getQuestionDetails,
  increaseReadCount,
} from '@/redux-toolkit/features/content/questionSlice';

import ArrowIcon from '@/assets/images/icons/colored-down-arrow.png';
import Profile from '@/assets/images/icons/user-icon.png';
import {useLocalSearchParams, useRouter} from 'expo-router';
import timeAgoFormatter from '@/utils/dateFormatter';
import {Alert} from 'react-native';

const QuestionDetails = () => {
  const {questionId} = useLocalSearchParams();

  const [IsCollapsed, setIsCollapsed] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const {customColors} = useTheme() as CustomTheme;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    questionDetails,
    detailsLoading: loading,
    detailsError: error,
  } = useAppSelector(state => state.questionContentReducer);

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: false,
    editable: false,
    initialContent: questionDetails?.content || 'Loading content...',
  });
  const hasIncreasedReadCount = useRef(false);
  const readCountTimeout = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    if (questionId) {
      fetchQuestionDetails();
      startTime.current = Date.now();

      readCountTimeout.current = setTimeout(() => {
        if (!hasIncreasedReadCount.current) {
          dispatch(increaseReadCount(questionId as string));
          hasIncreasedReadCount.current = true;
        }
      }, 10000); // 2.5 minutes

      return () => {
        if (readCountTimeout.current) {
          clearTimeout(readCountTimeout.current);
        }
      };
    }
  }, [questionId]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (questionDetails?.content) {
      editor.setContent(questionDetails.content);
    }
  }, [questionDetails]);

  const fetchQuestionDetails = async () => {
    if (questionId) {
      await dispatch(getQuestionDetails(questionId as string));
    }
  };

  const handleOpenPDF = (uri: string, index: number) => {
    // Calculate elapsed time and remaining time
    const elapsedTime = Date.now() - startTime.current;
    const remainingTime = Math.max(0, 10000 - elapsedTime); // 150000ms = 2.5 minutes
    
    // Clear the current timeout since we're navigating away
    if (readCountTimeout.current) {
      clearTimeout(readCountTimeout.current);
      readCountTimeout.current = null;
    }

    router.push({
      pathname: '/detail/fileViewer',
      params: {
        uri: uri,
        title: `Attachment ${index + 1}`,
        questionId: questionId as string,
        remainingTime: remainingTime.toString(),
        hasReadCountIncreased: hasIncreasedReadCount.current.toString(),
      },
    });
  };

  const handleRefresh = () => {
    setRefreshLoading(true);
    fetchQuestionDetails();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={customColors.primary} size={'large'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
          contentContainerStyle={[defaultStyle.container, styles.container]}
          scrollEnabled={false}>
          {/* Header */}
          <View style={[styles.header]}>
            <BackButton />
            <Label
              value={'Question'}
              color={customColors.text}
              textStyle={styles.headerTitle}
            />
          </View>

          {/* Details Container */}
          <View style={styles.detailContainer}>
            {/* Question Title with Toggle */}

            <TouchableOpacity
              onPress={() => setIsCollapsed(!IsCollapsed)}
              activeOpacity={0.7}>
              <View style={[styles.titleContainer]}>
                <Label
                  value={questionDetails?.title || 'Loading'}
                  color={customColors.text}
                  textStyle={Typography.title}
                />

                <Image
                  source={ArrowIcon}
                  style={[
                    styles.arrowIcon,
                    IsCollapsed && styles.arrowIconRotated,
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Collapsible Information */}
            <Collapsible
              collapsed={IsCollapsed}
              style={styles.collapsibleContainer}>
              <View style={defaultStyle.row}>
                <View style={styles.authorContainer}>
                  {questionDetails?.owner?.profilePic.uri ? (
                    <Image
                      source={{uri: questionDetails.owner.profilePic.uri}}
                      style={styles.profilePic}
                    />
                  ) : (
                    <Image source={Profile} style={styles.profilePic} />
                  )}
                  <Text
                    style={[
                      styles.cardText,
                      Typography.cardDetails,
                      {color: customColors.text},
                    ]}>
                    {questionDetails?.owner?.username || ''}
                  </Text>
                  </View>

                  <Text
                    style={[
                      styles.cardText,
                      Typography.cardDetails,
                      {color: customColors.secondaryText},
                    ]}>
                    {questionDetails?.marks
                      ? `${questionDetails.marks} Marks`
                      : ''}
                  </Text>
              </View>

              <View style={styles.metadataContainer}>
                <Text style={styles.subjectBox}>
                  {questionDetails?.subject?.name || ''}
                </Text>

                <Text
                  style={[
                    styles.cardText,
                    Typography.cardDetails,
                    {color: customColors.secondaryText},
                  ]}>
                  {questionDetails?.reads
                    ? `${questionDetails.reads} Reads`
                    : '0 Reads'}
                </Text>

                <Text
                  style={[
                    styles.cardText,
                    Typography.cardDetails,
                    {color: customColors.secondaryText},
                  ]}>
                  {(questionDetails?.createdAt &&
                    timeAgoFormatter(questionDetails.createdAt)) ||
                    ''}
                </Text>
              </View>

              {/* PDF Attachments */}
              {questionDetails?.attachments &&
                questionDetails.attachments.length > 0 && (
                  <View style={styles.attachmentsContainer}>
                    {questionDetails.attachments.map(
                      (attachment: any, index: number) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.pdfButton}
                          onPress={() => {
                            handleOpenPDF(attachment.url, index);
                          }}>
                          <Text style={styles.pdfButtonText}>
                            PDF {index + 1}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                )}
            </Collapsible>

            {/* Question Content */}
            <View style={styles.contentContainer}>
              {loading ? (
                <Text style={styles.loadingText}>
                  Loading question content...
                </Text>
              ) : (
                <>
                  <RichText
                    editor={editor}
                    allowsLinkPreview
                    menuItems={[]}
                    style={styles.richTextEditor}
                    scrollEnabled={true}
                  />
                </>
              )}
            </View>
          </View>

          {/* Advertisement Banner */}
          <View style={styles.adContainer}>
            <Text style={styles.adText}>AD</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default QuestionDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  detailContainer: {
    flex: 1,
    margin: 8,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingBottom: 8,
  },
  arrowIcon: {
    height: 24,
    width: 24,
    transform: [{rotate: '180deg'}],
    padding: 4,
    borderWidth: 0.2,
    borderRadius: 6,
  },
  arrowIconRotated: {
    transform: [{rotate: '0deg'}],
  },
  collapsibleContainer: {
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profilePic: {
    height: 30,
    width: 30,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  subjectBox: {
    backgroundColor: '#E3F0FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: '#1877F2',
    fontWeight: 'bold',
    fontSize: 13,
    flexShrink: 1,
  },
  cardText: {
    fontSize: 13,
    flexShrink: 1,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dadada',
  },
  pdfButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  pdfButtonText: {
    color: '#666',
    fontSize: 14,
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
  },
  richTextEditor: {
    minHeight: 300,
  },
  loadingText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  adContainer: {
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  adText: {
    fontSize: 14,
    color: '#666',
  },
});
