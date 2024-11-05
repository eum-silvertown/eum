import React from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from '@components/common/Text';
import ContentLayout from './ContentLayout';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import Todo from './Todo';
import AddTodoModal from './AddTodoModal';
import { useModal } from 'src/hooks/useModal';

export default function TodoList(): React.JSX.Element {
  const todos = [
    {title: '응애', importance: 3, description: '할일 내용1'},
    {title: '하자', importance: 1, description: '할일 내용2'},
    {
      title: '일하자일하자일하자일하자',
      importance: 0,
      description: '할일 내용3',
    },
    {
      title: '일하자일하자일하자일하자',
      importance: 2,
      description:
        '할일 내용fkdslfdslakmfklasmfklasklfmdasmlfadsmlfmdlasmlfdaskmladskldakslklsda',
    },
    {title: '응애', importance: 3, description: '할일 내용1'},
    {title: '하자', importance: 1, description: '할일 내용2'},
    {
      title: '일하자일하자일하자일하자',
      importance: 0,
      description: '할일 내용3',
    },
    {
      title: '일하자일하자일하자일하자',
      importance: 2,
      description:
        '할일 내용fkdslfdslakmfklasmfklasklfmdasmlfadsmlfmdlasmlfdaskmladskldakslklsda',
    },
    {title: '응애', importance: 3, description: '할일 내용1'},
    {title: '하자', importance: 1, description: '할일 내용2'},
    {
      title: '일하자일하자일하자일하자',
      importance: 0,
      description: '할일 내용3',
    },
    {
      title: '일하자일하자일하자일하자',
      importance: 2,
      description:
        '엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용엄청긴 할일 내용',
    },
  ];

  const {open} = useModal();

  return (
    <ContentLayout flex={2}>
      <View style={styles.headerContainer}>
        <Text variant="subtitle" weight="bold">
          해야할 일
        </Text>
        <TouchableOpacity
          onPress={() => {
            open(<AddTodoModal />, {
              title: '해야할 일 리스트',
              onClose: () => {
                console.log('해야할 일 리스트 Closed!');
              },
            });
          }}>
          <AddCircleIcon width={iconSize.lg} height={iconSize.lg} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {todos.map((item, index) => (
          <Todo key={index} item={item} />
        ))}
      </ScrollView>
    </ContentLayout>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
});
