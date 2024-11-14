import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from 'src/hooks/useColors';
import {borderWidth} from '@theme/borderWidth';
import {getResponsiveSize} from '@utils/responsive';
import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';

interface CustomDropdownPickerProps {
  label?: string;
  items: {label: string; value: string}[]; // 드롭다운 항목
  onSelectItem: (value: string) => void; // 선택 항목 변경 시 콜백
  defaultValue?: string; // 초기 선택 값
  containerStyle?: ViewStyle; // 컨테이너 스타일
  dropdownStyle?: ViewStyle; // 드롭다운 스타일
}

const CustomDropdownPicker = ({
  label,
  items,
  onSelectItem,
  defaultValue,
  containerStyle,
  dropdownStyle,
}: CustomDropdownPickerProps): React.JSX.Element => {
  const [value, setValue] = React.useState(defaultValue || '');

  const handleSelectItem = (itemValue: string) => {
    setValue(itemValue);
    onSelectItem(itemValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="subtitle" weight="bold" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[styles.pickerContainer, dropdownStyle]}>
        <Picker
          mode="dropdown"
          selectedValue={value}
          onValueChange={handleSelectItem}
          style={styles.picker}>
          {items.map((item, index) => (
            <Picker.Item
              style={styles.pickerContent}
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: colors.light.background.main,
    borderWidth: borderWidth.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'white',
    height: getResponsiveSize(40),
    justifyContent: 'center',
  },
  picker: {
    color: colors.light.background.main,
  },
  pickerContent: {
    fontSize: getResponsiveSize(12),
  },

  label: {
    marginBottom: 5,
  },
});

export default CustomDropdownPicker;
