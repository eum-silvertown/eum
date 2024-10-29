import {StyleSheet, View} from 'react-native';
import {Text} from '../common/Text';
import {HomeworkType} from '@screens/HomeworkScreen';
import {spacing} from '@theme/spacing';
import ListItemContainer from '../common/ListItemContainer';
import {iconSize} from '@theme/iconSize';
import {calDueToDate} from '@utils/calDueToDate';

interface HomeworkItemProps {
  homework: HomeworkType;
}

function HomeworkItem({homework}: HomeworkItemProps): React.JSX.Element {
  const stateColor = {
    완료: '#7DCD8E',
    미제출: '#FFCD29',
  };

  return (
    <ListItemContainer variant="homework">
      <View
        style={[
          styles.homeworkState,
          {backgroundColor: stateColor[homework.state]},
        ]}>
        <Text variant="caption" weight="bold" align="center">
          {homework.state}
        </Text>
      </View>
      <View style={styles.homeworkTitle}>
        <Text>
          {homework.category} | {homework.problemNum}번 문제
        </Text>
        <Text variant="caption" color="secondary">
          {homework.dueToDate}
        </Text>
      </View>
      <Text style={styles.homeworkDday}>
        {calDueToDate(homework.dueToDate)}
      </Text>
      <Text style={styles.homeworkCorrect} align="center">
        {homework.state === '완료'
          ? homework.correct
            ? '정답'
            : '오답'
          : '미제출'}
      </Text>
    </ListItemContainer>
  );
}

export default HomeworkItem;

const styles = StyleSheet.create({
  homeworkState: {
    width: iconSize.xl,
    justifyContent: 'center',
    aspectRatio: 1,
    marginHorizontal: spacing.xl,
    borderRadius: 9999,
  },
  homeworkTitle: {
    flex: 3.5,
  },
  homeworkDday: {
    flex: 0.75,
  },
  homeworkCorrect: {
    flex: 1,
  },
});
