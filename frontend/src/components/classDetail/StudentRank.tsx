import { getResponsiveSize } from '@utils/responsive';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import PersonIcon from '@assets/icons/personIcon.svg';
import { StudentOverviewType } from 'src/services/lectureInformation';

interface StudentRankProps {
  studentsInfo?: StudentOverviewType[];
  onStudentSelect: (
    scores: StudentOverviewType['studentScores'],
    name: string,
  ) => void; // 이름도 함께 전달
}

const StudentRank = ({
  studentsInfo = [],
  onStudentSelect,
}: StudentRankProps): React.JSX.Element => {
  const calculateTotalScore = (scores: {
    homeworkAvgScore: number;
    examAvgScore: number;
    attitudeAvgScore: number;
  }) => scores.homeworkAvgScore + scores.examAvgScore + scores.attitudeAvgScore;

  const rankedStudents = [...studentsInfo].sort(
    (a, b) =>
      calculateTotalScore(b.studentScores) -
      calculateTotalScore(a.studentScores),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rankedStudents}
        keyExtractor={item => item.studentId.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              onStudentSelect(item.studentScores, item.studentName)
            }>
            <View style={styles.studentItem}>
              <Text style={styles.rank}>{index + 1}등</Text>
              {item.studentImage ? (
                <Image source={{ uri: item.studentImage }} style={styles.studentImage} />
              ) : (
                <PersonIcon width={32} height={32} style={styles.studentImage} />
              )}
              <Text style={styles.studentName}>{item.studentName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(8),
    borderRadius: 8,
  },
  listContainer: {
    flexDirection: 'row',
  },
  studentItem: {
    alignItems: 'center',
    marginRight: getResponsiveSize(12),
  },
  rank: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: getResponsiveSize(4),
  },
  studentImage: {
    width: getResponsiveSize(32),
    height: getResponsiveSize(32),
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: getResponsiveSize(8),
  },
  studentName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default StudentRank;
