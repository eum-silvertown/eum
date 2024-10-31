import React, {useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Animated} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import CheckBox from '@react-native-community/checkbox';

import ArrowDownIcon from '@assets/icons/arrowDownIcon.svg';
import EditIcon from '@assets/icons/editIcon.svg';
import DeleteIcon from '@assets/icons/cancelIcon.svg';

import {colors} from 'src/hooks/useColors';
import {iconSize} from '@theme/iconSize';

interface TodoProps {
  title: string;
  importance: number;
  description: string;
  completed?: boolean;
  onToggleComplete?: () => void;
}

export default function Todo({
  title,
  importance,
  description = '',
  completed = false,
  onToggleComplete,
}: TodoProps) {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // 중요도에 따른 체크박스 색상 설정 함수
  const getCheckBoxColor = (importance: number) => {
    switch (importance) {
      case 1:
        return '#4CAF50'; // 중요도 1 (보통 중요도)
      case 2:
        return '#FF9800'; // 중요도 2 (중요)
      case 3:
        return '#F44336'; // 중요도 3 (매우 중요)
      default:
        return '#2E2559'; // 기본 색상
    }
  };
  const toggleAccordion = () => {
    setExpanded(!expanded);
    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const spin = animatedHeight.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '-180deg'],
  });

  const animatedMargin = animatedHeight.interpolate({
    inputRange: [0, 100],
    outputRange: [0, spacing.md],
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
          <Text weight="bold">{title}</Text>
        </View>

        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={styles.optionIcon}
            onPress={onToggleComplete}>
            <CheckBox
              value={completed}
              tintColors={{
                true: getCheckBoxColor(importance),
                false: getCheckBoxColor(importance),
              }}
            />
          </TouchableOpacity>
          {expanded && (
            <>
              <TouchableOpacity style={styles.optionIcon}>
                <EditIcon width={iconSize.md} height={iconSize.md} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionIcon}>
                <DeleteIcon width={iconSize.sm} height={iconSize.sm} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <Animated.View
        style={[
          styles.descriptionContainer,
          {height: animatedHeight},
          {marginVertical: animatedMargin},
        ]}>
        <Text variant="caption">{description}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.borderColor.pickerBorder,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.md,
  },
  titleContainer: {
    flex: 7,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
  },
  descriptionContainer: {
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
  },
  optionIcon: {
    padding: spacing.sm,
  },
});
