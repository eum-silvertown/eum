import React, {useState} from 'react';
<<<<<<< HEAD:frontend/src/components/main/widgets/MainCalendar.tsx
import {StyleSheet, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {getResponsiveSize} from '@utils/responsive';
import {colors} from 'src/hooks/useColors';
import ContentLayout from './ContentLayout';
=======
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import ContentLayout from './ContentLayout';
import {getResponsiveSize} from '@utils/responsive';
import {Calendar} from 'react-native-big-calendar';
import 'dayjs/locale/ko'; // dayjs의 한국어 로케일 불러오기
import {Text} from '@components/common/Text';
import IntoIcon from '@assets/icons/intoIcon.svg';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import { colors } from 'src/hooks/useColors';
>>>>>>> 50643141294956bbe94c655f1f0414d547e6e279:frontend/src/components/main/MainCalendar.tsx

const events = [
  {
    title: 'example',
    start: new Date(2020, 10, 11, 10, 0),
    end: new Date(2020, 10, 12, 10, 30),
  },
];

export default function MainCalendar(): React.JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 연도와 월 가져오기
  const getCurrentYearMonth = () => {
    return `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // 오늘 날짜로 돌아가기
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <ContentLayout flex={1} padding={0}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <IntoIcon
              width={iconSize.md}
              height={iconSize.md}
              style={{transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToToday}>
            <Text weight="bold">{getCurrentYearMonth()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextMonth}>
            <IntoIcon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
        </View>

        <Calendar
          events={events}
          height={getResponsiveSize(160)}
          mode="month"
          locale="ko"
          date={currentDate}
          swipeEnabled={false}
          weekDayHeaderHighlightColor="#ABDECD"
          eventCellTextColor="#FFFFFF"
        />
      </View>
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    padding: getResponsiveSize(10),
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
