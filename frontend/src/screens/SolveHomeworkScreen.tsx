import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {useLessonStore} from '@store/useLessonStore';
import ProblemSection from '@components/common/ProblemSection';
import StudentCanvasSection from '@components/classActivity/StudentCanvasSection';

function SolveHomeworkScreen(): React.JSX.Element {
  const lessonId = useLessonStore(state => state.lessonId);

  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    if (currentPage < problems.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );

  useFocusEffect(() => {
    setCurrentScreen('SolveHomeworkScreen');
  });

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <ProblemSection problemText={problems[currentPage]} />
        <StudentCanvasSection
          lessonId={lessonId!}
          currentPage={currentPage + 1}
          totalPages={problems.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  sectionContainer: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  problemSection: {
    flex: 1,
    zIndex: 1,
  },
  canvasSection: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  connectionChip: {
    position: 'absolute',
    bottom: 216,
    right: 43,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sendMessageButton: {
    position: 'absolute',
    bottom: 43,
    right: 43,
  },
  receivedMessageContainer: {
    position: 'absolute',
    bottom: 338,
    right: 43,
    backgroundColor: '#f0f0f0',
    padding: 22,
    borderRadius: 16,
    borderColor: '#d0d0d0',
    borderWidth: 1,
    maxWidth: 540,
  },
  receivedMessageText: {
    fontSize: 27,
    color: '#333',
  },
});

export default SolveHomeworkScreen;
