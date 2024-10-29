import CanvasSection from '@components/classLessoning/CanvasSection';
import ProblemSection from '@components/classLessoning/ProblemSection';
import {View, StyleSheet} from 'react-native';

function LessoningScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      {/* 문제 영역 */}
      <ProblemSection />
      {/* 캔버스 및 플로팅 툴바 영역 */}
      <CanvasSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default LessoningScreen;
