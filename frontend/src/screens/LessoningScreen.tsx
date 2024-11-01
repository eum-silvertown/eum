import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {io, Socket} from 'socket.io-client';

import ProblemSection from '@components/classLessoning/ProblemSection';
import LeftCanvasSection from '@components/classLessoning/LeftCanvasSection';
// import LeftRecordCanvasSection from '@components/classLessoning/LeftRecordCanvasSection';
import RightCanvasSection from '@components/classLessoning/RightCanvasSection';
// import RightRecordCanvasSection from '@components/classLessoning/RightRecordCanvasSection';

// type PathData = {
//   path: any;
//   color: string;66
//   strokeWidth: number;
//   opacity: number;
//   timestamp: number; // timestamp 포함
// };

function LessoningScreen(): React.JSX.Element {
  const socket: Socket = io('http://192.168.128.246:8080', {
    reconnection: false,
    secure: true,
    transports: ['websocket'],
  });
  socket.on('connect_error', err => {
    console.log(err.message);
  });
  // const [recordedPaths, setRecordedPaths] = useState<PathData[]>([]); // 녹화된 경로 데이터 저장

  // const handleRecordingEnd = (paths: PathData[]) => {
  //   // path가 Skia Path인 경우, SVG string으로 변환
  //   const formattedPaths = paths.map(pathData => ({
  //     ...pathData,
  //     path:
  //       typeof pathData.path === 'string'
  //         ? pathData.path
  //         : pathData.path.toSVGString(),
  //   }));
  //   setRecordedPaths(formattedPaths); // 변환된 데이터를 저장
  //   console.log('중간단계 데이터 확인용', formattedPaths);
  // };

  useEffect(() => {
    socket.on('connect_error', err => console.log('연결 오류:', err.message));

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <View style={styles.container}>
      {/* 왼쪽 문제와 캔버스 */}
      <View style={styles.sectionContainer}>
        <ProblemSection />
        <LeftCanvasSection socket={socket} />
        {/* <LeftRecordCanvasSection onRecordingEnd={handleRecordingEnd} /> */}
      </View>

      {/* 오른쪽 문제와 캔버스 */}
      <View style={styles.sectionContainer}>
        <ProblemSection />
        <RightCanvasSection socket={socket} />
        {/* <RightRecordCanvasSection recordedPaths={recordedPaths} /> */}
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
