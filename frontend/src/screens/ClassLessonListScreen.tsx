import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { spacing } from '@theme/spacing';
import { iconSize } from '@theme/iconSize';
import { useNavigation, useRoute } from '@react-navigation/native';
import LessonIcon from '@assets/icons/lessonIcon.svg';
import EmptyLessonIcon from '@assets/icons/emptyLessonIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';
interface Lesson {
  lessonId: number;
  title: string;
  questions: number[];
}

interface RouteParams {
  data: Lesson[];
}

const ClassLessonListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data: lessons } = route.params as RouteParams;
  console.log('lessons', lessons);

  const handleLessonPress = (lessonId: number) => {
    // navigation.navigate('LessonDetail', { lessonId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity>
        <HeaderText variant="title" style={styles.headerText} weight="bold">
          <Text>
            수업 목록
          </Text>
        </HeaderText>
      </View>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.lessonId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleLessonPress(item.lessonId)}>
            <View style={styles.cardContent}>
              <LessonIcon width={iconSize.md} height={iconSize.md} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.questionsCount}>문제 개수: {item.questions.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyLessonIcon width={iconSize.xxl * 7} height={iconSize.xxl * 7} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>현재 등록된 수업이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#F9F9F9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: spacing.md },
  card: {
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  questionsCount: { fontSize: 14, color: '#666', marginTop: spacing.xs },
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

export default ClassLessonListScreen;
