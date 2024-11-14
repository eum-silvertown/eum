import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  TextInput,
} from 'react-native';
import TeacherScreenMoveIcon from '@assets/icons/teacherScreenMoveIcon.svg';
import TeacherScreenOffIcon from '@assets/icons/teacherScreenOffIcon.svg';
import TeacherScreenOnIcon from '@assets/icons/teacherScreenOnIcon.svg';
import {iconSize} from '@theme/iconSize';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {getResponsiveSize} from '@utils/responsive';
import {useQueryClient} from '@tanstack/react-query';
import {useLessonStore} from '@store/useLessonStore';
type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface LessoningInteractionToolForStudentProps {
  onToggleScreen: () => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const StudentLessoningInteractionTool = ({
  onToggleScreen,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: LessoningInteractionToolForStudentProps) => {
  const navigation = useNavigation<NavigationProps>();
  const [isTeacherScreenOn, setIsTeacherScreenOn] = useState(false);
  const queryClient = useQueryClient();
  const lectureId = useLessonStore(state => state.lectureId);

  const handleExit = () => {
    queryClient.invalidateQueries({
      queryKey: ['lectureDetail', lectureId],
    });
    navigation.goBack();
  };

  const handleToggle = () => {
    setIsTeacherScreenOn(prev => !prev); // 로컬 상태 업데이트
    onToggleScreen(); // 상위 컴포넌트로 전달된 콜백 호출
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const handleInputAnswer = () => {
    setIsModalVisible(true); // 모달 열기
  };

  const handleSubmitAnswer = () => {
    console.log('Submitted Answer:', answerText);
    // 답변 제출 로직 추가 가능
    setAnswerText(''); // 입력 창 초기화
    setIsModalVisible(false); // 모달 닫기
  };

  return (
    <View style={styles.InteractionToolBar}>
      <View style={styles.InteractionContainer}>
        <View style={styles.floatingToolbar}>
          {/* 선생님 필기 On / Off */}
          <TouchableOpacity onPress={handleToggle}>
            {isTeacherScreenOn ? (
              <TeacherScreenOnIcon
                width={iconSize.mdPlus}
                height={iconSize.mdPlus}
              />
            ) : (
              <TeacherScreenOffIcon
                width={iconSize.mdPlus}
                height={iconSize.mdPlus}
              />
            )}
          </TouchableOpacity>
          {/* 선생님 화면으로 이동 */}
          <TouchableOpacity>
            <TeacherScreenMoveIcon
              width={iconSize.mdPlus}
              height={iconSize.mdPlus}
            />
          </TouchableOpacity>
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
          {/* 정답 입력 버튼 */}
          <TouchableOpacity
            onPress={handleInputAnswer}
            style={styles.inputButton}>
            <Text style={styles.inputButtonText}>정답 입력하기</Text>
          </TouchableOpacity>
          {/* 퇴장 버튼 */}
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>수업 퇴장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 답변 입력 모달 */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>정답을 입력하세요</Text>
            <TextInput
              style={styles.input}
              value={answerText}
              onChangeText={setAnswerText}
              placeholder="답을 입력하세요"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitAnswer}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>제출</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StudentLessoningInteractionTool;

const styles = StyleSheet.create({
  InteractionToolBar: {
    ...StyleSheet.absoluteFillObject,
  },
  InteractionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginTop: getResponsiveSize(6),
    marginHorizontal: 'auto',
    padding: getResponsiveSize(12),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginHorizontal: getResponsiveSize(18),
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pageButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  pageButton: {
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(18),
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
  },
  disabledText: {
    color: '#999',
  },
  exitButton: {
    padding: getResponsiveSize(6),
    borderRadius: 8,
    backgroundColor: '#FFCDD2', // 퇴장 버튼 강조 색상
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  inputButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#d7ffcd',
    alignItems: 'center',
  },
  inputButtonText: {
    fontSize: 12,
    color: '#2fd355',
    fontWeight: 'bold',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: getResponsiveSize(32),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: getResponsiveSize(16),
  },
  input: {
    width: '100%',
    padding: getResponsiveSize(16),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: getResponsiveSize(32),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: getResponsiveSize(16),
    marginRight: getResponsiveSize(8),
    backgroundColor: '#FFCDD2',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: getResponsiveSize(16),
    marginLeft: getResponsiveSize(8),
    backgroundColor: '#C8E6C9',
    borderRadius: getResponsiveSize(8),
  },
  submitButtonText: {
    color: '#388E3C',
    fontWeight: 'bold',
  },
});
