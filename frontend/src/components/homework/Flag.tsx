import {Pressable, StyleSheet, View} from 'react-native';
import {Text} from '../common/Text';
import {memo} from 'react';

interface FlagProps {
  index: number;
  title: string;
  setSelectedFlag: React.Dispatch<React.SetStateAction<number>>;
}

function Flag({index, title, setSelectedFlag}: FlagProps): React.JSX.Element {
  return (
    <View style={[styles.flag]}>
      <Pressable style={styles.press} onPress={() => setSelectedFlag(index)}>
        <Text weight="bold">{title}</Text>
      </Pressable>
    </View>
  );
}

export default memo(Flag);

const styles = StyleSheet.create({
  flag: {
    width: '10%',
    justifyContent: 'center',
  },
  press: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
