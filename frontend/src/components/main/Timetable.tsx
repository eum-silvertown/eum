import React from 'react';
import {Text} from '@components/common/Text';
import ContentLayout from './ContentLayout';
import Lecture from '@components/main/Lecture';
import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import {spacing} from '@theme/spacing';
import {useLectureStore} from '@store/useLectureStore';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType} from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

export default function Timetable(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {lectures} = useLectureStore();
  const sortedLectures = [...lectures].sort((a, b) => {
    // lecturePeriod가 없을 경우 뒤로 보내기
    if (!a.lecturePeriod) return 1;
    if (!b.lecturePeriod) return -1;
    // lecturePeriod가 있을 경우 오름차순 정렬
    return a.lecturePeriod - b.lecturePeriod;
  });

  const handleMoveLectureDetail = () => {
    navigation.navigate('ClassDetailScreen');
  };

  const calculateLectureTime = (lecturePeriod?: number) => {
    if (!lecturePeriod) return null;
    const baseHour = 9;
    const hour = baseHour + (lecturePeriod - 1);
    return `${hour.toString().padStart(2, '0')}:00`;
  };  
  
  return (
    <ContentLayout flex={1}>
      <Text variant="subtitle" weight="bold" style={{marginBottom: spacing.sm}}>
        시간표
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lectures}>
        {sortedLectures.map((item, index) => (
          <TouchableOpacity
            key={item.lectureId}
            onPress={handleMoveLectureDetail}>
            <Lecture key={item.lectureId} item={item} />

            <View style={styles.periodContainer}>
              <Text variant="subtitle" weight="bold">
                {calculateLectureTime(item.lecturePeriod)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  lectures: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  periodContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
