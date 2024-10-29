import React, {useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';

function Replay(): React.JSX.Element {
  const [reviewData] = useState([
    {id: '6', title: '수업 다시보기 2', date: '10-24', duration: '28:00'},
    {id: '5', title: '수업 다시보기 2', date: '10-24', duration: '28:00'},
    {id: '4', title: '수업 다시보기 2', date: '10-24', duration: '28:00'},
    {id: '3', title: '수업 다시보기 3', date: '10-23', duration: '32:00'},
    {id: '2', title: '수업 다시보기 4', date: '10-22', duration: '35:00'},
    {id: '1', title: '수업 다시보기 5', date: '10-21', duration: '29:00'},
  ]);

  const renderItem = ({item}: {item: (typeof reviewData)[0]}) => (
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
    </View>
  );

  return (
    <View style={styles.replay}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        다시보기
      </Text>
      <FlatList
        data={reviewData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  replay: {
    paddingVertical: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    padding: 8,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 10,
    elevation: 1,
  },
  textContainer: {
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  subtitle: {
    marginStart: spacing.xl,
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
