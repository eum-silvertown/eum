import {View, TouchableOpacity, StyleSheet, Text, Alert} from 'react-native';
import DrawingTabletIcon from '@assets/icons/drawingTabletIcon.svg';
import {iconSize} from '@theme/iconSize';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {getResponsiveSize} from '@utils/responsive';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  SwitchLessonStatusResponse,
  switchLessonStatus,
} from '@services/lessonService';
import {useLessonStore} from '@store/useLessonStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;
type LectureInfoProps = {
  lectureId: number;
};

const TeacherLessoningGridInteractionTool = ({lectureId}: LectureInfoProps) => {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const setIsTeaching = useLessonStore(state => state.setIsTeaching);

  const handleExit = () => {
    navigation.goBack();
    setIsTeaching(false);
  };

  // 수업 상태 변경
  const switchLectureStatusMutation = useMutation({
    mutationFn: (moveLectureId: number) => switchLessonStatus(moveLectureId),
    onSuccess: (data: SwitchLessonStatusResponse) => {
      console.log('수업 상태 변경 완료:', data.message);
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      handleExit();
    },
    onError: error => {
      console.error('수업 상태 변경 실패:', error);
    },
  });
  const handleSwitchLectureStatus = () => {
    switchLectureStatusMutation.mutate(lectureId);
  };

  const handleExitConfirmation = () => {
    Alert.alert(
      '수업 종료 확인',
      '정말로 수업을 종료하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '확인', onPress: handleSwitchLectureStatus},
      ],
      {cancelable: true},
    );
  };

  const intoTeacherDrawing = () => {
    setIsTeaching(false);
    navigation.navigate('LessoningScreen');
  };

  return (
    <View style={styles.InteractionToolBar}>
      <View style={styles.InteractionContainer}>
        <View style={styles.floatingToolbar}>
          {/* 필기 화면 닫기 */}
          <TouchableOpacity
            style={styles.iconTouchLayout}
            onPress={intoTeacherDrawing}>
            <DrawingTabletIcon
              width={iconSize.mdPlus}
              height={iconSize.mdPlus}
            />
            <Text style={styles.btnTitle}>문제 페이지 이동하기</Text>
          </TouchableOpacity>
          {/* 종료 버튼 */}
          <TouchableOpacity
            onPress={handleExitConfirmation}
            style={styles.exitButton}>
            <Text style={styles.exitButtonText}>수업 종료하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TeacherLessoningGridInteractionTool;

const styles = StyleSheet.create({
  InteractionToolBar: {
    ...StyleSheet.absoluteFillObject,
  },
  InteractionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginTop: getResponsiveSize(4),
    marginHorizontal: 'auto',
    padding: getResponsiveSize(8),
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
    marginHorizontal: getResponsiveSize(12),
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
    paddingVertical: getResponsiveSize(4),
    paddingHorizontal: getResponsiveSize(12),
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
  },
  disabledText: {
    color: '#999',
  },
  exitButton: {
    padding: getResponsiveSize(4),
    borderRadius: 8,
    backgroundColor: '#FFCDD2',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  btnTitle: {
    marginRight: 'auto',
  },
  iconTouchLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
