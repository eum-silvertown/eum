import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import RecordOffIcon from '@assets/icons/recordOffIcon.svg';
import RecordOnIcon from '@assets/icons/recordOnIcon.svg';
import MikeOffIcon from '@assets/icons/mikeOffIcon.svg';
import MikeOnIcon from '@assets/icons/mikeOnIcon.svg';
import DrawingTabletIcon from '@assets/icons/drawingTabletIcon.svg';
import {iconSize} from '@theme/iconSize';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

type CanvasComponentProps = {
  startRecording?: () => void;
  stopRecording?: () => void;
  isRecording?: boolean;
};

const TeacherLessoningGridInteractionTool = ({
  startRecording,
  stopRecording,
  isRecording,
}: CanvasComponentProps) => {
  const navigation = useNavigation<NavigationProps>();

  const handleExit = () => {
    navigation.navigate('ClassDetailScreen');
  };

  return (
    <View style={styles.InteractionToolBar}>
      <View style={styles.InteractionContainer}>
        <View style={styles.floatingToolbar}>
          {/* 필기 화면 닫기 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('LessoningScreen')}>
            <DrawingTabletIcon
              width={iconSize.mdPlus}
              height={iconSize.mdPlus}
            />
          </TouchableOpacity>
          {/* 녹음 시작/중지 */}
          <TouchableOpacity>
            <MikeOffIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MikeOnIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
          </TouchableOpacity>
          {/* 녹화 시작/중지 */}
          {isRecording ? (
            <TouchableOpacity onPress={stopRecording}>
              <RecordOnIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              <RecordOffIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
            </TouchableOpacity>
          )}

          {/* 종료 버튼 */}
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
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
    marginTop: 4,
    marginHorizontal: 'auto',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  pageControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageInfoText: {
    marginHorizontal: 12,
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
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
  },
  disabledText: {
    color: '#999',
  },
  exitButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FFCDD2', // 퇴장 버튼 강조 색상
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
