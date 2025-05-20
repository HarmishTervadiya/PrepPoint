import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import Label from '@/components/text/Label';
import {defaultStyle} from '@/themes/defaultStyles';
import Profile from '@/assets/images/icons/user-icon.png';
import {Typography} from '@/themes/typography';
import AnalyticsCard from '@/components/cards/AnalyticsCard';
import TextInputField from '@/components/input/TextInputField';
import SubmitButton from '@/components/SubmitButton';

const dashboard = () => {
  const {customColors} = useTheme() as CustomTheme;
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);

    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={() => {}}
            refreshing={refreshLoading}
            colors={[customColors.primary]}
          />
        }
        contentContainerStyle={[styles.container]}>
        <View style={styles.header}>
          <Label
            value="Dashboard"
            color={customColors.text}
            textStyle={styles.headerTitle}
          />
        </View>

        <View style={styles.profileCard}>
          <View style={[defaultStyle.row, styles.profileCardDetails]}>
            <View style={defaultStyle.row}>
              <Image source={Profile} style={styles.userImage} />
              <Label
                value={'Dummy@123'}
                color={customColors.text}
                textStyle={{fontWeight: 'bold'}}
              />
            </View>

            <TouchableOpacity style={styles.sectionBtn} activeOpacity={0.7}>
              <Label
                value={'Earnings'}
                color={'#FFF'}
                textStyle={{fontSize: 12, fontWeight: '500'}}
              />
            </TouchableOpacity>
          </View>
          <Label
            value={'Track your performance'}
            color={customColors.primary}
            textStyle={{fontWeight: 'bold', marginTop: 5}}
          />
        </View>
        {/* Activity Section */}
        <View style={{}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 15,
              marginVertical: 5,
            }}>
            <Label
              value={'Analytics'}
              color={customColors.sectionLabel}
              textStyle={Typography.label}
            />
            <Label
              value={'Last 30 days'}
              color={customColors.sectionMiniLabel}
              textStyle={Typography.cardDetails}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}>
            <AnalyticsCard label="Total Views" value="550K" />
            <AnalyticsCard label="Total Views" value="550K" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}>
            <AnalyticsCard label="Total Views" value="550K" />
            <AnalyticsCard label="Total Views" value="550K" />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 15,
              marginVertical: 10,
            }}>
            <Label
              value={'Recent Activity'}
              color={customColors.sectionLabel}
              textStyle={Typography.label}
            />
          </View>

          <View style={styles.activityCard}>
            <View style={[defaultStyle.row, styles.activityHeader]}>
              <Label
                value={'Question'}
                color={'#9a9a9a'}
                textStyle={{fontWeight: '500'}}
              />
              <Label
                value={'Reads'}
                color={'#9a9a9a'}
                textStyle={{fontWeight: '500'}}
              />
            </View>
            {[2, 3, 5, 6].map(index => (
              <View style={[defaultStyle.row, styles.activityItem]} key={index}>
                <View style={[{width: '80%'}]}>
                  <Label
                    value={
                      'QuestionQuestionQuestionQuestionQuestionQuestionQuestionQuestionQuestionQuestionQuestionQuestionQuestion'
                    }
                    color={customColors.text}
                    textStyle={{fontWeight: '500'}}
                  />

                  <Label
                    value={'Javascript'}
                    color={'#ADADAD'}
                    textStyle={{fontWeight: '500', marginTop: 6}}
                  />
                </View>
                <Label
                  value={'500K'}
                  color={'#9a9a9a'}
                  textStyle={{
                    fontWeight: '500',
                    fontSize: 12,
                    textAlign: 'center',
                    width: '15%',
                  }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Earning Section */}

        <View
          style={{
            marginLeft: 15,
            marginVertical: 10,
          }}>
          <Label
            value={'Withdraw your earnings'}
            color={customColors.sectionLabel}
            textStyle={Typography.label}
          />

          <View
            style={{
              marginHorizontal: 15,
              marginVertical: 10,
            }}>
            <Label
              value={'Available Balance (₹500)'}
              color={customColors.primary}
              textStyle={Typography.body}
            />

            <View
              style={[
                defaultStyle.row,
                {
                  gap: 5,
                  height: 45,
                  marginVertical: 15,
                  justifyContent: 'space-between',
                },
              ]}>
              <TextInput
                placeholder="Enter Your UPI ID"
                style={[
                  styles.withdrawalInput,
                  {width: '90%', textAlign: 'left'},
                ]}
              />
              <TextInput
                placeholder="0"
                style={[
                  styles.withdrawalInput,
                  {width: 45, textAlign: 'center'},
                ]}
              />
            </View>

            <Label
              value={'Minimum withdrawal amount is ₹90'}
              color={'#ADADAD'}
              textStyle={Typography.body}
            />

            <TouchableOpacity style={styles.withdrawBtn} activeOpacity={.7}>
              <Label
                value={'Withdraw'}
                color={customColors.btnText}
                textStyle={{fontWeight: 'bold'}} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profileCard: {
    margin: 15,
    padding: 15,
    elevation: 2,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowColor: '#8572FF',

    borderWidth: 0.1,
    borderColor: '#8572FF',
  },
  profileCardDetails: {
    gap: 8,
  },
  userImage: {
    height: 28,
    width: 28,
    marginRight: 8,
    borderRadius: 50,
  },
  sectionBtn: {
    backgroundColor: '#04d104',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activityCard: {
    margin: 15,
    elevation: 2,
    backgroundColor: '#FFF',
    borderRadius: 5,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  activityHeader: {
    padding: 12,
    backgroundColor: '#e1e1e174',
    borderRadius: 5,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    borderColor: '#000',
    borderWidth: 0.2,
  },
  activityItem: {
    padding: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderColor: '#ADADAD',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    // borderColor: '#000',
    // borderWidth: 0.2,
  },
  withdrawalInput: {
    padding: 15,
    elevation: 2,
    backgroundColor: '#FFF',
    borderRadius: 5,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowColor: '#8572FF',
    borderWidth: 0.2,
    borderColor: '#8572FF',
    fontSize: 12,
  },
  withdrawBtn: {
    backgroundColor: '#8572FF',
    padding: 12,
    marginTop: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
