import Button from '@components/common/Button';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {typography} from '@theme/typography';
import {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {colors} from 'src/hooks/useColors';

function CreateFolder(): React.JSX.Element {
  const [folderName, setFolderName] = useState('');

  const onChangeText = (inputText: string) => {
    setFolderName(inputText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        value={folderName}
        placeholder="이름을 입력하세요."
        keyboardType="default"
        style={styles.input}
      />
      <Button content="생성 완료" variant="pressable" size="full" />
    </View>
  );
}

export default CreateFolder;

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingTop: spacing.xl,
  },
  input: {
    padding: spacing.lg,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.md,
    fontSize: typography.size.body,
  },
});
