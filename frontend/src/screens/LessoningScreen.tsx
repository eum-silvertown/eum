import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
// import { io, Socket } from 'socket.io-client'; // 기존 소켓은 주석 처리합니다.

import ProblemSection from '@components/classLessoning/ProblemSection';
import LeftCanvasSectionYjsTest from '@components/classLessoning/LeftCanvasSectionYjsTest';
import RightCanvasSectionYjsTest from '@components/classLessoning/RightCanvasSectionYjsTest';

// Yjs WebSocket Provider 설정 (기존 소켓 주석 처리)
// const socket: Socket = io('http://192.168.0.10:8080', {
//   reconnection: false,
//   secure: true,
//   transports: ['websocket'],
// });
// socket.on('connect_error', err => {
//   console.log(err.message);
// });

function LessoningScreen(): React.JSX.Element {
  useEffect(() => {
    // 기존 socket.io 연결 설정은 주석 처리합니다.
    // socket.on('connect_error', (err) => console.log('연결 오류:', err.message));

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      // socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* 왼쪽 문제와 캔버스 */}
      <View style={styles.sectionContainer}>
        <ProblemSection />
        {/* Yjs 기반의 LeftCanvasSection으로 대체 */}
        <LeftCanvasSectionYjsTest />
      </View>

      {/* 오른쪽 문제와 캔버스 */}
      <View style={styles.sectionContainer}>
        <ProblemSection />
        {/* Yjs 기반의 RightCanvasSection으로 대체 */}
        <RightCanvasSectionYjsTest />
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
    padding: 10,
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
});

export default LessoningScreen;
