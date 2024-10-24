import {StyleSheet, View} from 'react-native';
import {Text} from '../Text';
import {HomeworkType} from '@screens/HomeworkScreen';
import {spacing} from '@theme/spacing';
import ListItemContainer from '../ListItemContainer';
import {iconSize} from '@theme/iconSize';
import {useColors} from 'src/hooks/useColors';

interface HomeworkItemProps {
  index: number;
  homework: HomeworkType;
}

function HomeworkItem({index, homework}: HomeworkItemProps): React.JSX.Element {
  const colors = useColors();
  const stateColor = {
    완료: colors.background.primary,
    미제출: colors.background.danger,
  };

  return (
    <ListItemContainer variant="homework">
      <Text style={styles.homeworkIndex}>{index + 1}</Text>
      <View
        style={[
          styles.homeworkState,
          {backgroundColor: stateColor[homework.state]},
        ]}>
        <Text variant="caption" weight="bold" color="white" align="center">
          {homework.state}
        </Text>
      </View>
      <View style={styles.homeworkTitle}>
        <Text>
          {homework.category} - {homework.problemNum}번 문제
        </Text>
        <Text>{homework.dueToDate}</Text>
      </View>
      <Text style={styles.homeworkDday}>D-</Text>
      <Text style={styles.homeworkCorrect}>
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
  homeworkIndex: {
    flex: 0.25,
    paddingLeft: spacing.xl,
  },
  homeworkState: {
    width: iconSize.xl,
    justifyContent: 'center',
    aspectRatio: 1,
    marginHorizontal: spacing.xxl,
    borderRadius: 9999,
  },
  homeworkTitle: {
    flex: 4,
  },
  homeworkDday: {
    flex: 0.75,
  },
  homeworkCorrect: {
    flex: 1,
  },
});
