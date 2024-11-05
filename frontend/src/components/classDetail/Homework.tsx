import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import HomeworkCreateModal from './HomeworkCreateModal';
import {useModal} from 'src/hooks/useModal';

function Homework(): React.JSX.Element {
  const {open} = useModal();
  const [homeworkData] = useState([
    {id: '5', title: '숙제 1', dueDate: '11-01', questionCount: 5},
    {id: '4', title: '숙제 2', dueDate: '11-02', questionCount: 10},
    {id: '3', title: '숙제 3', dueDate: '11-03', questionCount: 7},
    {id: '2', title: '숙제 4', dueDate: '11-04', questionCount: 8},
  ]);

  const renderItem = ({item}: {item: (typeof homeworkData)[0]}) => (
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

  return (
    <View style={styles.homework}>
      <View style={styles.homeworkHeader}>
        <Text variant="subtitle" weight="bold">
          숙제
        </Text>
        <TouchableOpacity
          onPress={() => {
            open(<HomeworkCreateModal />, {
              title: '숙제 생성',
              onClose: () => {
                console.log('숙제 생성 닫기');
              },
            });
          }}>
          <AddCircleIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={homeworkData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  homework: {
    paddingVertical: spacing.md,
  },
  homeworkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: spacing.xl,
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
