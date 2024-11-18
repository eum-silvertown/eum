import { StyleSheet, View } from 'react-native';
import { borderRadius } from '@theme/borderRadius';
import { getResponsiveSize } from '@utils/responsive';
// import DrawingCanvas from './DrawingCanvas';
import { borderWidth } from '@theme/borderWidth';
import { useAuthStore } from '@store/useAuthStore';
import SharedCanvas from './SharedCanvas';

function Blackboard(): React.JSX.Element {
  const roomId = useAuthStore(state => state.userInfo.classInfo.classId);
  const userId = useAuthStore(state => state.userInfo.id);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        {/* <DrawingCanvas /> */}
        <SharedCanvas roomId={roomId.toString()} userId={userId.toString()} />
      </View>
    </View>
  );
}

export default Blackboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: borderWidth.xl,
    borderRadius: borderRadius.lg,
    borderColor: '#775522',
    elevation: getResponsiveSize(3),
    overflow: 'hidden',
  },
});
