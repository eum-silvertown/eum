import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { io, Socket } from 'socket.io-client';

import ProblemSection from '@components/classLessoning/ProblemSection';
import LeftCanvasSection from '@components/classLessoning/LeftCanvasSection';
import RightCanvasSection from '@components/classLessoning/RightCanvasSection';

// 연결할 소켓 IP
const socket: Socket = io('http://192.168.0.10:8080', {
  // TODO : 연결안될때 reconnection false 삭제
  reconnection: false,
  secure: true,
  transports: ['websocket'],
});
socket.on('connect_error', err => {
  console.log(err.message);
});

function LessoningScreen(): React.JSX.Element {
  useEffect(() => {
    socket.on('connect_error', (err) => console.log('연결 오류:', err.message));

    return () => {
      socket.disconnect(); // 컴포넌트가 언마운트될 때 소켓 연결 해제
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* 왼쪽 문제와 캔버스 */}
      <View style={styles.sectionContainer}>
        <ProblemSection />
        <LeftCanvasSection socket={socket} />
      </View>

      {/* 오른쪽 문제와 캔버스 */}
      <View style={styles.sectionContainer}>
        <ProblemSection />
        <RightCanvasSection socket={socket} />
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
