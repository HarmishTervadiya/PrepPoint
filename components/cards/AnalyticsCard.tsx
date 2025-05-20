import { StyleSheet, Text, View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import Label from '../text/Label';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '@/types/customTheme';

type AnalyticsCardProps = PropsWithChildren<{
    label: string;
    value: string;
    
}>

export default function AnalyticsCard({label, value}:AnalyticsCardProps) {
    const {customColors} = useTheme() as CustomTheme
  return (
    <View style={styles.card}>
        <Text style={{fontSize: 12, fontWeight: '500', color: '#ADADAD'}} >{label}</Text>
        {/* <Text style={{fontSize: 16, fontWeight: '500', marginTop: 8}} >{value}</Text> */}
      {/* <Label value={label} color={'#ADADAD'} textStyle={} /> */}
      <Label value={value} color={customColors.text} textStyle={{fontSize: 16, fontWeight: '500', marginTop: 8}} />
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        padding: 15,
        elevation: 2,
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowOffset: {
          height: 1,
          width: 1,
        },
        shadowColor: '#000',
        shadowOpacity: 1,
        borderWidth: .1,
        borderColor: '#ADADAD'
      },
})