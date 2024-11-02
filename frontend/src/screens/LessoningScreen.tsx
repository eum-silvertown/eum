import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {io, Socket} from 'socket.io-client';

import ProblemSection from '@components/classLessoning/ProblemSection';
import LeftCanvasSection from '@components/classLessoning/LeftCanvasSection';
// import LeftRecordCanvasSection from '@components/classLessoning/LeftRecordCanvasSection';
import RightCanvasSection from '@components/classLessoning/RightCanvasSection';
// import RightRecordCanvasSection from '@components/classLessoning/RightRecordCanvasSection';

type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
  timestamp: number;
};

function LessoningScreen(): React.JSX.Element {
  // const [recordedPaths, setRecordedPaths] = useState<PathData[]>([]);

  const socket: Socket = io('http://192.168.128.246:8080', {
    reconnection: false,
    secure: true,
    transports: ['websocket'],
  });

  const handleRecordingEnd = (paths: PathData[]) => {
    const formattedPaths = paths.map(pathData => ({
      ...pathData,
      path: pathData.path.toSVGString
        ? pathData.path.toSVGString()
        : pathData.path,
    }));
    // setRecordedPaths(formattedPaths);
    console.log('중간단계 데이터 확인용', formattedPaths);
  };

  useEffect(() => {
    socket.on('connect_error', err => console.log('연결 오류:', err.message));

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <ProblemSection />
        <LeftCanvasSection
          socket={socket}
          onRecordingEnd={handleRecordingEnd}
        />
        {/* <LeftRecordCanvasSection onRecordingEnd={handleRecordingEnd} /> */}
      </View>

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
