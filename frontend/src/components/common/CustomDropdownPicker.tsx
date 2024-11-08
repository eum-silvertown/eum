import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@theme/spacing';
import { colors } from 'src/hooks/useColors';
import { borderWidth } from '@theme/borderWidth';
import { getResponsiveSize } from '@utils/responsive';

interface CustomDropdownPickerProps {
  items: { label: string; value: string }[]; // 드롭다운 항목
  placeholder?: string;                      // 기본 표시 텍스트
  onSelectItem: (value: string) => void;     // 선택 항목 변경 시 콜백
  defaultValue?: string;                     // 초기 선택 값
}

const CustomDropdownPicker = ({
  items,
  placeholder = '선택하세요', // 기본 플레이스홀더
  onSelectItem,
  defaultValue,
}: CustomDropdownPickerProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || null);

  const handleSelectItem = (itemValue: any) => {
    setValue(itemValue);
    onSelectItem(itemValue);
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={handleSelectItem}
        placeholder={placeholder}
        style={styles.dropdownStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        textStyle={styles.textStyle}
        placeholderStyle={styles.placeholderStyle}
        labelStyle={styles.labelStyle}
        selectedItemLabelStyle={styles.selectedItemLabelStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  dropdownStyle: {
    backgroundColor: 'white',
    borderColor: colors.light.background.main,
    borderWidth: borderWidth.xs,    
  },
  dropDownContainerStyle: {
    backgroundColor: 'white',
    borderColor: colors.light.background.main,
  },
  textStyle: {
    color: colors.light.background.main,
    fontSize: getResponsiveSize(8),
  },
  placeholderStyle: {
    color: '#888',
    fontSize: getResponsiveSize(8),
  },
  labelStyle: {
    color: colors.light.background.main,
    fontSize: getResponsiveSize(8),
  },
  selectedItemLabelStyle: {    
    color: '#007AFF',
  },
});

export default CustomDropdownPicker;
