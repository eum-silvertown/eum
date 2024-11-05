import {StyleSheet, View} from 'react-native';
import ProgressBox from './ProgressBox';
import {spacing} from '@theme/spacing';
import ProgressChart from './ProgressChart';
import {memo} from 'react';

function ProgressBoxes(): React.JSX.Element {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBoxes}>
        <View style={styles.progressChart}>
          <ProgressChart />
        </View>
        <ProgressBox
          color="blue"
          title="완료"
          content="8"
          icon="complete"
          unit="개"
        />
        <ProgressBox
          color="red"
          title="미제출"
          content="2"
          icon="incomplete"
          unit="개"
        />
        <ProgressBox
          color="green"
          title="평균 점수"
          content="80"
          icon="avarageScore"
          unit="점"
        />
      </View>
    </View>
  );
}

export default memo(ProgressBoxes);

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    height: '33%',
  },
  progressBoxes: {flexDirection: 'row', flex: 1, gap: spacing.lg},

  progressChart: {
    width: '30%',
    height: '100%',
  },
});
