import { Text } from '@components/common/Text';
import { useModal } from '@hooks/useModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import DDayModal from './DDayModal';
import { colors } from '@hooks/useColors';

interface DDayData {
  title: string;
  date: string;
}

const DDay = (): React.JSX.Element => {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const [dday, setDday] = useState<DDayData | null>(null);
  const { open } = useModal();

  useEffect(() => {
    loadDDay();
  }, []);

  const loadDDay = async () => {
    try {
      const savedDDAY = await AsyncStorage.getItem('dday');
      if (savedDDAY) {
        const parsedDDay = JSON.parse(savedDDAY);
        const date = new Date(parsedDDay.date);
        if (isNaN(date.getTime())) {
          console.warn('유효하지 않은 날짜 형식입니다.');
          await AsyncStorage.removeItem('dday');
          return;
        }
        setDday(parsedDDay);
      }
    } catch (error) {
      console.error('D-Day 데이터 로드 실패', error);
      await AsyncStorage.removeItem('dday');
    }
  };

  const handleDDayPress = async (title: string, date: string) => {
    const newDDay = { title, date };
    try {
      await AsyncStorage.setItem('dday', JSON.stringify(newDDay));
      setDday(newDDay);
    } catch (error) {
      console.error('D-Day 데이터 저장 실패', error);
    }
  };

  const openDDayModal = () => {
    open(
      <DDayModal onSave={handleDDayPress} />,
      {
        title: 'D-Day 설정',
        size: 'xs',
      }
    );
  };

  const calculateDDay = (targetDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 0 ? 'Day' : diffDays > 0 ? `-${diffDays}` : `+${Math.abs(diffDays)}`;
  };

  if (!dday) {
    return <Pressable
        onPress={openDDayModal}
        style={({ pressed }) => [
            styles.container,
            pressed && { backgroundColor: colors.light.background.mainPressed },
        ]}
    >
        <Text color="white">D-Day 설정하기</Text>
    </Pressable>;
  }

  const daysLeft = calculateDDay(new Date(dday.date));

  return (
    <Pressable
        onPress={openDDayModal}
        style={({ pressed }) => [
            styles.container,
            pressed && { backgroundColor: colors.light.background.mainPressed },
        ]}
    >
        <Text variant="subtitle" weight="medium" color="white" align="center">{dday.title}</Text>
        <Text variant="title" color="white">D{daysLeft}</Text>
    </Pressable>
  );
};

export default DDay;

const getStyles = (width: number) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.01,
    backgroundColor: colors.light.background.main,
    aspectRatio: 1,
    margin: width * 0.025,
    borderRadius: 9999,
  },
});

