import {Pressable, StyleSheet} from 'react-native';
import {Text} from '../common/Text';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {memo, useEffect} from 'react';

interface FlagProps {
  index: number;
  color: string;
  title: string;
  selected: boolean;
  setSelectedFlag: React.Dispatch<React.SetStateAction<string>>;
}

function Flag({
  index,
  color,
  title,
  selected,
  setSelectedFlag,
}: FlagProps): React.JSX.Element {
  const widthPercentage = useSharedValue(10);

  useEffect(() => {
    if (selected) {
      widthPercentage.value = withTiming(12.5, {duration: 200});
    } else {
      widthPercentage.value = withTiming(10, {duration: 200});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthPercentage.value}%`,
    };
  });

  return (
    <Animated.View
      style={[
        styles.flag,
        animatedStyle,
        {
          top: `${2.5 + index * 10}%`,
          backgroundColor: color,
        },
      ]}>
      <Pressable style={styles.press} onPress={() => setSelectedFlag(title)}>
        <Text weight="bold">{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default memo(Flag);

const styles = StyleSheet.create({
  flag: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 1,
    left: '87.5%',
    height: '8.5%',
    elevation: getResponsiveSize(2),
  },
  press: {
    width: '100%',
    height: '100%',
    paddingRight: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
