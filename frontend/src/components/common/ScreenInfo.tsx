import {StyleSheet, View} from 'react-native';
import {Text} from './Text';
import {spacing} from '@theme/spacing';

interface ScreenInfoProps {
  title: string;
}

function ScreenInfo({title}: ScreenInfoProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text variant="title" weight="bold">
        {title}
      </Text>
    </View>
  );
}

export default ScreenInfo;

const styles = StyleSheet.create({
  container: {marginBottom: spacing.xxl},
});
