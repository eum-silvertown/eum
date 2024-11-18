import Lecture from '@components/main/Lecture';
import { useBookModalStore } from '@store/useBookModalStore';
import { useRef } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

interface BookProp {
  rightPosition: number;
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  grade: number;
  classNumber: number;
  teacherName: string;
  lectureId: number;
  isMain: boolean;
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
  isMain,
}: BookProp): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

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
    <Pressable ref={bookRef} onPress={pressBook} style={[styles.container, isMain ? { width: '75%' } : { width: '100%' }]}>
      <Lecture item={lectureItem} />
    </Pressable>
  );
}

export default Book;

const getStyles = (width: number) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    aspectRatio: 0.95,
    marginBottom: width * 0.025,
    paddingHorizontal: 25,
  },
});
