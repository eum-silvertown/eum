import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components/common/Text';
import LeftArrowOffIcon from '@assets/icons/leftArrowOffIcon.svg';
import LeftArrowOnIcon from '@assets/icons/leftArrowOnIcon.svg';
import RightArrowOffIcon from '@assets/icons/rightArrowOffIcon.svg';
import RightArrowOnIcon from '@assets/icons/rightArrowOnIcon.svg';
import { iconSize } from '@theme/iconSize';
import { getResponsiveSize } from '@utils/responsive';
import EmptyData from '@components/common/EmptyData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenType } from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

type LessonType = {
  lessonId: number;
  title: string;
  questions: number[];
};

type ReplayProps = {
  lesson?: LessonType[];
};

const Replay = ({ lesson = [] }: ReplayProps): React.JSX.Element => {
  const navigation = useNavigation<NavigationProps>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 역순 정렬된 lesson 데이터
  const sortedLessons = [...lesson].reverse();

  const totalPages = Math.ceil(sortedLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedLessons.slice(startIndex, startIndex + itemsPerPage);

  const renderItem = ({ item }: { item: LessonType }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item)}>
      <View style={[styles.textContainer, styles.idContainer]}>
        <Text variant="caption" weight="bold">
          {item.lessonId}
        </Text>
      </View>
      <View style={[styles.textContainer, styles.titleContainer]}>
        <Text variant="caption" weight="bold">
          {item.title}
        </Text>
      </View>
      <View style={[styles.textContainer, styles.questionsContainer]}>
        <Text variant="caption" weight="bold">
          {item.questions.length} 문제
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item: LessonType) => {
    navigation.navigate('ClassLessonReviewScreen', {
      lessonId: item.lessonId,
      questionIds: item.questions,
    });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <View style={styles.replay}>
      <View style={styles.header}>
        <Text variant="subtitle" weight="bold" style={styles.subtitle}>
          수업 필기 다시보기
        </Text>
        {sortedLessons.length > 0 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={currentPage === 1}>
              {currentPage === 1 ? (
                <LeftArrowOffIcon width={iconSize.sm} height={iconSize.sm} />
              ) : (
                <LeftArrowOnIcon width={iconSize.sm} height={iconSize.sm} />
              )}
            </TouchableOpacity>
            <Text
              style={styles.pageIndicator}>{`${currentPage} / ${totalPages}`}</Text>
            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === totalPages}>
              {currentPage === totalPages ? (
                <RightArrowOffIcon width={iconSize.sm} height={iconSize.sm} />
              ) : (
                <RightArrowOnIcon width={iconSize.sm} height={iconSize.sm} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {sortedLessons.length === 0 ? (
        <EmptyData message="수업이 없습니다" />
      ) : (
        <FlatList
          style={styles.listStyle}
          data={paginatedData}
          renderItem={renderItem}
          keyExtractor={item => item.lessonId.toString()}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  replay: {
    flex: 1,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  subtitle: {
    marginStart: 25,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: getResponsiveSize(18),
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fdfeff',
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(18),
    marginHorizontal: getResponsiveSize(25),
    marginVertical: getResponsiveSize(6),
    borderRadius: 10,
  },
  textContainer: {
    paddingHorizontal: getResponsiveSize(6),
    justifyContent: 'center',
  },
  idContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 5,
  },
  questionsContainer: {
    flex: 2,
  },
  listStyle: {
    borderBlockColor: 'none',
  },
});

export default Replay;
