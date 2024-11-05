import React, {useState} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import ContentLayout from './ContentLayout';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {getResponsiveSize} from '@utils/responsive';
import {colors} from 'src/hooks/useColors';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

export default function MainCalendar(): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // 현재 날짜 가져오기 함수
  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식
  }  

  return (
    <ContentLayout flex={1} padding={0}>
      <Calendar       
        monthFormat={'yyyy년 M월'}
        current={getTodayDate()}
        style={styles.calendar}
        theme={{
          textMonthFontSize: getResponsiveSize(15),
          textDayHeaderFontSize: getResponsiveSize(12),
          textDayFontSize: getResponsiveSize(12),
          arrowColor: colors.light.text.main,
        }}        
        enableSwipeMonths={true}
      />
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  calendar: {
    height: '100%',

    transform: [{scale: 0.9}],
  },
});
