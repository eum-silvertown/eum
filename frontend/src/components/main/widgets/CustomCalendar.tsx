import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import ContentLayout from './ContentLayout';
import IntoIcon from '@assets/icons/intoIcon.svg';
import {Text} from '@components/common/Text';
import {iconSize} from '@theme/iconSize';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {borderRadius} from '@theme/borderRadius';

// 특정 달의 날짜 계산 함수
const getDaysInMonth = (month: number, year: number) => {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay(); // 해당 월의 첫 요일
  const totalDays = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날

  // 첫 주의 빈 칸 채우기
  for (let i = 0; i < firstDay; i++) {
    days.push('');
  }

  // 날짜 채우기
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return days;
};

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const days = getDaysInMonth(month, year);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(today);
  };

  const renderDay = ({item}: {item: number | string}) => {
    const isToday =
      item === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    return (
      <TouchableOpacity style={[styles.day, isToday && styles.todayDay]}>
        <Text style={isToday && styles.todayText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ContentLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <IntoIcon
              width={iconSize.md}
              height={iconSize.md}
              style={{transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>

          {/* 현재 년/월 표시, 클릭 시 오늘 날짜로 이동 */}
          <TouchableOpacity onPress={goToToday}>
            <Text weight="bold">{`${year}년 ${month + 1}월`}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToNextMonth}>
            <IntoIcon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekdays}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <Text
              key={day}
              style={[
                index === 0 && {color: 'red'}, // 일요일
                index === 6 && {color: 'blue'}, // 토요일
              ]}>
              {day}
            </Text>
          ))}
        </View>

        <FlatList
          data={days}
          renderItem={renderDay}
          keyExtractor={(item, index) => index.toString()}
          numColumns={7} // 7일씩 한 줄에 배치
          contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}
        />
      </View>
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  day: {
    width: `${100 / 7}%`,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  todayDay: {
    borderColor: colors.light.background.main,
    backgroundColor: colors.light.background.main,
    borderWidth: borderRadius.sm,
    borderRadius: borderRadius.xl,
  },
  todayText: {
    color: '#FFFFFF', // 오늘 날짜 텍스트 색상
    fontWeight: 'bold',
  },
});
