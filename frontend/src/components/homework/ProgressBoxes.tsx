import {StyleSheet, View} from 'react-native';
import ProgressBox from './ProgressBox';
import {spacing} from '@theme/spacing';

function ProgressBoxes(): React.JSX.Element {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBoxes}>
        <ProgressBox variant="complete" title="완료" content="8" />
        <ProgressBox variant="incomplete" title="미제출" content="2" />
        <ProgressBox variant="avarage" title="평균 점수" content="80" />
      </View>
    </View>
  );
}

export default ProgressBoxes;

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    height: '25%',
  },
  progressBoxes: {flexDirection: 'row', flex: 1, gap: spacing.lg},
});
