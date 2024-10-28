import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();

  // 샘플 데이터 (클래스 리스트)
  const classData = [
    { id: '1', title: '수학 수업' },
    { id: '2', title: '영어 수업' },
    { id: '3', title: '과학 수업' },
  ];

  // 클래스 항목 렌더링
  const renderClassItem = ({ item }: { item: { id: string, title: string } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ClassDetailScreen')}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text>수업을 클릭하여 상세 정보를 확인하세요</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>클래스 목록</Text>
      <FlatList
        data={classData}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default ClassListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
