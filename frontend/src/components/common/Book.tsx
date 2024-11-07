import Lecture from '@components/main/Lecture';
import {useBookModalStore} from '@store/useBookModalStore';
import {useRef} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

interface BookProp {
  rightPosition: number;
  title: string;
  subtitle: string;
  backgroundColor: string;
  fontColor: string;
  grade: string;
  classNumber: string;
  teacherName: string;
}

function Book({
  title,
  subtitle,
  backgroundColor,
  fontColor,
  grade,
  classNumber,
  teacherName,
}: BookProp): React.JSX.Element {
  const lectureItem = {
    title,
    backgroundColor,
    fontColor,
    grade,
    classNumber,
    teacherName,
    subject: subtitle, // 예: 과목명을 subtitle로 사용
  };

  const bookRef = useRef<View>(null);
  const setBookPosition = useBookModalStore(state => state.setBookPosition);
  const setBookInfo = useBookModalStore(state => state.setBookInfo);
  const setIsBookOpened = useBookModalStore(state => state.setIsBookOpened);
  const pressBook = () => {
    if (bookRef.current) {
      bookRef.current.measureInWindow((x, y, width, height) => {
        setBookPosition({
          x,
          y,
          width,
          height,
        });
      });

      setBookInfo({
        backgroundColor: backgroundColor,
        classNumber: classNumber,
        fontColor: fontColor,
        grade: grade,
        subtitle: subtitle,
        teacherName: teacherName,
        title: title,
      });
      setIsBookOpened(true);
    }
  };

  return (
    <Pressable ref={bookRef} onPress={pressBook} style={[styles.container]}>
      <Lecture item={lectureItem} />
    </Pressable>
  );
}

export default Book;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '20%',
    height: 400,
  },
});
