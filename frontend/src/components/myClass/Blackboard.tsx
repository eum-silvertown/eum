import {Image, StyleSheet, View} from 'react-native';
import BlackboardImage from '@assets/images/blackboard.png';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';

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
    width: '100%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: borderRadius.xxl,
    elevation: getResponsiveSize(2),
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
