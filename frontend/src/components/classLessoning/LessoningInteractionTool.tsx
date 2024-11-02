import {View, TouchableOpacity, StyleSheet} from 'react-native';
import RecordOffIcon from '@assets/icons/recordOffIcon.svg';
import RecordOnIcon from '@assets/icons/recordOnIcon.svg';
import MikeOffIcon from '@assets/icons/mikeOffIcon.svg';
import MikeOnIcon from '@assets/icons/mikeOnIcon.svg';
import TeacherScreenMoveIcon from '@assets/icons/teacherScreenMoveIcon.svg';
import TeacherScreenOffIcon from '@assets/icons/teacherScreenOffIcon.svg';
import TeacherScreenOnIcon from '@assets/icons/teacherScreenOnIcon.svg';
import StudentGridIcon from '@assets/icons/studentGridIcon.svg';
import DrawingTabletIcon from '@assets/icons/drawingTabletIcon.svg';
import {iconSize} from '@theme/iconSize';

type CanvasComponentProps = {
  startRecording: () => void;
  stopRecording: () => void;
  isRecording: boolean;
};

const LessoningInteractionTool = ({
  startRecording,
  stopRecording,
  isRecording,
}: CanvasComponentProps) => (
  <View style={styles.InteractionToolBar}>
    <View style={styles.InteractionContainer}>
      <View style={styles.floatingToolbar}>
        {/* 선생님 필기 On / OFF */}
        <TouchableOpacity>
          <TeacherScreenOffIcon
            width={iconSize.mdPlus}
            height={iconSize.mdPlus}
          />
          {/* <Text>선생님 필기 Off</Text> */}
        </TouchableOpacity>
        <TouchableOpacity>
          <TeacherScreenOnIcon
            width={iconSize.mdPlus}
            height={iconSize.mdPlus}
          />
          {/* <Text>선생님 필기 On</Text> */}
        </TouchableOpacity>
        {/* 선생님 화면으로 이동 */}
        <TouchableOpacity>
          <TeacherScreenMoveIcon
            width={iconSize.mdPlus}
            height={iconSize.mdPlus}
          />
          {/* <Text>선생님 화면 이동하기</Text> */}
        </TouchableOpacity>
        {/* 학생 화면 Grid / 필기 화면 보기 */}
        <TouchableOpacity>
          <StudentGridIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
        </TouchableOpacity>
        <TouchableOpacity>
          <DrawingTabletIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
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
            <RecordOffIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            <RecordOnIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

export default LessoningInteractionTool;

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
  toolbarButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
