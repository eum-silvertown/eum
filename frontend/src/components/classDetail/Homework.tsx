import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components/common/Text';
import { spacing } from '@theme/spacing';
import LeftArrowOffIcon from '@assets/icons/leftArrowOffIcon.svg';
import LeftArrowOnIcon from '@assets/icons/leftArrowOnIcon.svg';
import RightArrowOffIcon from '@assets/icons/rightArrowOffIcon.svg';
import RightArrowOnIcon from '@assets/icons/rightArrowOnIcon.svg';

function Homework(): React.JSX.Element {
  const [homeworkData] = useState([
    { id: '6', title: '숙제 4', dueDate: '11-04', questionCount: 8 },
    { id: '5', title: '숙제 1', dueDate: '11-01', questionCount: 5 },
    { id: '4', title: '숙제 2', dueDate: '11-02', questionCount: 10 },
    { id: '3', title: '숙제 3', dueDate: '11-03', questionCount: 7 },
    { id: '2', title: '숙제 4', dueDate: '11-04', questionCount: 8 },
    { id: '1', title: '숙제 4', dueDate: '11-04', questionCount: 8 },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(homeworkData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = homeworkData.slice(startIndex, startIndex + itemsPerPage);

  const renderItem = ({ item }: { item: (typeof homeworkData)[0] }) => (
    <View style={styles.item}>
      <View style={[styles.textContainer, styles.idContainer]}>
        <Text variant="caption" weight="bold">
          {item.id}
        </Text>
      </View>
      <View style={[styles.textContainer, styles.titleContainer]}>
        <Text variant="caption" weight="bold">
          {item.title}
        </Text>
      </View>
      <View style={[styles.textContainer, styles.dueDateContainer]}>
        <Text variant="caption" weight="bold">
          {item.dueDate}
        </Text>
      </View>
      <View style={[styles.textContainer, styles.questionCountContainer]}>
        <Text variant="caption" weight="bold">
          {item.questionCount}
        </Text>
      </View>
    </View>
  );

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
        <Text variant="subtitle" weight="bold">
          숙제
        </Text>
        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1}>
              {currentPage === 1 ? (
                <LeftArrowOffIcon width={20} height={20} />
              ) : (
                <LeftArrowOnIcon width={20} height={20} />
              )}
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>{`${currentPage} / ${totalPages}`}</Text>
            <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages}>
              {currentPage === totalPages ? (
                <RightArrowOffIcon width={20} height={20} />
              ) : (
                <RightArrowOnIcon width={20} height={20} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    paddingHorizontal: spacing.md,
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
    elevation: 1,
  },
  textContainer: {
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  idContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 4,
  },
  dueDateContainer: {
    flex: 4,
  },
  questionCountContainer: {
    flex: 1,
  },
});

export default Homework;
