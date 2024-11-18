import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from '@components/common/Text';
import ContentLayout from './ContentLayout';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {iconSize} from '@theme/iconSize';
import Todo from './Todo';
import HoemworkTodo from './HomeworkTodo';
import AddTodoModal from './AddTodoModal';
import {useModal} from 'src/hooks/useModal';
import {colors} from 'src/hooks/useColors';

interface TodoType {
  id: number;
  title: string;
  content: string;
  priority: number;
  createAt: string;
  updatedAt: string;
  isDone: boolean;
}

interface HomeworkType {
  id: number;
  backgroundColor: string;
  lectureId: number;
  lectureTitle: string;
  subject: string;
  title: string;
  startTime: string;
  endTime: string;
}

type TodoListProps = {
  completedTodos: TodoType[];
  notCompletedTodos: TodoType[];
  homeworkTodoResponseList: HomeworkType[];
  onReload: () => void; // 갱신 함수
};

export default function TodoList({
  completedTodos,
  notCompletedTodos,
  homeworkTodoResponseList,
  onReload,
}: TodoListProps): React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState<
    'homework' | 'notCompleted' | 'completed'
  >('notCompleted');
  const {open} = useModal();

  return (
    <ContentLayout flex={2}>
      <View style={styles.headerContainer}>
        <Text variant="subtitle" weight="bold">
          해야할 일
        </Text>
        <TouchableOpacity
          onPress={() => {
            open(<AddTodoModal onTodoListUpdate={onReload} />, {
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
          style={[
            styles.tabButton,
            selectedTab === 'homework' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('homework')}>
          <Text variant="body" weight="medium">
            숙제
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'homework' ? (
          homeworkTodoResponseList.length === 0 ? (
            <View style={styles.emptyMessageContainer}>
              <Text variant="body" weight="medium">
                할 일이 없습니다.
              </Text>
            </View>
          ) : (
            homeworkTodoResponseList.map(item => (
              <HoemworkTodo
                key={item.id}
                item={item}
                onEdit={onReload}
                onToggleComplete={onReload}
                onDelete={onReload}
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
                onEdit={onReload}
                onToggleComplete={onReload}
                onDelete={onReload}
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
          <View>
            <View>
              <Text align="center" color="error">
                ※ 완료된 항목은 하루 뒤에 자동으로 삭제됩니다.
              </Text>
            </View>
            {completedTodos.map(item => (
              <Todo
                key={item.id}
                item={item}
                onEdit={onReload}
                onToggleComplete={onReload}
                onDelete={onReload}
              />
            ))}
          </View>
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
    gap: 10,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: colors.light.background.main,
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
});
