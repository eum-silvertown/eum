import {
  getLectureListDay,
  LectureListDayItemType,
} from '@services/lectureInformation';
import {useQuery} from '@tanstack/react-query';
import {getCurrentDateInfo} from '@utils/dateUtils';
import React from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import LectureCreateBook from './LectureCreateBook';
import {getResponsiveSize} from '@utils/responsive';

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
  const totalContentWidth = hourWidth * (endingHour - startingHour + 1);
  const periodTimes = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  const {day, year, semester} = getCurrentDateInfo();
  const {data: lectures = [], isLoading} = useQuery<LectureListDayItemType[]>({
    queryKey: ['lectureListDay'],
    queryFn: () => getLectureListDay(day, year, semester),
  });

  return (
    <View style={[styles.timeContainer, {width: totalContentWidth}]}>
      {Array.from({length: endingHour - startingHour + 1}).map((_, index) => {
        const hour = startingHour + index;
        return (
          <View key={hour} style={[styles.timeBlock, {width: hourWidth}]}>
            <View style={styles.timeContent}>
              {lectures.map(
                lecture =>
                  lecture.lecturePeriod &&
                  lecture.lecturePeriod.map(period =>
                    periodTimes[period] === hour ? (
                      <TouchableOpacity
                        key={`${lecture.lectureId}-${period}`}
                        style={{
                          height: getResponsiveSize(150),
                          overflow: 'hidden',
                        }}>
                        <LectureCreateBook
                          key={lecture.lectureId}
                          item={{...lecture, lecturePeriod: period}}
                        />
                      </TouchableOpacity>
                    ) : null,
                  ),
              )}
              <View style={styles.timeIndicator} />
              <View style={styles.timeTextContainer}>
                <Animated.Text
                  style={[
                    styles.timeText,
                    {color: isNightTime ? '#FFF' : '#000'},
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

const styles = StyleSheet.create({
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
    width: 2,
    height: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
  },
  timeTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
