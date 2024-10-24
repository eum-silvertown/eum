import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {useEffect, useState} from 'react';
import {Image, ImageProps, StyleSheet, View} from 'react-native';
import defaultImage from '@assets/images/defaultProfileImage.png';
import {borderWidth} from '@theme/borderWidth';

type StudentType = {
  imageUrl: ImageProps;
  name: string;
};

function MyClassScreen(): React.JSX.Element {
  const [students, setStudents] = useState<StudentType[]>([]);

  useEffect(() => {
    setStudents([
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
      {imageUrl: defaultImage, name: '박효진'},
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text variant="title" weight="bold">
          OO고등학교 1학년 1반
        </Text>
      </View>
      <View style={styles.studentsContainer}>
        {students.map((student, index) => (
          <View key={index} style={styles.studentItem}>
            <Image source={student.imageUrl} style={styles.studentImage} />
            <Text>{student.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default MyClassScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  studentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  studentItem: {
    width: `${(100 - 1.5 * 6) / 7}%`, // (100% - (gap 비율 * 6)) / 7 아이템
    gap: spacing.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: borderWidth.sm,
  },
  studentImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});
