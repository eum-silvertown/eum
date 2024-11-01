import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text} from '@components/common/Text';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import {getResponsiveSize} from '@utils/responsive';

interface LectureProps {
  item: {
    title: string;
    subject: string;
    backgroundColor: string;
    fontColor: string;
    grade: string;
    classNumber: string;
    teacherName: string;
    lecturePeriod: number;
  };
}

export default function Lecture({item}: LectureProps): React.JSX.Element {
  const pages = 5; // 총 페이지 수 (표지 포함)
  
  const calculateLectureTime = (lecturePeriod: number) => {
    const baseHour = 9; // 첫 번째 교시 시작 시간 (9시)
    const hour = baseHour + (lecturePeriod - 1); // 교시별로 시간 증가
    const formattedTime = `${hour.toString().padStart(2, '0')}:00`; // 시간 형식으로 반환
    return formattedTime;
  }

  const lectureTime = calculateLectureTime(item.lecturePeriod)

  return (
    <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.container}>
          <View style={styles.lectureContainer}>
            <View style={styles.pagesContainer}>
              {/* 페이지들을 겹쳐서 배치 */}
              {Array.from({length: pages}).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.page,
                    {
                      backgroundColor:
                        index === pages - 1 ? item.backgroundColor : 'white',
                      transform: [
                        {translateY: index * -7}, // 페이지 겹침 효과
                        {translateX: index * 9}, // 깊이감 추가
                      ],
                      zIndex: -index,
                    },
                  ]}
                />
              ))}
              {/* 책 표지 */}
              <View
                style={[
                  styles.lectureCover,
                  {backgroundColor: item.backgroundColor},
                ]}>
                <Text
                  variant="title"
                  weight="bold"
                  style={[styles.lectureTitle, {color: item.fontColor}]}>
                  {item.title}
                </Text>
                <View style={styles.lectureInfo}>
                  <Text weight="bold" style={{color: item.fontColor}}>
                    {item.subject}
                  </Text>
                  <View style={{alignItems: 'flex-end'}}>
                    <View style={styles.chip}>
                      <Text variant="caption" color='white' weight='bold'>
                        {item.grade}-{item.classNumber}
                      </Text>
                    </View>
                    <Text style={{color: item.fontColor}} weight='bold'>
                      {item.teacherName} 선생님
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.periodContainer}>
            <Text variant="subtitle" weight="bold">
              {lectureTime}
            </Text>
          </View>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  lectureContainer: {
    width: getResponsiveSize(200),
    marginTop: spacing.md,
    flex: 1,
    alignItems: 'center',
    padding: spacing.xl,
  },
  pagesContainer: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  lectureCover: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
    borderWidth: 0.5,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  lectureTitle: {
    marginTop: spacing.lg,
  },
  lectureInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: 'black',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: borderRadius.sm,
    borderWidth: 0.5,
  },
  periodContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
