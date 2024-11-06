import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components/common/Text';
import { spacing } from '@theme/spacing';
import LeftArrowOffIcon from '@assets/icons/leftArrowOffIcon.svg';
import LeftArrowOnIcon from '@assets/icons/leftArrowOnIcon.svg';
import RightArrowOffIcon from '@assets/icons/rightArrowOffIcon.svg';
import RightArrowOnIcon from '@assets/icons/rightArrowOnIcon.svg';
import { iconSize } from '@theme/iconSize';

type LessonType = {
  lessonId: number;
  title: string;
  questions: number[];
};

type ReplayProps = {
  lesson?: LessonType[];
};

function Replay({ lesson = [] }: ReplayProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 데이터를 최대 5개의 항목으로 제한하여 페이징 처리
  const totalPages = Math.ceil(lesson.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = lesson.slice(startIndex, startIndex + itemsPerPage);

  const renderItem = ({ item }: { item: LessonType }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
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
    console.log(`Clicked on ${item.lessonId}`);
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
          다시보기
        </Text>
        <View style={styles.pagination}>
          <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1}>
            {currentPage === 1 ? (
              <LeftArrowOffIcon width={iconSize.sm} height={iconSize.sm} />
            ) : (
              <LeftArrowOnIcon width={iconSize.sm} height={iconSize.sm} />
            )}
          </TouchableOpacity>
          <Text style={styles.pageIndicator}>{`${currentPage} / ${totalPages}`}</Text>
          <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages}>
            {currentPage === totalPages ? (
              <RightArrowOffIcon width={iconSize.sm} height={iconSize.sm} />
            ) : (
              <RightArrowOnIcon width={iconSize.sm} height={iconSize.sm} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.listStyle}
        data={paginatedData.length > 0 ? paginatedData : [{ lessonId: 0, title: '등록된 수업이 없습니다', questions: [] }]}
        renderItem={renderItem}
        keyExtractor={item => item.lessonId.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  replay: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: spacing.md,
  },
  subtitle: {
    marginStart: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: 12,
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fdfeff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
  },
  textContainer: {
    paddingHorizontal: 4,
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
