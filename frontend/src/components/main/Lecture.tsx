import { StyleSheet, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { Text } from '@components/common/Text';

type LectureType = {
  lectureId?: number;
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  grade: number;
  classNumber: number;
  teacherName?: string;
  lecturePeriod?: number;
  year?: number;
  semester?: number;
}

interface LectureProps {
  item: LectureType;
}

export default function Lecture({ item }: LectureProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const pages = 5;

  return (
    <View style={styles.container}>
      <View style={styles.lectureContainer}>
        <View style={styles.pagesContainer}>
          {Array.from({ length: pages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.page,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  backgroundColor: index === 0 ? item.backgroundColor : 'white',
                  transform: [
                    { translateY: (pages - (index + 1)) * -(width * 0.0015) },
                    { translateX: (pages - (index + 1)) * (width * 0.0015) },
                  ],
                  zIndex: -(pages - (index + 1)),
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.lectureCover,
              { backgroundColor: item.backgroundColor },
            ]}>
            <Text
              variant="subtitle"
              weight="bold"
              style={[styles.lectureTitle, { color: item.fontColor }]}>
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
    </View>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    lectureContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: width * 0.005,
      paddingRight: width * 0.005,
    },
    pagesContainer: {
      width: '100%',
      flex: 1,
      position: 'relative',
    },
    lectureCover: {
      width: '100%',
      height: '100%',
      borderRadius: width * 0.005,
      borderWidth: width * 0.0005,
      borderColor: '#7a7a7a',
      padding: width * 0.01,
      justifyContent: 'space-between',
    },
    lectureTitle: {
      marginTop: width * 0.01,
    },
    lectureInfo: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    chip: {
      backgroundColor: 'black',
      paddingVertical: width * 0.001,
      paddingHorizontal: width * 0.0075,
      borderWidth: width * 0.0005,
      borderRadius: width * 0.01,
      justifyContent: 'center',
      alignItems: 'center',
    },
    page: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderColor: '#7a7a7a',
      borderRadius: width * 0.005,
      borderWidth: width * 0.0005,
    },
  });
