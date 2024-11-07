import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from '@components/common/Text';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import type {LectureType} from '@store/useLectureStore'; // useLectureStore에서 Lecture 타입을 가져옴
import {colors} from 'src/hooks/useColors';

interface LectureProps {
  item: LectureType;
}

export default function Lecture({item}: LectureProps): React.JSX.Element {
  const pages = 6;

  return (
    <View style={styles.container}>
      <View style={styles.lectureContainer}>
        <View style={styles.pagesContainer}>
          {Array.from({length: pages}).map((_, index) => (
            <View
              key={index}
              style={[
                styles.page,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  backgroundColor:
                    index === pages - 1 ? item.backgroundColor : 'white',
                  transform: [
                    {translateY: index * -4},
                    {translateX: index * 5},
                  ],
                  zIndex: -index,
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.lectureCover,
              {backgroundColor: item.backgroundColor},
            ]}>
            <Text
              variant="subtitle"
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
                  <Text variant="caption" color="white" weight="bold">
                    {item.grade}-{item.classNumber}
                  </Text>
                </View>
                <Text style={{color: item.fontColor}} weight="bold">
                  {item.teacherName} 선생님
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  lectureContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.lg,
    marginTop: spacing.lg,
    paddingRight: spacing.lg,
    marginRight: spacing.lg,
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
    borderColor: `${colors.light.borderColor.cardBorder}7f`,
    borderRadius: borderRadius.sm,
    borderWidth: borderWidth.sm,
  },
});
