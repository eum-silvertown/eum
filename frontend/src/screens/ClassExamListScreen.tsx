import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { spacing } from '@theme/spacing';
import { useNavigation, useRoute } from '@react-navigation/native';
import { iconSize } from '@theme/iconSize';
import CalendarIcon from '@assets/icons/calendarIcon.svg';
import EmptyExamIcon from '@assets/icons/emptyExamIcon.svg'; // SVG 아이콘 임포트
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from "@components/common/Text";

interface Exam {
  examId: string;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
}

interface RouteParams {
  data: Exam[];
}

const ClassExamListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data: exams } = route.params as RouteParams;

  const handleExamPress = (examId: string) => {
    // navigation.navigate('ExamDetail', { examId });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon />
          </TouchableOpacity>
          <HeaderText variant="title" style={styles.headerText} weight="bold">
            <Text>
              시험 목록
            </Text>
          </HeaderText>
        </View>
        <FlatList
          data={exams}
          keyExtractor={(item) => item.examId}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleExamPress(item.examId)}>
              <View style={styles.itemHeader}>
                <CalendarIcon width={iconSize.sm} height={iconSize.sm} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              <Text style={styles.itemText}>시작 시간: {new Date(item.startTime).toLocaleString()}</Text>
              <Text style={styles.itemText}>종료 시간: {new Date(item.endTime).toLocaleString()}</Text>
              <Text style={styles.itemText}>문제 개수: {item.questions.length}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyExamIcon width={iconSize.xxl * 7} height={iconSize.xxl * 7} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>현재 등록된 시험이 없습니다.</Text>
            </View>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: spacing.md, color: '#333' },
  item: {
    padding: spacing.md,
    backgroundColor: '#E8F4FA',
    marginBottom: spacing.sm,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: spacing.sm },
  itemText: { fontSize: 14, color: '#666' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  header: {
    marginTop: spacing.xl,
    marginLeft: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: spacing.md,
  },
});

export default ClassExamListScreen;
