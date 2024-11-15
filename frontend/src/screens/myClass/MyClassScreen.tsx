import {Text} from '@components/common/Text';
import {useEffect, useState} from 'react';
import {Image, ImageProps, StyleSheet, View} from 'react-native';
import defaultImage from '@assets/images/defaultProfileImage.png';
import Blackboard from '@components/myClass/Blackboard';
import ScreenInfo from '@components/common/ScreenInfo';

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
        <View style={styles.topContent}>
          <Blackboard />
          <View style={styles.notice}>
            <Text>게시판</Text>
          </View>
        </View>
        <View style={styles.bottomContent}>
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
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
  },
  contentContainer: {
    width: '100%',
    height: '92%',
    gap: 15,
  },
  topContent: {
    flexDirection: 'row',
    height: '55%',
    gap: 10,
  },
  notice: {
    width: '33%',
    padding: 15,
    elevation: 4,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#775522',
  },
  bottomContent: {
    flex: 1,
    gap: 15,
  },
  studentsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: `${(100 - 5.75 * 4) / 5}%`, // (100% - (gap 비율 * 6)) / 7 아이템
    gap: 15,
    paddingVertical: 5,
    paddingHorizontal: 25,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 5,
  },
  studentImage: {
    width: '33%',
    height: undefined,
    aspectRatio: 1,
  },
});
