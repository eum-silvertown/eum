import React, {useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Animated} from 'react-native';
import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import ArrowDownIcon from '@assets/icons/arrowDownIcon.svg';
import {colors} from 'src/hooks/useColors';
import {getResponsiveSize} from '@utils/responsive';

interface HomeworkProps {
  item: {
    id: number;
    backgroundColor: string;
    lectureId: number;
    lectureTitle: string;
    subject: string;
    title: string;
    startTime: string;
    endTime: string;
  };
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function HoemworkTodo({item}: HomeworkProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    setExpanded(!expanded);

    // 높이 애니메이션
    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : getResponsiveSize(48),
      duration: 300,
      useNativeDriver: false,
    }).start();

    // 회전 애니메이션
    Animated.timing(animatedRotation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const calculateDDay = (endDate: string): string => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    return `D-${diffDays}`;
  };

  const getDDayColor = (endDate: string): string => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // D-Day 또는 D-2 이하일 경우 빨간색, 나머지 주황색
    return diffDays <= 2 ? colors.light.text.error : '#FFA500';
  };

  const spin = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  const animatedMargin = animatedHeight.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10],
  });

  return (
    <TouchableOpacity style={styles.container} onPress={toggleAccordion}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Animated.View
            style={{
              transform: [{rotate: spin}],
            }}>
            <ArrowDownIcon />
          </Animated.View>

          <Text weight="bold">{item.title}</Text>
        </View>
        <Text
          weight="bold"
          variant="caption"
          style={{
            color: getDDayColor(item.endTime), // 색상 설정
          }}>
          {calculateDDay(item.endTime)}
        </Text>
      </View>

      <Animated.View
        style={[
          styles.descriptionContainer,
          {height: animatedHeight},
          {marginVertical: animatedMargin},
        ]}>
        <View>
          <Text variant="caption">수업명 : {item.lectureTitle}</Text>
          <Text variant="caption">과목 : {item.subject}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#B3B3B3',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 10,
  },
  titleContainer: {
    flex: 7,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
  },
  descriptionContainer: {
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  optionIcon: {
    padding: 5,
  },
  button: {
    alignItems: 'center',
    width: '20%',
    backgroundColor: colors.light.background.danger,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: borderRadius.md,
  },
});
