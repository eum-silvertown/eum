import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '@components/common/Text';
import ContentLayout from './ContentLayout';
import {Calendar} from 'react-native-calendars';
import {spacing} from '@theme/spacing';
import {Agenda} from 'react-native-calendars';

export default function MainCalendar(): React.JSX.Element {
  return (
    <ContentLayout flex={1}>      
        <Text variant="subtitle" weight="bold">
          달력
        </Text>
        <Calendar></Calendar>        
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  
});