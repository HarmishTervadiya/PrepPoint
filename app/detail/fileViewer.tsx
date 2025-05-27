import {StyleSheet, View} from 'react-native';
import React, { useEffect, useRef } from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import Label from '@/components/text/Label';
import Pdf from 'react-native-pdf';
import { increaseReadCount } from '@/redux-toolkit/features/content/questionSlice';
import { useAppDispatch } from '@/redux-toolkit/store';
const fileViewer = () => {
  const {uri, title, questionId, remainingTime, hasReadCountIncreased} = useLocalSearchParams();
  
  const dispatch = useAppDispatch();
  const readCountTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasIncreasedReadCountRef = useRef(hasReadCountIncreased === 'true');

  useEffect(() => {
    // Only set up the timeout if the read count hasn't been increased yet
    if (!hasIncreasedReadCountRef.current && remainingTime && parseInt(remainingTime as string) > 0) {
      const timeLeft = parseInt(remainingTime as string);
      
      readCountTimeout.current = setTimeout(() => {
        if (!hasIncreasedReadCountRef.current && questionId) {
          dispatch(increaseReadCount(questionId as string));
          hasIncreasedReadCountRef.current = true;
          console.log('Read count increased from PDF viewer');
        }
      }, timeLeft);
    }

    // Cleanup timeout on unmount
    return () => {
      if (readCountTimeout.current) {
        clearTimeout(readCountTimeout.current);
      }
    };
  }, [questionId, remainingTime, hasReadCountIncreased]);

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Label
          value={title as string}
          textStyle={styles.headerTitle}
          color={'#000'}
        />
      </View>

      <View style={styles.pdfContainer}>
        <Pdf
          source={{uri: uri as string}}
          style={styles.pdf}
          enableAnnotationRendering
          enableDoubleTapZoom
          trustAllCerts={false}
          scrollEnabled
          onLoadComplete={numberOfPages => {
            console.log(`PDF loaded with ${numberOfPages} pages`);
          }}
          onError={error => {
            console.log('PDF Error:', error);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default fileViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    width: '80%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  pdfContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
