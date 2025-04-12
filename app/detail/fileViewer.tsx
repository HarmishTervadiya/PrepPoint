import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '@/components/BackButton';
import Label from '@/components/text/Label';
import Pdf from 'react-native-pdf';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
const fileViewer = () => {
  const {uri, title} = useLocalSearchParams();
  // console.log(uri);
  const {customColors} = useTheme() as CustomTheme;
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
          // renderActivityIndicator={() => (
          //   <ActivityIndicator size={'large'} color={customColors.primary} />
          // )}
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
