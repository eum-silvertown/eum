import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {useEffect, useState} from 'react';
import {Image, ImageProps, StyleSheet, View} from 'react-native';
import defaultImage from '@assets/images/defaultProfileImage.png';
import Blackboard from '@components/myClass/Blackboard';
import {getResponsiveSize} from '@utils/responsive';
import ScreenInfo from '@components/common/ScreenInfo';
import {borderRadius} from '@theme/borderRadius';

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
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <ScreenInfo
        title="
          OO고등학교 1학년 1반"
      />
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <Blackboard />
          <View style={styles.leftBottomContent}>
            <View style={styles.noticeBox}>
              <Text>선생님</Text>
            </View>
            <View style={styles.noticeBox}>
              <Text>공지사항</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View>
            <Text variant="subtitle" weight="medium">
              우리 반 칭긔들
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
  contentContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '92%',
    gap: spacing.lg,
  },
  leftContent: {
    width: '60%',
    height: '100%',
    gap: spacing.md,
  },
  leftBottomContent: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.lg,
  },
  noticeBox: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'white',
    elevation: getResponsiveSize(2),
    borderRadius: borderRadius.lg,
  },
  rightContent: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    elevation: getResponsiveSize(2),
  },
  studentsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: `${(100 - 5 * 1) / 2}%`, // (100% - (gap 비율 * 6)) / 7 아이템
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    backgroundColor: 'white',
    elevation: getResponsiveSize(2),
    borderRadius: borderRadius.sm,
  },
  studentImage: {
    width: '33%',
    height: undefined,
    aspectRatio: 1,
  },
});
