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
import { colors } from 'src/hooks/useColors';

interface TodoType {
  id: number;
  title: string;
  content: string;
  priority: number;
  createAt: string;
  updatedAt: string;
  isDone: boolean;
}

export default function TodoList(): React.JSX.Element {
  const [completedTodos, setCompletedTodos] = useState<TodoType[]>([]);
  const [notCompletedTodos, setNotCompletedTodos] = useState<TodoType[]>([]);
  const [allTodos, setAllTodos] = useState<TodoType[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'notCompleted' | 'completed'
  >('notCompleted');
  const {open} = useModal();

  const loadTodos = async () => {
    try {
      const response = await getTodos();
      const completed = response.data.completedTodoResponseList;
      const notCompleted = response.data.notCompletedTodoResponseList;
      setCompletedTodos(completed);
      setNotCompletedTodos(notCompleted);

      // 전체 목록을 updateAt 기준으로 정렬
      const combinedTodos = [...completed, ...notCompleted].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      setAllTodos(combinedTodos);
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

      {/* 탭 버튼 추가 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'notCompleted' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('notCompleted')}>
          <Text variant="body" weight="medium">
            진행 중
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'completed' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('completed')}>
          <Text variant="body" weight="medium">
            완료
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}>
          <Text variant="body" weight="medium">
            전체
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'all' ? (
          allTodos.length === 0 ? (
            <View style={styles.emptyMessageContainer}>
              <Text variant="body" weight="medium">
                할 일이 없습니다.
              </Text>
            </View>
          ) : (
            allTodos.map(item => (
              <Todo
                key={item.id}
                item={item}
                onEdit={loadTodos}
                onToggleComplete={loadTodos}
                onDelete={loadTodos}
              />
            ))
          )
        ) : selectedTab === 'notCompleted' ? (
          notCompletedTodos.length === 0 ? (
            <View style={styles.emptyMessageContainer}>
              <Text variant="body" weight="medium">
                할 일이 없습니다.
              </Text>
            </View>
          ) : (
            notCompletedTodos.map(item => (
              <Todo
                key={item.id}
                item={item}
                onEdit={loadTodos}
                onToggleComplete={loadTodos}
                onDelete={loadTodos}
              />
            ))
          )
        ) : completedTodos.length === 0 ? (
          <View style={styles.emptyMessageContainer}>
            <Text variant="body" weight="medium">
              완료된 할 일이 없습니다.
            </Text>
          </View>
        ) : (
          completedTodos.map(item => (
            <Todo
              key={item.id}
              item={item}
              onEdit={loadTodos}
              onToggleComplete={loadTodos}
              onDelete={loadTodos}
            />
          ))
        )}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  activeTab: {
    borderBottomWidth: spacing.xs,
    borderColor: colors.light.background.main,
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
});
