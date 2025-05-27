import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';

// Components
import Label from '@/components/text/Label';
import TextInputField from '@/components/input/TextInputField';

// Styles and Assets
import {defaultStyle} from '@/themes/defaultStyles';
import {CustomTheme} from '@/types/customTheme';
import SearchIcon from '@/assets/images/icons/search.png';
import {
  getAllInstitutes,
  searchInstitute,
} from '@/redux-toolkit/features/content/instituteSlice';
import InstituteCard from '@/components/cards/InstituteCard';
import BackButton from '@/components/BackButton';

const InstituteList = () => {
  const dispatch = useAppDispatch();
  const {customColors} = useTheme() as CustomTheme;

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const {institutes} = useAppSelector(state => state.instituteReducer);

  useEffect(() => {
    getAllInstitutes();
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    getAllInstitutes();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchValue(text);
    if(text){
        dispatch(searchInstitute(text));
    }else{
        dispatch(getAllInstitutes());
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
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
          contentContainerStyle={[defaultStyle.container, styles.container]}>
          {/* Header */}
          <View style={styles.header}>
            <BackButton />
            <Label
              value="Institute List"
              color={customColors.text}
              textStyle={styles.headerTitle}
            />
          </View>

          <View style={styles.contentContainer}>
            <TextInputField
              value={searchValue}
              onChangeText={handleSearch}
              placeholder="Search"
              icon={SearchIcon}
            />

            {institutes && institutes.length > 0 ? (
              <FlatList
                data={institutes}
                keyExtractor={institute => institute._id}
                renderItem={({item, index}) => (
                  <InstituteCard
                    name={item.instituteName}
                    logo={item.instituteLogo.uri}
                  />
                )}
                scrollEnabled={false}
              />
            ) : (
              <Text style={{textAlign: 'center'}}>No Result Found</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InstituteList;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    margin: 8,
    gap: 12,
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
});
