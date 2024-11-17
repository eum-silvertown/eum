import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../common/Text';
import { borderRadius } from '@theme/borderRadius';
import { getResponsiveSize } from '@utils/responsive';
import { iconSize } from '@theme/iconSize';
import CompleteHomeworkIcon from '@assets/icons/completeHomeworkIcon.svg';
import IncompleteHomeworkIcon from '@assets/icons/incompleteHomeworkIcon.svg';
import HomeworkCheckIcon from '@assets/icons/homeworkCheckIcon.svg';
import FolderCheckIcon from '@assets/icons/folderCheckIcon.svg';
import AvarageScoreIcon from '@assets/icons/scoreIcon.svg';
import ExamIcon from '@assets/icons/examIcon.svg';
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
import { useAuthStore } from '@store/useAuthStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface ProgressBoxProps {
  color: 'blue' | 'red' | 'green';
  title: string;
  content: string;
  unit: string;
  icon:
  | 'complete'
  | 'exam'
  | 'incomplete'
  | 'avarageScore'
  | 'homeworkCheck'
  | 'folderCheck';
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
}: ProgressBoxProps): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const userRole = useAuthStore(state => state.userInfo.role);

  const handleNavigate = () => {
    if (!isLessonDetail) {
      return;
    }

    // 각 title에 맞게 이동할 페이지를 지정
    switch (title) {
      case '수업':
        navigation.navigate('ClassLessonListScreen');
        break;
      case '시험':
        if (userRole === 'STUDENT') {
          navigation.navigate('ClassExamListScreen');
        } else {
          navigation.navigate('ClassExamListTeacherScreen');
        }
        break;
      case '숙제':
        if (userRole === 'STUDENT') {
          navigation.navigate('ClassHomeworkListScreen');
        } else {
          navigation.navigate('ClassHomeworkListTeacherScreen');
        }
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
    exam: ExamIcon,
  } as const;

  const Icon = icons[icon];
  const contentValue = parseInt(content, 10);

  return (
    <View style={[styles.common, styles[color]]}>
      <View style={styles.titleContainer}>
        <Text weight="bold">{title}</Text>
        {isLessonDetail && (
          <TouchableOpacity style={styles.intoButton} onPress={handleNavigate}>
            <IntoIcon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <Icon width={iconSize.lg} height={iconSize.lg} />
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
    padding: 15,
    borderRadius: borderRadius.md,
    elevation: getResponsiveSize(6),
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
    marginBottom: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  contentText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    overflow: 'hidden',
  },
  intoButton: {
    padding: 3,
  },
});
