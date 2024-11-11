import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from '@components/common/Text';
import ContentLayout from './ContentLayout';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import Todo from './Todo';
import AddTodoModal from './AddTodoModal';
import {useModal} from 'src/hooks/useModal';
import {getTodos} from '@services/todoService';

interface TodoType {
  id: number;
  title: string;
  content: string;
  prioirty: number;
  updatedAt: string;
  isDone: boolean;
}

export default function TodoList(): React.JSX.Element {
  const [todoList, setTodoList] = useState<TodoType[]>([
    {
      id: 1,
      title: '테스트투두1',
      content: '테스트투투 내용1',
      prioirty: 1,
      updatedAt: '2024-11-10',
      isDone: true,
    },
    {
      id: 2,
      title: '테스트투두2',
      content: '테스트투투 내용2',
      prioirty: 4,
      updatedAt: '2024-11-09',
      isDone: false,
    },
  ]);
  const {open} = useModal();

  const loadTodos = async () => {
    try {
      const todos = await getTodos();
      setTodoList(todos);
    } catch (error) {
      console.error('투두 리스트를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <ContentLayout flex={2}>
      <View style={styles.headerContainer}>
        <Text variant="subtitle" weight="bold">
          해야할 일
        </Text>
        <TouchableOpacity
          onPress={() => {
            open(<AddTodoModal onTodoListUpdate={loadTodos} />, {
              title: '할 일 생성',
              onClose: () => {
                console.log('할 일 생성 Closed!');
              },
            });
          }}>
          <AddCircleIcon width={iconSize.lg} height={iconSize.lg} />
        </TouchableOpacity>
      </View>
      {todoList.length === 0 ? (
        <View style={styles.emptyMessageContainer}>
          <Text variant="body" weight="medium">
            할 일이 없습니다.
          </Text>
        </View>
      ) : (
        <ScrollView
        showsVerticalScrollIndicator={false}>
          {todoList.map(item => (
            <Todo key={item.id} item={item} onEdit={loadTodos}/>
          ))}
        </ScrollView>
      )}
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
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
});
