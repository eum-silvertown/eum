import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Text } from '@components/common/Text';
import { borderRadius } from '@theme/borderRadius';
import CheckBox from '@react-native-community/checkbox';

import ArrowDownIcon from '@assets/icons/arrowDownIcon.svg';
import EditIcon from '@assets/icons/editIcon.svg';
import DeleteIcon from '@assets/icons/cancelIcon.svg';

import { colors } from '@hooks/useColors';
import { iconSize } from '@theme/iconSize';

import { toggleTodo, deleteTodo } from '@services/todoService';
import { getResponsiveSize } from '@utils/responsive';
import { useModal } from '@hooks/useModal';
import AddTodoModal from './AddTodoModal';
import ConfirmationModal from '@components/common/ConfirmationModal';

interface TodoProps {
  item: {
    id: number;
    title: string;
    priority: number;
    content: string;
    isDone: boolean;
    createAt: string;
    updatedAt: string;
  };
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function Todo({
  item,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoProps): React.JSX.Element {
  const { open } = useModal();
  const [expanded, setExpanded] = useState(false);
  const [isDone, setIsDone] = useState(item.isDone || false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

  // 중요도에 따른 체크박스 색상 설정 함수
  const getCheckBoxColor = (priority: number) => {
    switch (priority) {
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

  const handleToggleComplete = async () => {
    try {
      const newIsDone = !isDone;
      await toggleTodo(item.id, newIsDone);
      setIsDone(newIsDone);
      if (onToggleComplete) {
        onToggleComplete();
      }
    } catch (error) {
      Alert.alert('할 일 완료 토글을 실패하였습니다.');
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
    open(
      <AddTodoModal isEditMode={true} todo={item} onTodoListUpdate={onEdit} />,
      { title: '할 일 수정' },
    );
  };

  const handleDelete = () => {
    open(
      <ConfirmationModal
        onConfirm={async () => {
          try {
            await deleteTodo(item.id);
            if (onDelete) {
              onDelete();
            }
          } catch (error) {
            Alert.alert('할 일 삭제를 실패하였습니다.');
          }
        }}
      />,
      { title: ' 정말 삭제 하시겠습니까? ' },
    );
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
              transform: [{ rotate: spin }],
            }}>
            <ArrowDownIcon />
          </Animated.View>
          <Text weight="bold">{item.title}</Text>
        </View>

        <View style={styles.optionContainer}>
          <CheckBox
            style={styles.optionIcon}
            value={isDone}
            onValueChange={handleToggleComplete}
            tintColors={{
              true: getCheckBoxColor(item.priority),
              false: getCheckBoxColor(item.priority),
            }}
          />

          {expanded && (
            <>
              <TouchableOpacity style={styles.optionIcon} onPress={handleEdit}>
                <EditIcon width={iconSize.md} height={iconSize.md} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionIcon}
                onPress={handleDelete}>
                <DeleteIcon width={iconSize.sm} height={iconSize.sm} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <Animated.View
        style={[
          styles.descriptionContainer,
          { height: animatedHeight },
          { marginVertical: animatedMargin },
        ]}>
        <Text variant="caption">{item.content}</Text>
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
    borderColor: colors.light.borderColor.pickerBorder,
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
