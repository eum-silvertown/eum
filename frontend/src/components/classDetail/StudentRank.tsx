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
import { StudentOverviewType } from '@services/lectureInformation';
import First from '@assets/images/first.png';
import Second from '@assets/images/second.png';
import Third from '@assets/images/third.png';
import { SvgUri } from 'react-native-svg';
import { colors } from '@hooks/useColors';

interface StudentRankProps {
  studentsInfo?: StudentOverviewType[];
  onStudentSelect: (
    scores: StudentOverviewType['studentScores'],
    name: string,
  ) => void;
}
const StudentRank = ({
  studentsInfo = [],
  onStudentSelect,
}: StudentRankProps): React.JSX.Element => {
  studentsInfo.map(data => console.log(data.studentId, data.studentImage));
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
              <View style={styles.imageContainer}>
                <Text style={styles.rank}>{index + 1}등</Text>
                {item.studentImage ? (
                  item.studentImage.endsWith('.svg') ? (
                    // eslint-disable-next-line react-native/no-inline-styles
                    <SvgUri
                      uri={item.studentImage}
                      width={32}
                      height={32}
                      style={{
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: '#ddd',
                      }}
                    />
                  ) : (
                    <Image
                      source={{ uri: item.studentImage }}
                      width={32}
                      height={32}
                      style={styles.studentImage}
                    />
                  )
                ) : (
                  <PersonIcon
                    width={32}
                    height={32}
                    style={styles.studentImage}
                  />
                )}

                {/* 1~3등 아이콘을 오른쪽 하단에 겹쳐서 표시 */}
                {index === 0 ? (
                  <Image source={First} style={styles.rankIcon} />
                ) : index === 1 ? (
                  <Image source={Second} style={styles.rankIcon} />
                ) : index === 2 ? (
                  <Image source={Third} style={styles.rankIcon} />
                ) : null}
              </View>
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
    padding: getResponsiveSize(16),
    borderRadius: 8,
  },
  listContainer: {
    flexDirection: 'row',
  },
  studentItem: {
    alignItems: 'center',
    marginRight: getResponsiveSize(18),
  },
  imageContainer: {
    position: 'relative', // 컨테이너를 상대 위치로 설정
    width: getResponsiveSize(50),
    height: getResponsiveSize(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentImage: {
    width: getResponsiveSize(50),
    height: getResponsiveSize(50),
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rank: {
    position: 'absolute',
    top: -3, // 이미지 상단에 배치
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  rankIcon: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    width: getResponsiveSize(18),
    height: getResponsiveSize(18),
  },
  studentName: {
    top: -4,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.light.text.main,
  },
});

export default StudentRank;
