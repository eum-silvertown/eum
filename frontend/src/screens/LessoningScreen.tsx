import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { io, Socket } from 'socket.io-client';

import ProblemSection from '@components/classLessoning/ProblemSection';
import TeacherCanvasSection from '@components/classLessoning/TeacherCanvasSection';
import StudentCanvasSection from '@components/classLessoning/StudentCanvasSection';

import { useFocusEffect } from '@react-navigation/native';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { getResponsiveSize } from '@utils/responsive';

function LessoningScreen(): React.JSX.Element {
  // 문제 텍스트와 이미지 URL이 포함된 예제
  const problems = [
    `그림과 같이 양수 $t$ 에 대하여 곡선 $y = e^{x} - 1$ 이 두 직선 $y = t$, $y = 5t$ 와 만나는 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$ 라 하고, 점 $B$ 에서 $x$ 축에 내린 수선의 발을 $C$ 라 하자. 삼각형 $ \\mathrm{ACB} $ 의 넓이를 $S(t)$ 라 할 때, $\\lim_{t \\rightarrow 0+} \\frac{S(t)}{t^{2}}$ 의 값을 구하시오.

![문제 그림](https://cdn.mathpix.com/cropped/2024_10_24_e358a6c41606b0dd1525g-1.jpg?height=376&width=299&top_left_y=821&top_left_x=1511)`,
    `그림과 같이 양수 $t$ 에 대하여 곡선 $y = e^{x} - 1$ 이 두 직선 $y = t$, $y = 5t$ 와 만나는 점을 각각 $\\mathrm{A}$, $\\mathrm{B}$ 라 하고, 점 $B$ 에서 $x$ 축에 내린 수선의 발을 $C$ 라 하자. 삼각형 $ \\mathrm{ACB} $ 의 넓이를 $S(t)$ 라 할 때, $\\lim_{t \\rightarrow 0+} \\frac{S(t)}{t^{2}}$ 의 값을 구하시오.
`,
  ];

  const [currentPage, setCurrentPage] = useState(0);

  const isTeacher = true;

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
  const socket: Socket = io('http://192.168.128.246:8080', {
    reconnection: false,
    secure: true,
    transports: ['websocket'],
  });

  useEffect(() => {
    socket.on('connect_error', err => console.log('연결 오류:', err.message));

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // 선생님일 경우
  if (isTeacher) {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <ProblemSection problemText={problems[currentPage]} />
            <TeacherCanvasSection
              socket={socket}
              currentPage={currentPage + 1}
              totalPages={problems.length}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </View>
        </View>
      </>
    );
  }

  // 학생일 경우
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <ProblemSection problemText={problems[currentPage]} />
        <StudentCanvasSection
          socket={socket}
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
});

export default LessoningScreen;
