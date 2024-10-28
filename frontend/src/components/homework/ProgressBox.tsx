import {StyleSheet, View} from 'react-native';
import {Text} from '../common/Text';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';
import CompleteHomeworkIcon from '@assets/icons/completeHomeworkIcon.svg';
import IncompleteHomeworkIcon from '@assets/icons/incompleteHomeworkIcon.svg';
import AvarageScoreIcon from '@assets/icons/scoreIcon.svg';
import {iconSize} from '@theme/iconSize';

interface ProgressBoxProps {
  variant: 'complete' | 'incomplete' | 'avarage';
  title: string;
  content: string;
}

function ProgressBox({
  variant,
  title,
  content,
}: ProgressBoxProps): React.JSX.Element {
  const ICONS = {
    complete: CompleteHomeworkIcon,
    incomplete: IncompleteHomeworkIcon,
    avarage: AvarageScoreIcon,
  } as const;

  const Icon = ICONS[variant];

  return (
    <View style={[styles.common, styles[variant]]}>
      <Text weight="bold">{title}</Text>
      <View style={styles.content}>
        {Icon && <Icon width={iconSize.md} height={iconSize.md} />}
        <View style={styles.contentText}>
          <Text variant="xxl" weight="bold">
            {content}
          </Text>
          <Text variant="subtitle">{variant === 'avarage' ? '점' : '개'}</Text>
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
  complete: {
    backgroundColor: '#DAEAEA',
  },
  incomplete: {
    backgroundColor: '#F9E1E1',
  },
  avarage: {
    backgroundColor: '#D8E1FE',
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