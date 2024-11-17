import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { getResponsiveSize } from '@utils/responsive';
import { useNavigation } from '@react-navigation/native';
import PencilIcon from '@assets/icons/pencilIcon.svg';

interface LessoningInteractionToolForStudentProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  toggleTeacherSolution: () => void;
  toggleStudentSolution: () => void;
  showTeacherSolution: boolean;
  showStudentSolution: boolean;
  role: string;
}

const StudentReviewInteractionTool = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  toggleTeacherSolution,
  toggleStudentSolution,
  showTeacherSolution,
  showStudentSolution,
  role,
}: LessoningInteractionToolForStudentProps) => {
  const navigation = useNavigation();

  const handleExit = () => {
    Alert.alert(
      '나가기',
      '추가로 필기한 데이터는 저장되지 않습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '나가기',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <View style={styles.InteractionToolBar}>
      <View style={styles.InteractionContainer}>
        <View style={styles.floatingToolbar}>
          {/* 문제 페이지 설정 */}
          <View style={styles.pageControlContainer}>
            <TouchableOpacity
              onPress={onPrevPage}
              disabled={currentPage === 1}
              style={styles.pageButton}>
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === 1 && styles.disabledText,
                ]}>
                이전
              </Text>
            </TouchableOpacity>

            <Text style={styles.pageInfoText}>
              {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
              onPress={onNextPage}
              disabled={currentPage === totalPages}
              style={styles.pageButton}>
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === totalPages && styles.disabledText,
                ]}>
                다음
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={toggleTeacherSolution}
            style={styles.iconButton}>
            <PencilIcon width={24} height={24} />
            <Text style={styles.iconButtonText}>
              {role === 'TEACHER'
                ? showTeacherSolution
                  ? '필기 숨기기'
                  : '필기 보기'
                : showTeacherSolution
                  ? '선생님 필기 숨기기'
                  : '선생님 필기 보기'}
            </Text>
          </TouchableOpacity>

          {/* 학생 필기 보기 버튼 */}
          {role === 'STUDENT' &&
            <TouchableOpacity
              onPress={toggleStudentSolution}
              style={styles.iconButton}>
              <PencilIcon width={24} height={24} />
              <Text style={styles.iconButtonText}>
                {showStudentSolution ? '학생 필기 숨기기' : '학생 필기 보기'}
              </Text>
            </TouchableOpacity>
          }

          {/* 나가기 버튼 */}
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>나가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StudentReviewInteractionTool;

const styles = StyleSheet.create({
  InteractionToolBar: {
    ...StyleSheet.absoluteFillObject,
  },
  InteractionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: getResponsiveSize(12),
    marginTop: getResponsiveSize(6),
    marginHorizontal: 'auto',
    padding: getResponsiveSize(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: getResponsiveSize(4) },
    shadowOpacity: 0.1,
    shadowRadius: getResponsiveSize(4),
    elevation: 4,
  },
  floatingToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
  },
  pageControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageInfoText: {
    marginHorizontal: getResponsiveSize(12),
    fontSize: getResponsiveSize(14),
    fontWeight: '600',
    color: '#333',
  },
  pageButton: {
    paddingVertical: getResponsiveSize(8),
    paddingHorizontal: getResponsiveSize(16),
    borderRadius: getResponsiveSize(8),
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
  },
  pageButtonText: {
    fontSize: getResponsiveSize(14),
    color: '#2E2559',
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2E2559',
    fontWeight: '600',
  },
  exitButton: {
    paddingVertical: getResponsiveSize(8),
    paddingHorizontal: getResponsiveSize(16),
    borderRadius: getResponsiveSize(8),
    backgroundColor: '#FF6F61',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: getResponsiveSize(14),
    color: '#FFF',
    fontWeight: 'bold',
  },
});
