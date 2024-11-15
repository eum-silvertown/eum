import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from '@components/common/Text';

type LectureItemType = {
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  grade: number;
  classNumber: number;
  teacherName?: string;
  lecturePeriod?: number;
};

interface LectureProps {
  item: LectureItemType;
}

export default function LectureCreateBook({
  item,
}: LectureProps): React.JSX.Element {
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
                {
                  backgroundColor: index === 0 ? item.backgroundColor : 'white',
                  transform: [
                    {translateY: (pages - (index + 1)) * -4},
                    {translateX: (pages - (index + 1)) * 4},
                  ],
                  zIndex: -(pages - (index + 1)),
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
    gap: 10,
    padding: 10,
  },
  lectureContainer: {
    width: 259,
    height: 324,
    alignItems: 'center',
    padding: 15,
  },
  pagesContainer: {
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  lectureCover: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    borderWidth: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  lectureTitle: {
    marginTop: 15,
  },
  lectureInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: 'black',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
  },
});
