import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import LeftArrowOffIcon from '@assets/icons/leftArrowOffIcon.svg';
import LeftArrowOnIcon from '@assets/icons/leftArrowOnIcon.svg';
import RightArrowOffIcon from '@assets/icons/rightArrowOffIcon.svg';
import RightArrowOnIcon from '@assets/icons/rightArrowOnIcon.svg';
import {iconSize} from '@theme/iconSize';

function Replay(): React.JSX.Element {
  const [reviewData] = useState([
    {id: '6', title: '수업 다시보기 6', date: '10-24', duration: '28:00'},
    {id: '5', title: '수업 다시보기 5', date: '10-24', duration: '28:00'},
    {id: '4', title: '수업 다시보기 4', date: '10-24', duration: '28:00'},
    {id: '3', title: '수업 다시보기 3', date: '10-23', duration: '32:00'},
    {id: '2', title: '수업 다시보기 2', date: '10-22', duration: '35:00'},
    {id: '1', title: '수업 다시보기 1', date: '10-21', duration: '29:00'},
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(reviewData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = reviewData.slice(startIndex, startIndex + itemsPerPage);

  const renderItem = ({item}: {item: (typeof reviewData)[0]}) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
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
      <View style={[styles.textContainer, styles.dateContainer]}>
        <Text variant="caption" weight="bold">
          {item.date}
        </Text>
      </View>
      <View style={[styles.textContainer, styles.durationContainer]}>
        <Text variant="caption" weight="bold">
          {item.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item: {
    id: string;
    title: string;
    date: string;
    duration: string;
  }) => {
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
    <View style={styles.replay}>
      <View style={styles.header}>
        <Text variant="subtitle" weight="bold" style={styles.subtitle}>
          다시보기
        </Text>
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
            style={
              styles.pageIndicator
            }>{`${currentPage} / ${totalPages}`}</Text>
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
      </View>
      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
    paddingHorizontal: spacing.md,
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
    flex: 5,
  },
  dateContainer: {
    flex: 2,
  },
  durationContainer: {
    flex: 1,
  },
});

export default Replay;
