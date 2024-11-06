import {StyleSheet, View} from 'react-native';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';
import DrawingCanvas from './DrawingCanvas';
import {borderWidth} from '@theme/borderWidth';

function Blackboard(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <DrawingCanvas />
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
    elevation: getResponsiveSize(2),
    overflow: 'hidden',
  },
});
