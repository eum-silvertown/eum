import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from '@components/common/Text';
import { borderWidth } from '@theme/borderWidth';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { colors } from 'src/hooks/useColors';
import { getResponsiveSize } from '@utils/responsive';
import type { LectureType } from '@store/useLectureStore'; // useLectureStore에서 Lecture 타입을 가져옴

interface LectureProps {
  item: LectureType;
}

export default function Lecture({ item }: LectureProps): React.JSX.Element {
  const pages = 15;

  const calculateLectureTime = (lecturePeriod?: number) => {
    if (!lecturePeriod) return null;
    const baseHour = 9;
    const hour = baseHour + (lecturePeriod - 1);
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const lectureTime = calculateLectureTime(item.lecturePeriod);

  return (
    <View style={styles.container}>
      <View style={styles.lectureContainer}>
        <View style={styles.pagesContainer}>
          {Array.from({ length: pages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.page,
                {
                  backgroundColor:
                    index === pages - 1 ? item.backgroundColor : 'white',
                  transform: [
                    { translateY: index * -2 },
                    { translateX: index * 3 },
                  ],
                  zIndex: -index,
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.lectureCover,
              { backgroundColor: item.backgroundColor },
            ]}
          >            
            <Text
              variant="subtitle"
              weight="bold"
              style={[styles.lectureTitle, { color: item.fontColor }]}
            >
              {item.title}
            </Text>
            <View style={styles.lectureInfo}>
              <Text weight="bold" style={{ color: item.fontColor }}>
                {item.subject}
              </Text>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.chip}>
                  <Text variant="caption" color="white" weight="bold">
                    {item.grade}-{item.classNumber}
                  </Text>
                </View>
                <Text style={{ color: item.fontColor }} weight="bold">
                  {item.teacherName} 선생님
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {lectureTime && (
        <View style={styles.periodContainer}>
          <Text variant="subtitle" weight="bold">
            {lectureTime}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  lectureContainer: {
    width: getResponsiveSize(170),
    height: getResponsiveSize(200),
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
    borderWidth: borderWidth.xs,
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
    borderColor: 'gray',
    borderRadius: borderRadius.sm,
    borderWidth: borderWidth.sm,
  },
  periodContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
