import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';

function HomeworkScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text variant="title" weight="bold">
        숙제
      </Text>
    </View>
  );
}

export default HomeworkScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
});
