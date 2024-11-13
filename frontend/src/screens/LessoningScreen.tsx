import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';

import ProblemSection from '@components/classLessoning/ProblemSection';
import TeacherRealTimeCanvasSection from '@components/classLessoning/TeacherRealTimeCanvasSection';
import StudentRealTimeCanvasSection from '@components/classLessoning/StudentRealTimeCanvasSection';
import {useAuthStore} from '@store/useAuthStore';
import {useFocusEffect} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {getResponsiveSize} from '@utils/responsive';
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import PulseIndicator from '@components/classLessoning/PulseIndicator';

function LessoningScreen(): React.JSX.Element {
  const userInfo = useAuthStore(state => state.userInfo);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
  const clientRef = useRef<StompJs.Client | null>(null);
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjYzLCJyb2xlIjoiVEVBQ0hFUiIsImlhdCI6MTczMTEzMzM0NCwiZXhwIjoxNzMxMTM0MjA4fQ.cn1udkAOkpITcbP9lDIo2gtib-QF0OizLCy7DZWe6yU';
  const payload = {
    memberId: 63,
    role: 'STUDENT',
    lessonId: 37,
    questionId: 1,
    drawingData: '경로 데이터 예정4',
  };

  const lessonId = 37;
  const isTeacher = userInfo.role === 'TEACHER';
  const questionId = 1;
  console.log('당신은 선생인가', isTeacher);

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
        if (isTeacher) {
          const teacherTopic = `/topic/teacher/lesson/${lessonId}`;
          client.subscribe(teacherTopic, message => {
            console.log('Received message for teacher:', message.body);
            setReceivedMessage(message.body);
          });
          console.log(`Subscribed to teacher topic: ${teacherTopic}`);
        } else {
          const studentTopic = `/topic/lesson/${lessonId}/question/${questionId}`;
          client.subscribe(studentTopic, message => {
            // console.log('Received message for student:', message.body);
            setReceivedMessage(message.body);
          });
          console.log(`Subscribed to student topic: ${studentTopic}`);
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
      client.deactivate(); // 컴포넌트 언마운트 시 연결 해제
      console.log('STOMP client deactivated');
    };
  }, [isTeacher, lessonId, questionId]);

  // 메시지 발송 함수
  const sendMessage = () => {
    console.log('Attempting to send message...');
    console.log('isConnected:', isConnected);
    console.log('clientConnected:', clientRef.current?.active);

    if (isConnected) {
      clientRef.current?.publish({
        headers: {
          Authorization: `${token}`,
        },
        destination: '/app/draw', // 서버가 수신할 경로
        body: JSON.stringify(payload),
      });
      console.log(JSON.stringify(payload));

      console.log('Message sent to STOMP server');
    } else {
      console.log('Cannot send message - STOMP client is not connected');
    }
  };

  const problems = [
    `그림과 같이 양수 $t$ 에 대하여 곡선 $y = e^{x} - 1$ 이 두 직선 $y = t$, $y = 5t$ 와 만나는 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$ 라 하고, 점 $B$ 에서 $x$ 축에 내린 수선의 발을 $C$ 라 하자. 삼각형 $ \\mathrm{ACB} $ 의 넓이를 $S(t)$ 라 할 때, $\\lim_{t \\rightarrow 0+} \\frac{S(t)}{t^{2}}$ 의 값을 구하시오.
    
    ![문제 그림](https://cdn.mathpix.com/cropped/2024_10_24_e358a6c41606b0dd1525g-1.jpg?height=376&width=299&top_left_y=821&top_left_x=1511)`,
    `그림과 같이 양수 $t$ 에 대하여 곡선 $y = e^{x} - 1$ 이 두 직선 $y = t$, $y = 5t$ 와 만나는 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$ 라 하고, 점 $B$ 에서 $x$ 축에 내린 수선의 발을 $C$ 라 하자. 삼각형 $ \\mathrm{ACB} $ 의 넓이를 $S(t)$ 라 할 때, $\\lim_{t \\rightarrow 0+} \\frac{S(t)}{t^{2}}$ 의 값을 구하시오.
    `,
  ];

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
    setCurrentScreen('LessoningScreen');
  });

  // 선생님일 경우
  if (isTeacher) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <ProblemSection problemText={problems[currentPage]} />
            <TeacherRealTimeCanvasSection
              role={userInfo.role}
              token={token}
              clientRef={clientRef}
              isConnected={isConnected}
              sendMessage={sendMessage}
              receivedMessage={receivedMessage}
              currentPage={currentPage + 1}
              totalPages={problems.length}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </View>
          {/* Connection Chip */}
          <View style={styles.connectionChip}>
            <PulseIndicator isConnected={isConnected} />
          </View>

          {/* Send Message Button */}
          <View style={styles.sendMessageButton}>
            <Button
              title="Send Message"
              onPress={sendMessage}
              disabled={!isConnected}
            />
          </View>

          {/* Received Message Display */}
          {receivedMessage && (
            <View style={styles.receivedMessageContainer}>
              <Text style={styles.receivedMessageText}>
                Received message: {receivedMessage}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  }

  // 학생일 경우
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <ProblemSection problemText={problems[currentPage]} />
        <StudentRealTimeCanvasSection
          role={userInfo.role}
          token={token}
          clientRef={clientRef}
          isConnected={isConnected}
          sendMessage={sendMessage}
          receivedMessage={receivedMessage}
          currentPage={currentPage + 1}
          totalPages={problems.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </View>
      {/* Connection Chip */}
      <View
        style={[
          styles.connectionChip,
          // eslint-disable-next-line react-native/no-inline-styles
          {backgroundColor: isConnected ? 'green' : 'red'},
        ]}>
        <Text style={styles.connectionChipText}>
          {isConnected ? 'Connected' : 'Not connected'}
        </Text>
      </View>

      {/* Send Message Button */}
      <View style={styles.sendMessageButton}>
        <Button
          title="Send Message"
          onPress={sendMessage}
          disabled={!isConnected}
        />
      </View>

      {/* Received Message Display */}
      {receivedMessage && (
        <View style={styles.receivedMessageContainer}>
          <Text style={styles.receivedMessageText}>
            Received message: {receivedMessage}
          </Text>
        </View>
      )}
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
    padding: getResponsiveSize(10),
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
    bottom: getResponsiveSize(100),
    right: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(8),
    paddingHorizontal: getResponsiveSize(12),
    borderRadius: getResponsiveSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sendMessageButton: {
    position: 'absolute',
    bottom: getResponsiveSize(20),
    right: getResponsiveSize(20),
  },
  receivedMessageContainer: {
    position: 'absolute',
    bottom: getResponsiveSize(160),
    right: getResponsiveSize(20),
    backgroundColor: '#f0f0f0',
    padding: getResponsiveSize(10),
    borderRadius: getResponsiveSize(8),
    borderColor: '#d0d0d0',
    borderWidth: 1,
    maxWidth: getResponsiveSize(250),
  },
  receivedMessageText: {
    fontSize: getResponsiveSize(14),
    color: '#333',
  },
});

export default LessoningScreen;
