import React, {useState, useEffect} from 'react';
import {Text} from '@components/common/Text';
import {StyleSheet, View, TouchableOpacity, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditIcon from '@assets/icons/editIcon.svg';
import {iconSize} from '@theme/iconSize';
import { getResponsiveSize } from '@utils/responsive';
import { colors } from 'src/hooks/useColors';
import { borderWidth } from '@theme/borderWidth';
import { borderRadius } from '@theme/borderRadius';
import { spacing } from '@theme/spacing';

export default function MainHeader(): React.JSX.Element {
  const defaultMessage = `박효진 학생, 오늘도 좋은 하루 되세요!`;
  const [message, setMessage] = useState(defaultMessage);
  const [isEditing, setIsEditing] = useState(false);

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
      console.log('메세지를 저장합니다:', message); // 로그 추가
      await AsyncStorage.setItem('userMessage', message);
      setIsEditing(false);
    } catch (error) {
      console.log('메시지를 저장하는 중 에러가 발생했습니다:', error);
    }
  };

  return (
    <View style={styles.header}>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            maxLength={50}
          />
          <TouchableOpacity onPress={saveMessage}>
            <EditIcon width={iconSize.lg} height={iconSize.lg} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.displayContainer}>
          <Text variant="title" weight="bold">
            {message}
          </Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <EditIcon width={iconSize.lg} height={iconSize.lg} />
          </TouchableOpacity>
        </View>
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
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: spacing.md,
    borderColor: colors.light.text.main,
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.lg,
    fontSize: getResponsiveSize(22),
    color: colors.light.text.main,
    fontWeight: 'bold',    
  },
});
