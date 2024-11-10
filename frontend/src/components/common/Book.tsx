import Lecture from '@components/main/Lecture';
import { useBookModalStore } from '@store/useBookModalStore';
import { spacing } from '@theme/spacing';
import { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface BookProp {
  rightPosition: number;
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  grade: string;
  classNumber: string;
  teacherName: string;
  lectureId: number;
}

function Book({
  title,
  subject,
  backgroundColor,
  fontColor,
  grade,
  classNumber,
  teacherName,
  lectureId,
}: BookProp): React.JSX.Element {
  const lectureItem = {
    title,
    backgroundColor,
    fontColor,
    grade,
    classNumber,
    teacherName,
    subject,
    lectureId,
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
        subtitle: subject,
        teacherName: teacherName,
        title: title,
        lectureId: lectureId,
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
    width: '25%',
    height: undefined,
    aspectRatio: 0.95,
    paddingHorizontal: spacing.xl,
  },
});
