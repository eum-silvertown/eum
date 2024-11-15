import {StyleSheet, View} from 'react-native';

import DrawingCanvas from './DrawingCanvas';

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
    borderWidth: 5,
    borderRadius: 15,
    borderColor: '#775522',
    elevation: 4,
    overflow: 'hidden',
  },
});
