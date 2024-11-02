import {View, TouchableOpacity, StyleSheet} from 'react-native';
import RecordOffIcon from '@assets/icons/recordOffIcon.svg';
import RecordOnIcon from '@assets/icons/recordOnIcon.svg';

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
      {/* 툴바 */}
      <View style={styles.floatingToolbar}>
        {/* 녹화 시작/중지 버튼 */}
        {isRecording ? (
          <TouchableOpacity onPress={stopRecording}>
            <RecordOffIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={startRecording}>
            <RecordOnIcon />
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
  InteractionContainer: {backgroundColor: 'transparent'},
  floatingToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
