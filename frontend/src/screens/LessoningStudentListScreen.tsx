import ParticipantCard from '@components/classLessoning/ParticipantCard';
import {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import TeacherLessoningGridInteractionTool from '@components/classLessoning/TeacherLessoningGridInteractionTool';
import LeftIcon from '@assets/icons/leftIcon.svg';
import RightIcon from '@assets/icons/rightIcon.svg';
import LeftOffIcon from '@assets/icons/leftOffIcon.svg';
import RightOffIcon from '@assets/icons/rightOffIcon.svg';
import {iconSize} from '@theme/iconSize';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType} from '@store/useCurrentScreenStore';
import {useLessonStore} from '@store/useLessonStore';
import {useLectureStore} from '@store/useLessonStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;
interface Participant {
  id: string;
  name: string;
  isTeacher?: boolean;
}

function LessoningStudentListScreen(): React.JSX.Element {
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );
  const navigation = useNavigation<NavigationProps>();
  useFocusEffect(() => {
    setCurrentScreen('LessoningStudentListScreen');
  });

  const lectureId = useLessonStore(state => state.lectureId);
  const questionIds = useLessonStore(state => state.questionIds);
  const memberId = useLectureStore(state => state.memberId);
  const teacherId = useLectureStore(state => state.teacherId);
  const setLectureInfo = useLectureStore(state => state.setLectureInfo);
  const setIsTeaching = useLessonStore(state => state.setIsTeaching);
  console.log(
    'lectureId:',
    lectureId,
    'questionIds:',
    questionIds,
    'memberId:',
    memberId,
    'teacherId:',
    teacherId,
  );

  // 학생 입장 여부 5초에 한번씩 DB 호출 필요

  const ROWS = 4;
  const COLUMNS = 4;
  const PARTICIPANTS_PER_PAGE = ROWS * COLUMNS;

  const [participants] = useState<Participant[]>([
    {id: '83', name: '학생 83'},
    {id: '2', name: '학생 2'},
    {id: '3', name: '학생 3'},
    {id: '4', name: '학생 4'},
    {id: '5', name: '학생 5'},
    {id: '6', name: '학생 6'},
    {id: '7', name: '학생 7'},
    {id: '8', name: '학생 8'},
    {id: '9', name: '학생 9'},
    {id: '10', name: '학생 10'},
    {id: '11', name: '학생 11'},
    {id: '12', name: '학생 12'},
    {id: '13', name: '학생 13'},
    {id: '14', name: '학생 14'},
    {id: '15', name: '학생 15'},
    {id: '16', name: '학생 16'},
    {id: '17', name: '학생 17'},
    {id: '18', name: '학생 18'},
    {id: '19', name: '학생 19'},
    {id: '20', name: '학생 20'},
    {id: '21', name: '학생 21'},
    {id: '22', name: '학생 22'},
    {id: '23', name: '학생 23'},
    {id: '24', name: '학생 24'},
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(participants.length / PARTICIPANTS_PER_PAGE);

  const currentParticipants = participants.slice(
    currentPage * PARTICIPANTS_PER_PAGE,
    (currentPage + 1) * PARTICIPANTS_PER_PAGE,
  );

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleParticipantPress = (id: string) => {
    console.log(id);

    setLectureInfo(Number(id), teacherId!);
    setIsTeaching(true);
    navigation.navigate('LessoningScreen');
  };

  return (
    <View style={styles.mainContainer}>
      {/* 상단 바 */}
      <View style={styles.interactionToolContainer}>
        <TeacherLessoningGridInteractionTool lectureId={lectureId!} />
      </View>

      {/* 총 인원수 */}
      <View style={styles.header}>
        <Text style={styles.totalText}>총 인원: {participants.length}명</Text>
      </View>

      {/* 참가자 그리드 */}
      <FlatList
        data={currentParticipants}
        keyExtractor={item => item.id}
        numColumns={COLUMNS}
        contentContainerStyle={styles.grid}
        renderItem={({item}) => (
          <ParticipantCard
            participant={item}
            onPress={() => handleParticipantPress(item.id)}
          />
        )}
      />

      {/* 페이지 컨트롤 */}
      <View style={styles.pageControls}>
        <TouchableOpacity
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
          style={[styles.arrow, styles.leftArrow]}>
          {currentPage === 0 ? (
            <LeftOffIcon width={iconSize.xl} height={iconSize.xl} />
          ) : (
            <LeftIcon width={iconSize.xl} height={iconSize.xl} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNextPage}
          disabled={currentPage === totalPages - 1}
          style={[styles.arrow, styles.rightArrow]}>
          {currentPage === totalPages - 1 ? (
            <RightOffIcon width={iconSize.xl} height={iconSize.xl} />
          ) : (
            <RightIcon width={iconSize.xl} height={iconSize.xl} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LessoningStudentListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  interactionToolContainer: {
    zIndex: 2,
    position: 'absolute',
    top: 10,
    width: '100%',
    height: '15%',
  },
  closeButton: {
    position: 'absolute',
    top: 130,
    left: 43,
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  header: {
    position: 'absolute',
    top: 43,
    right: 51,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 172,
  },
  pageControls: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    top: '50%',
  },
  arrow: {
    padding: 4,
  },
  leftArrow: {
    position: 'absolute',
    left: 34,
  },
  rightArrow: {
    position: 'absolute',
    right: 34,
  },
});
