import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { spacing } from '@theme/spacing';
import { iconSize } from '@theme/iconSize';
import { useNavigation, useRoute } from '@react-navigation/native';
import ClockIcon from '@assets/icons/clockIcon.svg';
import QuestionsIcon from '@assets/icons/questionsIcon.svg';
import EmptyHomeworkIcon from '@assets/icons/emptyHomeworkIcon.svg';

interface Homework {
  homeworkId: string;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
}

interface RouteParams {
  data: Homework[];
}

const ClassHomeworkListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data: homework } = route.params as RouteParams;
  console.log('homework', homework);

  const handleHomeworkPress = (homeworkId: string) => {
    // navigation.navigate('HomeworkDetail', { homeworkId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>숙제 목록</Text>
      <FlatList
        data={homework}
        keyExtractor={(item) => item.homeworkId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleHomeworkPress(item.homeworkId)}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.iconRow}>
              <ClockIcon width={iconSize.sm} height={iconSize.sm} />
              <Text style={styles.itemText}>시작 시간: {new Date(item.startTime).toLocaleString()}</Text>
            </View>
            <View style={styles.iconRow}>
              <ClockIcon width={iconSize.sm} height={iconSize.sm} />
              <Text style={styles.itemText}>종료 시간: {new Date(item.endTime).toLocaleString()}</Text>
            </View>
            <View style={styles.iconRow}>
              <QuestionsIcon width={iconSize.sm} height={iconSize.sm} />
              <Text style={styles.itemText}>문제 개수: {item.questions.length}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyHomeworkIcon width={iconSize.xxl * 7} height={iconSize.xxl * 7} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>현재 등록된 숙제가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: spacing.md },
  item: {
    padding: spacing.md,
    backgroundColor: '#FEE7E7',
    marginBottom: spacing.sm,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: spacing.sm },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemText: { fontSize: 14, color: '#666', marginLeft: spacing.sm },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default ClassHomeworkListScreen;
