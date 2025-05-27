import {
  ActivityIndicator,
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
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {CustomTheme} from '@/types/customTheme';
import Label from '@/components/text/Label';
import {defaultStyle} from '@/themes/defaultStyles';
import {Typography} from '@/themes/typography';
import AnalyticsCard from '@/components/cards/AnalyticsCard';
import {useAppDispatch, useAppSelector} from '@/redux-toolkit/store';
import {
  createWithdrawalRequest,
  fetchAnalytics,
} from '@/redux-toolkit/features/analytics/analyticsSlice';
import timeAgoFormatter from '@/utils/dateFormatter';
import {Controller, useForm} from 'react-hook-form';
import {Alert} from 'react-native';

const dashboard = () => {
  const {customColors} = useTheme() as CustomTheme;
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Analytics');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      amount: '',
      upiId: '',
    },
  });

  const dispatch = useAppDispatch();
  const {
    totalReads,
    totalQuestions,
    totalEarnings,
    availableBalance,
    recentActivity,
    withdrawalHistory,
    error,
  } = useAppSelector(state => state.analyticsReducer);
  const {user} = useAppSelector(state => state.authReducer);

  useEffect(() => {
    dispatch(fetchAnalytics(user.id));
  }, [dispatch, user.id]);

  const handleRefresh = useCallback(() => {
    setRefreshLoading(true);
    dispatch(fetchAnalytics(user.id));
    setTimeout(() => {
      setRefreshLoading(false);
    }, 1000);
  }, []);

  const addWithdrawalRequest = async (data: any) => {
    const response = await dispatch(
      createWithdrawalRequest({
        _id: '',
        studentId: user.id,
        upiId: data.upiId,
        amount: data.amount,
        status: '',
        createdAt: '',
      }),
    );

    if (response.meta.requestStatus === 'fulfilled') {
      Alert.alert('Success', 'Request added successfully');
    }

    if (response.meta.requestStatus === 'rejected') {
      Alert.alert('Error', response.payload);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresh}
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

        {totalReads && totalEarnings && totalQuestions && availableBalance ? (
          <>
            <View style={styles.profileCard}>
              <View style={[defaultStyle.row, styles.profileCardDetails]}>
                <View style={defaultStyle.row}>
                  <Image
                    source={{uri: user.profilePic.uri}}
                    style={styles.userImage}
                  />
                  <Label
                    value={user.username}
                    color={customColors.text}
                    textStyle={{fontWeight: 'bold'}}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.sectionBtn,
                    {
                      backgroundColor:
                        selectedSection === 'Earnings'
                          ? '#04d104'
                          : customColors.primary,
                    },
                  ]}
                  activeOpacity={0.7}>
                  <Label
                    value={selectedSection}
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

            <View style={defaultStyle.row}>
              <TouchableOpacity
                style={[
                  styles.profileCard,
                  {
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor:
                      selectedSection == 'Analytics'
                        ? customColors.primary
                        : '#FFF',
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedSection('Analytics');
                }}>
                <Text
                  style={{
                    color:
                      selectedSection == 'Analytics'
                        ? '#FFF'
                        : customColors.text,
                  }}>
                  Analytics
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.profileCard,
                  {
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor:
                      selectedSection == 'Earnings'
                        ? customColors.primary
                        : '#FFF',
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedSection('Earnings');
                }}>
                <Text
                  style={{
                    color:
                      selectedSection == 'Earnings'
                        ? '#FFF'
                        : customColors.text,
                  }}>
                  Earnings
                </Text>
              </TouchableOpacity>
            </View>

            {selectedSection === 'Analytics' ? (
              /* Activity Section */
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
                  {/* <Label
                      value={'Last 30 days'}
                      color={customColors.sectionMiniLabel}
                      textStyle={Typography.cardDetails}
                    /> */}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginHorizontal: 10,
                  }}>
                  <AnalyticsCard
                    label="Total Reads"
                    value={totalReads.toString()}
                  />
                  <AnalyticsCard
                    label="Total Questions"
                    value={totalQuestions.toString()}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginHorizontal: 10,
                  }}>
                  <AnalyticsCard
                    label="Total Earnings"
                    value={totalEarnings.toPrecision(2).toString()}
                  />
                  <AnalyticsCard
                    label="Available Balance"
                    value={availableBalance.toString()}
                  />
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
                  {recentActivity.map((question, index) => (
                    <View
                      style={[defaultStyle.row, styles.activityItem]}
                      key={index}>
                      <View style={[{width: '80%'}]}>
                        <Label
                          value={question.title}
                          color={customColors.text}
                          textStyle={{fontWeight: '500', flexShrink: 1}}
                        />

                        <Label
                          value={question.subject}
                          color={'#ADADAD'}
                          textStyle={{
                            fontWeight: '500',
                            flexShrink: 1,
                            marginTop: 6,
                          }}
                        />
                      </View>
                      <Label
                        value={question.reads.toString()}
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
            ) : (
              /* Earning Section */
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
                    marginVertical: 15,
                  }}>
                  <Label
                    value={`Available Balance (₹${availableBalance})`}
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
                    <Controller
                      control={control}
                      rules={{required: 'UPI ID is required'}}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          placeholder="Enter Your UPI ID"
                          style={[
                            styles.withdrawalInput,
                            {width: '80%', textAlign: 'left'},
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      )}
                      name="upiId"
                    />

                    <Controller
                      control={control}
                      name="amount"
                      rules={{
                        required: 'Amount is required',
                        validate: value => {
                          if (parseFloat(value) > availableBalance) {
                            return 'Amount exceeds available balance';
                          }

                          if (parseFloat(value) < 0) {
                            return 'Amount must be greater than 90';
                          }
                          return true;
                        },
                      }}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          placeholder="0"
                          style={[
                            styles.withdrawalInput,
                            {width: 45, textAlign: 'center'},
                          ]}
                          value={value?.toString()}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType="decimal-pad"
                        />
                      )}
                    />
                  </View>

                  {errors.upiId && (
                    <Label
                      value={errors.upiId.message || ''}
                      color={'#FF0000'}
                      textStyle={Typography.inputErr}
                    />
                  )}

                  {errors.amount && (
                    <Label
                      value={errors.amount.message || ''}
                      color={'#FF0000'}
                      textStyle={Typography.inputErr}
                    />
                  )}

                  <Label
                    value={'Minimum withdrawal amount is ₹90'}
                    color={'#ADADAD'}
                    textStyle={Typography.body}
                  />

                  <TouchableOpacity
                    style={styles.withdrawBtn}
                    activeOpacity={0.7}
                    onPress={handleSubmit(addWithdrawalRequest)}>
                    <Label
                      value={'Withdraw'}
                      color={customColors.btnText}
                      textStyle={{fontWeight: 'bold'}}
                    />
                  </TouchableOpacity>
                </View>

                <Label
                  value={'History'}
                  color={customColors.sectionLabel}
                  textStyle={Typography.label}
                />
                <View style={styles.activityCard}>
                  <View style={[defaultStyle.row, styles.activityHeader]}>
                    <Label
                      value={'Withdrawal Request'}
                      color={'#9a9a9a'}
                      textStyle={{fontWeight: '500'}}
                    />
                  </View>

                  <FlatList
                    data={withdrawalHistory.toReversed()}
                    scrollEnabled={false}
                    keyExtractor={request => request._id}
                    renderItem={({item, index}) => (
                      <View
                        style={[defaultStyle.row, styles.activityItem]}
                        key={index}>
                        <View style={[{width: '65%'}]}>
                          <Label
                            value={item.upiId}
                            color={customColors.text}
                            textStyle={{fontWeight: '500', flexShrink: 1}}
                          />

                          <Label
                            value={timeAgoFormatter(item.createdAt)}
                            color={'#ADADAD'}
                            textStyle={{
                              fontWeight: '500',
                              flexShrink: 1,
                              marginTop: 6,
                            }}
                          />
                        </View>
                        <Label
                          value={item.amount.toString()}
                          color={'#9a9a9a'}
                          textStyle={{
                            fontWeight: '500',
                            fontSize: 12,
                            textAlign: 'center',
                            width: '15%',
                          }}
                        />

                        <Label
                          value={item.status}
                          color={
                            item.status === 'Pending'
                              ? customColors.primary
                              : item.status === 'Rejected'
                              ? '#FF0000'
                              : '#00FF00'
                          }
                          textStyle={{
                            fontWeight: '500',
                            fontSize: 12,
                            textAlign: 'center',
                            width: '15%',
                          }}
                        />
                      </View>
                    )}
                  />
                </View>
              </View>
            )}
          </>
        ) : (
          <ActivityIndicator
            size={'large'}
            color={customColors.primary}
            style={{flex: 1}}
          />
        )}
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
    justifyContent: 'center',
  },
});
