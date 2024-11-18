import React, {useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import ContentLayout from './ContentLayout';
import IntoIcon from '@assets/icons/intoIcon.svg';
import {Text} from '@components/common/Text';
import {iconSize} from '@theme/iconSize';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {borderRadius} from '@theme/borderRadius';
import CalendarModal from './CalendarModal';
import {useModal} from 'src/hooks/useModal';

type CustomCalendarProps = {
  homeworkTodoResponseList: {
    id: number;
    backgroundColor: string;
    lectureId: number;
    lectureTitle: string;
    subject: string;
    title: string;
    startTime: string;
    endTime: string;
  }[];
};

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

export default function CustomCalendar({
  homeworkTodoResponseList,
}: CustomCalendarProps): React.JSX.Element {
  const {open} = useModal();
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

    // 오늘 날짜 객체 생성
    const currentDay = new Date(
      year,
      month,
      typeof item === 'number' ? item : 0,
    );

    // 해당 날짜에 마감일이 있는 일정 필터링
    const eventsOnDay = homeworkTodoResponseList.filter(event => {
      const eventEndDate = new Date(event.endTime); // 문자열을 Date 객체로 변환
      return (
        eventEndDate.getDate() === currentDay.getDate() &&
        eventEndDate.getMonth() === currentDay.getMonth() &&
        eventEndDate.getFullYear() === currentDay.getFullYear()
      );
    });

    return (
      <TouchableOpacity
        style={[
          styles.day,
          isToday && styles.todayDay,
          eventsOnDay.length > 0 && styles.eventDay,
        ]}
        onPress={() => {
          if (eventsOnDay.length > 0) {
            open(<CalendarModal events={eventsOnDay} />, {
              title: `${year}-${month + 1}-${currentDay.getDate()} 일정`,
              size: 'xs',
            });
          }
        }}>
        <Text
          style={[
            isToday && styles.todayText,
            eventsOnDay.length > 0 && styles.eventText,
          ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ContentLayout>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <IntoIcon
              width={iconSize.md}
              height={iconSize.md}
              style={{transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToToday}>
            <Text weight="bold">{`${year}년 ${month + 1}월`}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToNextMonth}>
            <IntoIcon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
        </View>

        {/* 요일 */}
        <View style={styles.weekdays}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <Text
              key={day}
              style={[
                index === 0 && {color: 'red'},
                index === 6 && {color: 'blue'},
              ]}>
              {day}
            </Text>
          ))}
        </View>

        {/* 날짜 */}
        <FlatList
          data={days}
          renderItem={renderDay}
          keyExtractor={(item, index) => index.toString()}
          numColumns={7}
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
    backgroundColor: colors.light.background.main,
    borderRadius: borderRadius.xl,
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  eventDay: {
    borderColor: 'blue',
    borderWidth: 2,
    borderRadius: borderRadius.xl,
  },
  eventText: {
    // color: 'blue',
  },
});
