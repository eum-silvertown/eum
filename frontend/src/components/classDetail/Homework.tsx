import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components/common/Text';
import { spacing } from '@theme/spacing';
import LeftArrowOffIcon from '@assets/icons/leftArrowOffIcon.svg';
import LeftArrowOnIcon from '@assets/icons/leftArrowOnIcon.svg';
import RightArrowOffIcon from '@assets/icons/rightArrowOffIcon.svg';
import RightArrowOnIcon from '@assets/icons/rightArrowOnIcon.svg';
import { iconSize } from '@theme/iconSize';
import moment from 'moment';

type HomeworkItem = {
  homeworkId: string;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
};

type HomeworkProps = {
  homework?: HomeworkItem[];
};

function getHomeworkStatus(endTime: string): 'D-Day' | '종료' | '일반' {
  const now = moment();
  const endMoment = moment(endTime);
  if (now.isSame(endMoment, 'day')) {
    return 'D-Day';
  }
  if (now.isAfter(endMoment)) {
    return '종료';
  }
  return '일반';
}

function Homework({ homework = [] }: HomeworkProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 숙제 리스트를 endTime 및 D-Day 상태에 따라 정렬
  const sortedHomework = homework
    .map((item) => ({
      ...item,
      status: getHomeworkStatus(item.endTime),
    }))
    .sort((a, b) => {
      const aMoment = moment(a.endTime);
      const bMoment = moment(b.endTime);

      if (a.status === 'D-Day' && b.status !== 'D-Day') { return -1; }
      if (a.status !== 'D-Day' && b.status === 'D-Day') { return 1; }

      // D-Day가 아니거나 동일한 경우, endTime 기준으로 정렬 (오름차순)
      return aMoment.diff(bMoment);
    });

  const totalPages = Math.ceil(sortedHomework.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedHomework.slice(startIndex, startIndex + itemsPerPage);

  const renderItem = ({ item }: { item: HomeworkItem & { status: string } }) => {
    const backgroundColor =
      item.status === 'D-Day'
        ? '#ffe6e6'
        : item.status === '종료'
          ? '#f0f0f0'
          : '#fdfeff';

    const dueDateDisplay =
      item.status === 'D-Day'
        ? `${moment(item.endTime).format('MM-DD')} (D-Day)`
        : item.status === '종료'
          ? `${moment(item.endTime).format('MM-DD')} (종료)`
          : `${moment(item.endTime).format('MM-DD')} (D-${moment(item.endTime).diff(moment(), 'days')})`;

    return (
      <TouchableOpacity style={[styles.item, { backgroundColor }]} onPress={() => handleItemPress(item)}>
        <View style={[styles.textContainer, styles.idContainer]}>
          <Text variant="caption" weight="bold">
            {item.homeworkId}
          </Text>
        </View>
        <View style={[styles.textContainer, styles.titleContainer]}>
          <Text variant="caption" weight="bold">
            {item.title}
          </Text>
        </View>
        <View style={[styles.textContainer, styles.dueDateContainer]}>
          <Text variant="caption" weight="bold">
            {dueDateDisplay}
          </Text>
        </View>
        <View style={[styles.textContainer, styles.questionCountContainer]}>
          <Text variant="caption" weight="bold">
            {item.questions.length}문제
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleItemPress = (item: HomeworkItem) => {
    console.log(`Clicked on ${item.title}`);
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
    <View style={styles.homework}>
      <View style={styles.header}>
        <Text variant="subtitle" weight="bold" style={styles.subtitle}>
          숙제
        </Text>
        {totalPages > 1 && (
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
        )}
      </View>
      <FlatList
        data={
          paginatedData.length > 0
            ? paginatedData
            : [
              {
                homeworkId: 'no-homework',
                title: '등록된 숙제가 없습니다',
                startTime: '',
                endTime: '',
                questions: [],
                status: '일반',
              },
            ]
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.homeworkId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  homework: {
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
    flex: 0.5,
  },
  titleContainer: {
    flex: 5,
  },
  dueDateContainer: {
    flex: 3,
  },
  questionCountContainer: {
    flex: 1,
  },
});

export default Homework;
