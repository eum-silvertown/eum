import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import TeacherRealTimeCanvasSection from '@components/classLessoning/TeacherRealTimeCanvasSection';
import StudentRealTimeCanvasSection from '@components/classLessoning/StudentRealTimeCanvasSection';
import { useAuthStore } from '@store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { getResponsiveSize } from '@utils/responsive';
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import LinkIndicator from '@components/classLessoning/LinkIndicator';
import { useLectureStore, useLessonStore } from '@store/useLessonStore';
import ProblemSection from '@components/common/ProblemSection';
import { useQuery } from '@tanstack/react-query';
import { getFileDetail } from '@services/problemService';
import { useLessoningStore } from '@store/useLessoningStore';

function LessoningScreen(): React.JSX.Element {
  const questionIds = useLessonStore(state => state.questionIds);
  const lessonId = useLessonStore(state => state.lessonId);
  const memberId = useLectureStore(state => state.memberId);
  const isTeaching = useLessonStore(state => state.isTeaching);

  const { data: lessonProblems, isLoading } = useQuery({
    queryKey: ['lessonProblems', questionIds],
    queryFn: async ({ queryKey }) => {
      const [, responseQuestionIds] = queryKey;
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map(questionId =>
          getFileDetail(questionId),
        ),
      );
      return problemDetails;
    },
  });

  const problemIds = lessonProblems?.map(problem => problem.fileId) || [];
  const problems = lessonProblems?.map(problem => problem.content) || [];
  const answers = lessonProblems?.map(problem => problem.answer) || [];
  const titles = lessonProblems?.map(problem => problem.title) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useAuthStore(state => state.userInfo);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
  const clientRef = useRef<StompJs.Client | null>(null);
  const isTeacher = userInfo.role === 'TEACHER';

  const sendStudentInfo = (action: 'in' | 'now' | 'out', page?: number) => {
    if (clientRef.current?.connected) {
      const message = {
        studentId: userInfo.id,
        studentName: userInfo.name,
        studentImage: userInfo.image || '',
        currentPage: page ?? currentPage, // 명시적으로 전달된 page 사용, 없으면 currentPage 사용
      };

      const destination = `/app/lesson/${lessonId}/${action}`;
      clientRef.current.publish({ destination, body: JSON.stringify(message) });
      console.log(`Message sent to ${destination}:`, message);
    }
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
        setIsConnected(true);
        // 구독 설정: isTeacher에 따른 분기 처리
        console.log('입장드가자', isTeacher, isTeaching, memberId);
        if (isTeacher && isTeaching && memberId) {
          const teacherTopic = `/user/topic/teacher/lesson/${lessonId}/member/${memberId}`;
          client.subscribe(teacherTopic, message => {
            console.log('Received message for teacher:', message.body);
            setReceivedMessage(message.body);
          });
          console.log(`Subscribed to teacher topic: ${teacherTopic}`);
        } else if (!isTeacher) {
          // 학생 입장 정보 전송
          sendStudentInfo('in');
          const studentTopic = `/topic/lesson/${lessonId}/question/${problemIds[currentPage - 1]}`;
          client.subscribe(studentTopic, message => {
            console.log('Received message for student:', message.body);
            setReceivedMessage(message.body);
          });
        }
      },
      onDisconnect: frame => {
        console.log('STOMP client disconnected');
        setIsConnected(false);

        // 끊김 이유 로그 추가
        if (frame?.body) {
          console.error('Disconnection Frame Body:', frame.body);
        } else {
          console.warn('Disconnected without additional information.');
        }
      },
      onWebSocketError: error => {
        console.error('WebSocket Error:', error);
        setIsConnected(false);
      },
      onStompError: error => {
        console.error('STOMP Error:', error);
        setIsConnected(false);
      },
    });

    // STOMP 클라이언트 활성화
    client.activate();
    clientRef.current = client; // 클라이언트 인스턴스를 useRef에 저장

    return () => {
      console.log('Deactivating STOMP client...');
      if (!isTeacher) {
        sendStudentInfo('out');
      }
      client.deactivate(); // 컴포넌트 언마운트 시 연결 해제
      console.log('STOMP client deactivated');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher, isTeaching, lessonId, memberId]);

  const handleNextPage = () => {
    if (currentPage < problems.length) {
      const nextPage = currentPage + 1;

      setCurrentPage(nextPage); // 페이지 상태 업데이트
      if (!isTeacher) {
        sendStudentInfo('now', nextPage); // 다음 페이지 정보로 now 호출
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;

      setCurrentPage(prevPage); // 페이지 상태 업데이트
      if (!isTeacher) {
        sendStudentInfo('now', prevPage); // 이전 페이지 정보로 now 호출
      }
    }
  };

  const handleGoToTeacherScreen = () => {
    const currentQuestionId = useLessoningStore.getState().questionId;

    console.log('내 문제 ID', questionIds![currentPage - 1]);
    console.log('선생님 문제 ID', currentQuestionId);

    if (!problemIds || problemIds.length === 0) {
      console.error('problemIds 배열이 비어있습니다.');
      return;
    }

    // 문제 ID 배열에서 선생님이 보고 있는 문제 ID의 인덱스를 찾음
    const targetIndex = problemIds.findIndex(id => id === currentQuestionId);

    if (targetIndex === -1) {
      console.error('선생님이 보고 있는 문제 ID가 problemIds에 없습니다.');
      return;
    }

    console.log('targetIndex:', targetIndex);

    // 페이지 업데이트 (1-based index)
    setCurrentPage(targetIndex + 1);
    console.log('Updated currentPage:', targetIndex + 1);
  };


  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );

  useFocusEffect(() => {
    setCurrentScreen('LessoningScreen');
  });

  if (isLoading) {
    <Text>Loading..</Text>;
  }
  // 선생님일 경우
  if (isTeacher) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <ProblemSection problemText={problems[currentPage - 1]} />
            <TeacherRealTimeCanvasSection
              problemIds={problemIds}
              answers={answers}
              titles={titles}
              isTeaching={isTeaching}
              role={userInfo.role}
              clientRef={clientRef}
              isConnected={isConnected}
              receivedMessage={receivedMessage}
              currentPage={currentPage}
              totalPages={problems.length}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </View>
          {/* Connection Chip */}
          <View style={styles.connectionChip}>
            <LinkIndicator isConnected={isConnected} />
          </View>
        </View>
      </>
    );
  }

  // 학생일 경우
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <ProblemSection problemText={problems[currentPage - 1]} />
        <StudentRealTimeCanvasSection
          handleGoToTeacherScreen={handleGoToTeacherScreen}
          problemIds={problemIds}
          answers={answers}
          titles={titles}
          lessonId={lessonId!}
          role={userInfo.role}
          clientRef={clientRef}
          isConnected={isConnected}
          receivedMessage={receivedMessage}
          currentPage={currentPage}
          totalPages={problems.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </View>
      {/* Connection Chip */}
      <View style={styles.connectionChip}>
        <LinkIndicator isConnected={isConnected} />
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
    bottom: getResponsiveSize(160),
    right: getResponsiveSize(32),
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(18),
    borderRadius: getResponsiveSize(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sendMessageButton: {
    position: 'absolute',
    bottom: getResponsiveSize(32),
    right: getResponsiveSize(32),
  },
  receivedMessageContainer: {
    position: 'absolute',
    bottom: getResponsiveSize(250),
    right: getResponsiveSize(32),
    backgroundColor: '#f0f0f0',
    padding: getResponsiveSize(16),
    borderRadius: getResponsiveSize(12),
    borderColor: '#d0d0d0',
    borderWidth: 1,
    maxWidth: getResponsiveSize(400),
  },
  receivedMessageText: {
    fontSize: getResponsiveSize(20),
    color: '#333',
  },
});

export default LessoningScreen;
