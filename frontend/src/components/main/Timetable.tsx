import {
  getLectureListDay,
  LectureListDayItemType,
} from '@services/lectureInformation';
import { useQuery } from '@tanstack/react-query';
import { getCurrentDateInfo } from '@utils/dateUtils';
import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Book from '@components/common/Book';
import { Text } from '@components/common/Text';
import { colors } from '@hooks/useColors';

interface TimeTableProps {
  startingHour: number;
  endingHour: number;
  hourWidth: number;
  isNightTime: Animated.AnimatedInterpolation<string | number>;
}

export default function TimeTable({
  startingHour,
  endingHour,
  hourWidth,
  isNightTime,
}: TimeTableProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const totalContentWidth = hourWidth * (endingHour - startingHour + 1);
  const periodTimes = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  const { day, year, semester } = getCurrentDateInfo();
  const { data: lectures = [] } = useQuery<LectureListDayItemType[]>({
    queryKey: ['lectureListDay'],
    queryFn: () => getLectureListDay(day, year, semester),
  });

  const lecturesByHour = React.useMemo(() => {
    const hourMap: Record<number, LectureListDayItemType[]> = {};
    lectures.forEach(lecture => {
      lecture.lecturePeriod?.forEach(period => {
        const hour = periodTimes[period];
        if (!hourMap[hour]) {
          hourMap[hour] = [];
        }
        hourMap[hour].push(lecture);
      });
    });
    return hourMap;
  }, [lectures]);

  return (
    <View style={[styles.timeContainer, { width: totalContentWidth }]}>
      {Array.from({ length: endingHour - startingHour + 1 }).map((_, index) => {
        const hour = startingHour + index;
        return (
          <View key={hour} style={[styles.timeBlock, { width: hourWidth }]}>
            <View style={styles.timeContent}>
              {lecturesByHour[hour] ? (
                lecturesByHour[hour].map(lecture => (
                  <TouchableOpacity key={`${lecture.lectureId}-${hour}`}>
                    <Book
                      backgroundColor={lecture.backgroundColor}
                      classNumber={lecture.classNumber}
                      grade={lecture.grade}
                      rightPosition={0}
                      title={lecture.title}
                      subject={lecture.subject}
                      fontColor={lecture.fontColor}
                      teacherName={lecture.teacher.name}
                      lectureId={lecture.lectureId}
                      isMain={true}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{
                  width: '60%',
                  aspectRatio: 0.85,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: width * 0.025,
                  borderWidth: width * 0.001,
                  borderColor: colors.light.borderColor.pickerBorder,
                  borderRadius: width * 0.01,
                }}><Animated.Text style={[
                  styles.timeText,
                  { color: isNightTime ? '#FFF' : '#000' },
                ]}>강의가 없습니다.</Animated.Text></View>
              )}
              <View style={styles.timeIndicator} />
              <View style={styles.timeTextContainer}>
                <Animated.Text
                  style={[
                    styles.timeText,
                    { color: isNightTime ? '#FFF' : '#000' },
                  ]}>
                  {`${hour}:00`}
                </Animated.Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',
    },
    timeBlock: {
      height: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    timeContent: {
      alignItems: 'center',
    },
    timeIndicator: {
      width: width * 0.00075,
      height: width * 0.01,
      backgroundColor: '#FFFFFF',
      marginBottom: width * 0.0025,
    },
    timeTextContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      paddingHorizontal: width * 0.01,
      paddingVertical: width * 0.0025,
      borderRadius: width * 0.01,
    },
    timeText: {
      color: '#FFFFFF',
      fontSize: width * 0.009,
      fontWeight: '600',
    },
    shadow: {
      width: width * 0.15,
      height: width * 0.03,
      borderRadius: 99999,
    },
  });
