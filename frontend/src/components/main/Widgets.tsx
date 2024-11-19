import {Animated, StyleSheet, useWindowDimensions, View} from 'react-native';
import TodoList from './widgets/TodoList';
import Weather from './widgets/Weather';
import MainHeader from './MainHeader';
import CustomCalendar from './widgets/CustomCalendar';
import {getTodos} from '@services/todoService';

interface WidgetsProps {
  isNightTime: Animated.AnimatedInterpolation<string | number>;
}
import React, {useEffect, useState} from 'react';

export default function Widgets({
  isNightTime,
}: WidgetsProps): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [notCompletedTodos, setNotCompletedTodos] = useState([]);
  const [homeworkTodoResponseList, setHomeworkTodoResponseList] = useState([]);

  // 데이터 로드 함수
  const loadTodos = async () => {
    try {
      const response = await getTodos();
      setCompletedTodos(response.data.completedTodoResponseList);
      setNotCompletedTodos(response.data.notCompletedTodoResponseList);
      setHomeworkTodoResponseList(response.data.homeworkTodoResponseList);
    } catch (error) {
      console.error('투두 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <MainHeader isNightTime={isNightTime} />
      <View style={styles.widgetContainer}>
        <TodoList
          completedTodos={completedTodos}
          notCompletedTodos={notCompletedTodos}
          homeworkTodoResponseList={homeworkTodoResponseList}
          onReload={loadTodos}
        />
        <Weather />
        <CustomCalendar
          homeworkTodoResponseList={homeworkTodoResponseList}
        />
      </View>
    </View>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      height: '50%',
    },
    widgetContainer: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      gap: width * 0.01,
      paddingHorizontal: width * 0.015,
    },
  });
