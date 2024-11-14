import React, {useState, useEffect, useRef} from 'react';
import {Text} from '@components/common/Text';
import {Animated, StyleSheet, View, TouchableOpacity, TextInput, ViewStyle} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditIcon from '@assets/icons/editIcon.svg';
import {iconSize} from '@theme/iconSize';
import {getResponsiveSize} from '@utils/responsive';
import {colors} from 'src/hooks/useColors';
import {borderWidth} from '@theme/borderWidth';
import {borderRadius} from '@theme/borderRadius';
import {spacing} from '@theme/spacing';
import {useAuthStore} from '@store/useAuthStore';

interface MainHeaderProps {
  style?: ViewStyle;
  isNightTime?: Animated.AnimatedInterpolation<string | number>;
}

export default function MainHeader({
  style,
  isNightTime = new Animated.Value(0),
}: MainHeaderProps): React.JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const authStore = useAuthStore();
  const defaultMessage = `${authStore.userInfo.name}님, 오늘도 좋은 하루 되세요!`;
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const savedMessage = await AsyncStorage.getItem('userMessage');
        if (savedMessage) {
          setMessage(savedMessage);
        }
      } catch (error) {
        console.log('메세지를 불러오는 중 에러가 발생했습니다:', error);
      }
    };
    loadMessage();
  }, []);

  const saveMessage = async () => {
    try {
      console.log('메세지를 저장합니다:', message);
      await AsyncStorage.setItem('userMessage', message);
      setIsEditing(false);
    } catch (error) {
      console.log('메시지를 저장하는 중 에러가 발생했습니다:', error);
    }
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const backgroundColor = isNightTime.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF00', '#FFFFFFAA'],
  });

  return (
    <View style={[styles.header, style]}>
      {isEditing ? (
        <Animated.View style={[styles.editContainer, {backgroundColor: backgroundColor}]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            maxLength={50}
            onSubmitEditing={saveMessage}
          />
          <TouchableOpacity onPress={saveMessage}>
            <EditIcon width={iconSize.lg} height={iconSize.lg} />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.editContainer, {backgroundColor: backgroundColor}]}>
          <Text variant="title" weight="bold">
            {message || defaultMessage}
          </Text>
          <TouchableOpacity onPress={handleEditPress}>
            <EditIcon width={iconSize.lg} height={iconSize.lg} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '10%',
    paddingHorizontal: spacing.xl,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  input: {
    padding: spacing.md,
    borderColor: colors.light.text.main,
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.lg,
    fontSize: getResponsiveSize(25),
    color: colors.light.text.main,
    fontWeight: 'bold',
  },
});
