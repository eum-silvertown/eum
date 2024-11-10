import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../common/Text';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { getResponsiveSize } from '@utils/responsive';
import { iconSize } from '@theme/iconSize';
import CompleteHomeworkIcon from '@assets/icons/completeHomeworkIcon.svg';
import IncompleteHomeworkIcon from '@assets/icons/incompleteHomeworkIcon.svg';
import HomeworkCheckIcon from '@assets/icons/homeworkCheckIcon.svg';
import FolderCheckIcon from '@assets/icons/folderCheckIcon.svg';
import AvarageScoreIcon from '@assets/icons/scoreIcon.svg';
import {
  withTiming,
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import IntoIcon from '@assets/icons/intoIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenType } from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;


interface ProgressBoxProps {
  color: 'blue' | 'red' | 'green';
  title: string;
  content: string;
  unit: string;
  icon: 'complete' | 'incomplete' | 'avarageScore' | 'homeworkCheck' | 'folderCheck';
  isLessonDetail?: boolean;
  navigateData?: any[];
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const progress = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1500,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useAnimatedReaction(
    () => progress.value * value,
    result => {
      runOnJS(setDisplayValue)(Math.round(result));
    },
    [value],
  );

  return (
    <Text variant="xxl" weight="bold">
      {displayValue}
    </Text>
  );
};

function ProgressBox({
  color,
  title,
  content,
  unit,
  icon,
  isLessonDetail,
  navigateData,
}: ProgressBoxProps): React.JSX.Element {

  const navigation = useNavigation<NavigationProps>();

  const handleNavigate = () => {
    if (!isLessonDetail) { return; }

    // 각 title에 맞게 이동할 페이지를 지정
    switch (title) {
      case '수업':
        navigation.navigate('ClassLessonListScreen', { data: navigateData });

        break;
      case '시험':
        navigation.navigate('ClassExamListScreen', { data: navigateData });
        break;
      case '숙제':
        navigation.navigate('ClassHomeworkListScreen', { data: navigateData });
        break;
      default:
        console.log('Invalid title');
    }
  };

  const icons = {
    complete: CompleteHomeworkIcon,
    incomplete: IncompleteHomeworkIcon,
    avarageScore: AvarageScoreIcon,
    homeworkCheck: HomeworkCheckIcon,
    folderCheck: FolderCheckIcon,
  } as const;

  const Icon = icons[icon];
  const contentValue = parseInt(content, 10);

  return (
    <View style={[styles.common, styles[color]]}>
      <View style={styles.titleContainer}>
        <Text weight="bold">{title}</Text>
        {isLessonDetail && (
          <TouchableOpacity style={styles.intoButton} onPress={handleNavigate}>
            <IntoIcon width={iconSize.sm} height={iconSize.sm} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <Icon width={iconSize.md} height={iconSize.md} />
        <View style={styles.contentText}>
          <AnimatedNumber value={contentValue} />
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  contentText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    overflow: 'hidden',
  },
  intoButton: {
    padding: spacing.xs,
  },
});
