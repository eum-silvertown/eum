import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import StudentGridIcon from '@assets/icons/studentGridIcon.svg';
import {iconSize} from '@theme/iconSize';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

type CanvasComponentProps = {
  startRecording?: () => void;
  stopRecording?: () => void;
  isRecording?: boolean;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
};

const TeacherLessoningInteractionTool = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: CanvasComponentProps) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.InteractionToolBar}>
      <View style={styles.InteractionContainer}>
        <View style={styles.floatingToolbar}>
          {/* 학생 화면 Grid 보기 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('LessoningStudentListScreen')}>
            <StudentGridIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
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
        </View>
      </View>
    </View>
  );
};

export default TeacherLessoningInteractionTool;

const styles = StyleSheet.create({
  InteractionToolBar: {
    ...StyleSheet.absoluteFillObject,
  },
  InteractionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginTop: 5,
    marginHorizontal: 'auto',
    padding: 16,
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
    marginHorizontal: 24,
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
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 11,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
  },
  disabledText: {
    color: '#999',
  },
  exitButton: {
    padding: 5,
    borderRadius: 11,
    backgroundColor: '#FFCDD2', // 퇴장 버튼 강조 색상
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
