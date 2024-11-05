import {getResponsiveSize} from '@utils/responsive';
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

interface ColorPickerProps {
  initialColor?: string;
  onColorSelected: (color: string) => void;
}

const CustomColorPicker = forwardRef((props: ColorPickerProps, ref) => {
  const [currentColor, setCurrentColor] = useState<string>(
    props.initialColor || '#FFFFFF',
  );

  useImperativeHandle(ref, () => ({
    revert: () => {
      setCurrentColor(props.initialColor || '#FFFFFF');
    },
  }));

  return (
    <View style={[styles.container]}>
      <ColorPicker
        thumbSize={getResponsiveSize(20)}
        sliderSize={getResponsiveSize(25)}
        color={currentColor}
        onColorChange={setCurrentColor}
        onColorChangeComplete={props.onColorSelected}
        noSnap={false}
        swatchesLast={true}
        shadeSliderThumb={true}
        autoResetSlider={true}
        wheelLoadingIndicator={<ActivityIndicator />}
        sliderLoadingIndicator={<ActivityIndicator />}
        useNativeDriver={true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {        
    
  },
});

export default CustomColorPicker;
