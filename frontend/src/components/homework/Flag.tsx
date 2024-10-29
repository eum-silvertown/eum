import {StyleSheet, View} from 'react-native';
import {Text} from '../common/Text';
import {spacing} from '@theme/spacing';

interface FlagProps {
  index: number;
  color: string;
  title: string;
}

function Flag({index, color, title}: FlagProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.flag,
        {
          top: `${index * 10}%`,
          backgroundColor: color,
        },
      ]}>
      <Text weight="bold">{title}</Text>
    </View>
  );
}

export default Flag;

const styles = StyleSheet.create({
  flag: {
    position: 'absolute',
    left: '87.5%',
    width: '12.5%',
    height: '8.5%',
    paddingRight: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
