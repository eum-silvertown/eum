import {Image, StyleSheet, View} from 'react-native';
import BlackboardImage from '@assets/images/blackboard.png';
import {spacing} from '@theme/spacing';

function Blackboard(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image source={BlackboardImage} style={styles.blackboard} />
    </View>
  );
}

export default Blackboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blackboard: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  blackboardContent: {
    position: 'absolute',
    left: spacing.lg,
    padding: spacing.xl,
  },
});
