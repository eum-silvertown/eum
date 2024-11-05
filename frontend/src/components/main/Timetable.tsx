import React from 'react';
import {Text} from '@components/common/Text';
import ContentLayout from './ContentLayout';
import Lecture from '@components/main/Lecture';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,  
} from 'react-native';
import {spacing} from '@theme/spacing';

export default function Timetable(): React.JSX.Element {
  const todayLectures = [
    {
      title: '이게뭐여, 수학이여?',
      subject: '수학',
      backgroundColor: '#FF7171',
      fontColor: '#FFFFFF',
      grade: '3',
      classNumber: '2',
      teacherName: '백종원',
      lecturePeriod: 1,
    },
    {
      title: '영어 텍스쳐 없죠?',
      subject: '영어',
      backgroundColor: '#F3FF84',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '롱기누스',
      lecturePeriod: 3,
    },
    {
      title: '나야, 국어기름',
      subject: '국어',
      backgroundColor: '#6A80C8',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '강록최',
      lecturePeriod: 2,
    },
    {
      title: '이게뭐여, 수학이여?',
      subject: '수학',
      backgroundColor: '#FF7171',
      fontColor: '#FFFFFF',
      grade: '3',
      classNumber: '2',
      teacherName: '백종원',
      lecturePeriod: 7,
    },
    {
      title: '영어 텍스쳐 없죠?',
      subject: '영어',
      backgroundColor: '#F3FF84',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '롱기누스',
      lecturePeriod: 4,
    },
    {
      title: '나야, 국어기름',
      subject: '국어',
      backgroundColor: '#6A80C8',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '강록최',
      lecturePeriod: 6,
    },
    {
      title: '이게뭐여, 수학이여?',
      subject: '수학',
      backgroundColor: '#FF7171',
      fontColor: '#FFFFFF',
      grade: '3',
      classNumber: '2',
      teacherName: '백종원',
      lecturePeriod: 1,
    },
    {
      title: '영어 텍스쳐 없죠?',
      subject: '영어',
      backgroundColor: '#F3FF84',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '롱기누스',
      lecturePeriod: 3,
    },
    {
      title: '나야, 국어기름',
      subject: '국어',
      backgroundColor: '#6A80C8',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '강록최',
      lecturePeriod: 5,
    },
  ];

  const sortedLectures = [...todayLectures].sort(
    (a, b) => a.lecturePeriod - b.lecturePeriod,
  );

  return (
    <ContentLayout flex={1}>
      <Text variant="subtitle" weight="bold">
        시간표
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lectures}
        >
        {sortedLectures.map((item, index) => (          
          <Lecture key={index} item={item} />
        ))}
      </ScrollView>
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  lectures: {    
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});
