import { getResponsiveSize } from '@utils/responsive';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface StudentScore {
    studentId: number;
    studentImage: string;
    studentName: string;
    studentScores: {
        homeworkAvgScore: number;
        testAvgScore: number;
        attitudeAvgScore: number;
    };
}

interface StudentRankProps {
    studentsInfo: StudentScore[];
    onStudentSelect: (scores: StudentScore['studentScores'], name: string) => void; // 이름도 함께 전달
}

const StudentRank = ({ studentsInfo = [], onStudentSelect }: StudentRankProps): React.JSX.Element => {
    const calculateTotalScore = (scores: {
        homeworkAvgScore: number;
        testAvgScore: number;
        attitudeAvgScore: number;
    }) => scores.homeworkAvgScore + scores.testAvgScore + scores.attitudeAvgScore;

    const rankedStudents = [...studentsInfo].sort((a, b) =>
        calculateTotalScore(b.studentScores) - calculateTotalScore(a.studentScores)
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={rankedStudents}
                keyExtractor={(item) => item.studentId.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => onStudentSelect(item.studentScores, item.studentName)}>
                        <View style={styles.studentItem}>
                            <Text style={styles.rank}>{index + 1}위</Text>
                            <Image source={{ uri: item.studentImage }} style={styles.studentImage} />
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
