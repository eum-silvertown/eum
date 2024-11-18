import ParticipantCard from '@components/classLessoning/ParticipantCard';
import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import TeacherLessoningGridInteractionTool from '@components/classLessoning/TeacherLessoningGridInteractionTool';
import {getResponsiveSize} from '@utils/responsive';
import LeftIcon from '@assets/icons/leftIcon.svg';
import RightIcon from '@assets/icons/rightIcon.svg';
import LeftOffIcon from '@assets/icons/leftOffIcon.svg';
import RightOffIcon from '@assets/icons/rightOffIcon.svg';
import {iconSize} from '@theme/iconSize';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType} from '@store/useCurrentScreenStore';
import {useLectureStore, useLessonStore} from '@store/useLessonStore';
import {useStudentListStore} from '@store/useStudentListStore';
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import EmptyData from '@components/common/EmptyData';
import {useMutation} from '@tanstack/react-query';
import {adjustStudentAttitudeScore} from '@services/lectureInformation';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function LessoningStudentListScreen(): React.JSX.Element {
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );
  const navigation = useNavigation<NavigationProps>();
  useFocusEffect(() => {
    setCurrentScreen('LessoningStudentListScreen');
  });
  const {participants, addParticipant, updateParticipant, removeParticipant} =
    useStudentListStore();

  const lectureId = useLessonStore(state => state.lectureId);
  const lessonId = useLessonStore(state => state.lessonId);
  const teacherId = useLectureStore(state => state.teacherId);
  const setLectureInfo = useLectureStore(state => state.setLectureInfo);
  const setIsTeaching = useLessonStore(state => state.setIsTeaching);

  const clientRef = useRef<StompJs.Client | null>(null);

  const ROWS = 4;
  const COLUMNS = 4;
  const PARTICIPANTS_PER_PAGE = ROWS * COLUMNS;

  const [teacherCurrentPage, setTeacherCurrentPage] = useState(0);

  const totalPages = Math.ceil(participants.length / PARTICIPANTS_PER_PAGE);

  const currentParticipants = participants.slice(
    teacherCurrentPage * PARTICIPANTS_PER_PAGE,
    (teacherCurrentPage + 1) * PARTICIPANTS_PER_PAGE,
  );

  const goToPreviousPage = () => {
    if (teacherCurrentPage > 0) {
      setTeacherCurrentPage(teacherCurrentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (teacherCurrentPage < totalPages - 1) {
      setTeacherCurrentPage(teacherCurrentPage + 1);
    }
  };

  const handleParticipantPress = (id: number) => {
    setLectureInfo(id, teacherId!);
    setIsTeaching(true);
    navigation.navigate('LessoningScreen');
  };

  const mutation = useMutation({
    mutationKey: ['adjustStudentAttitudeScore'], // 명시적으로 키 설정
    mutationFn: async (studentId: number) => {
      return adjustStudentAttitudeScore(lectureId!, studentId);
    },
    onSuccess: data => {
      console.log('점수 감소 성공:', data);
      Alert.alert('점수 감소 완료');
    },
    onError: error => {
      console.error('점수 감소 실패:', error);
      Alert.alert('점수 감소 실패', '다시 시도해주세요.');
    },
  });

  const handleLongPress = (studentId: number) => {
    Alert.alert(
      '점수 감소',
      `학생 ID ${studentId}의 점수를 감소시키겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            // Mutation 실행
            mutation.mutate(studentId);
          },
        },
      ],
    );
  };

  // STOMP 클라이언트 초기화 및 설정
  useEffect(() => {
    const client = new StompJs.Client({
      webSocketFactory: () =>
        new SockJS('http://k11d101.p.ssafy.io/ws-gateway/drawing'),
      debug: str => console.log('STOMP Debug:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('STOMP client successfully connected');

        const teacherTopic = `/topic/lesson/${lessonId}`;
        client.subscribe(teacherTopic, message => {
          const data = JSON.parse(message.body);
          const {type, studentId, studentName, studentImage, currentPage} =
            data;

          if (type === 'in') {
            addParticipant({
              studentId,
              studentName,
              studentImage,
              currentPage,
              status: 'in',
            });
          } else if (type === 'now') {
            updateParticipant(studentId, {status: 'now', currentPage});

            // 3초 후 상태를 'in'으로 변경
            setTimeout(() => {
              updateParticipant(studentId, {status: 'in'});
            }, 3000);
          } else if (type === 'out') {
            updateParticipant(studentId, {status: 'out'});
            setTimeout(() => {
              removeParticipant(studentId);
            }, 3000);
          }
        });
      },
      onDisconnect: () => {
        console.log('STOMP client disconnected');
      },
      onWebSocketError: error => {
        console.error('WebSocket Error:', error);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addParticipant, removeParticipant, updateParticipant, participants]);

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
      {currentParticipants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyData message="수업에 참가중인 학생이 없습니다" />
        </View>
      ) : (
        <FlatList
          data={currentParticipants}
          keyExtractor={item => String(item.studentId)}
          numColumns={COLUMNS}
          contentContainerStyle={styles.grid}
          renderItem={({item}) => (
            <ParticipantCard
              participant={item}
              onPress={() => handleParticipantPress(item.studentId)}
              onLongPress={() => handleLongPress(item.studentId)}
            />
          )}
        />
      )}

      {/* 페이지 컨트롤 */}
      <View style={styles.pageControls}>
        {/* 좌측 화살표 */}
        <TouchableOpacity
          onPress={goToPreviousPage}
          disabled={teacherCurrentPage === 0}
          style={[styles.arrow, styles.leftArrow]}>
          {teacherCurrentPage === 0 ? (
            <LeftOffIcon width={iconSize.xl} height={iconSize.xl} />
          ) : (
            <LeftIcon width={iconSize.xl} height={iconSize.xl} />
          )}
        </TouchableOpacity>

        {/* 우측 화살표 */}
        <TouchableOpacity
          onPress={goToNextPage}
          disabled={teacherCurrentPage === totalPages - 1 || totalPages === 0}
          style={[styles.arrow, styles.rightArrow]}>
          {teacherCurrentPage === totalPages - 1 || totalPages === 0 ? (
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
    backgroundColor: 'rgba(153, 153, 153, 0.4)',
  },
  interactionToolContainer: {
    zIndex: 2,
    position: 'absolute',
    top: 10,
    width: '100%',
    height: '15%',
  },
  header: {
    position: 'absolute',
    top: getResponsiveSize(32),
    right: getResponsiveSize(38),
    backgroundColor: '#fff',
    padding: getResponsiveSize(12),
    borderRadius: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getResponsiveSize(128),
  },
  pageControls: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    top: '50%',
  },
  arrow: {
    padding: getResponsiveSize(3),
  },
  leftArrow: {
    position: 'absolute',
    left: getResponsiveSize(25),
  },
  rightArrow: {
    position: 'absolute',
    right: getResponsiveSize(25),
  },
  emptyContainer: {
    flex: 1,
    marginVertical: 'auto',
  },
});
