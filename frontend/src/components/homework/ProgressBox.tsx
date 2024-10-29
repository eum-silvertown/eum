import {StyleSheet, View} from 'react-native';
import {Text} from '../common/Text';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';
import {iconSize} from '@theme/iconSize';
import CompleteHomeworkIcon from '@assets/icons/completeHomeworkIcon.svg';
import IncompleteHomeworkIcon from '@assets/icons/incompleteHomeworkIcon.svg';
import AvarageScoreIcon from '@assets/icons/scoreIcon.svg';

interface ProgressBoxProps {
  color: 'blue' | 'red' | 'green';
  title: string;
  content: string;
  unit: string;
  icon: 'complete' | 'incomplete' | 'avarageScore';
}

function ProgressBox({
  color,
  title,
  content,
  unit,
  icon,
}: ProgressBoxProps): React.JSX.Element {
  const icons = {
    complete: CompleteHomeworkIcon,
    incomplete: IncompleteHomeworkIcon,
    avarageScore: AvarageScoreIcon,
  } as const;

  const Icon = icons[icon];

  return (
    <View style={[styles.common, styles[color]]}>
      <Text weight="bold">{title}</Text>
      <View style={styles.content}>
        <Icon width={iconSize.md} height={iconSize.md} />
        <View style={styles.contentText}>
          <Text variant="xxl" weight="bold">
            {content}
          </Text>
          <Text variant="subtitle">{unit}</Text>
        </View>
      </View>
    </View>
  );
}

export default ProgressBox;

const styles = StyleSheet.create({
  common: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    elevation: getResponsiveSize(4),
  },
  blue: {
    backgroundColor: '#D8E1FE',
  },
  red: {
    backgroundColor: '#F9E1E1',
  },
  green: {
    backgroundColor: '#DAEAEA',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  contentText: {flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs},
});
