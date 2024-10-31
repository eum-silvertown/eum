import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@theme/spacing';
import { borderWidth } from '@theme/borderWidth';
import { borderRadius } from '@theme/borderRadius';
import { colors } from 'src/hooks/useColors';

interface ContentLayoutProps {
  children: React.ReactNode;  
  flex?: number;
}

export default function ContentLayout({ children, flex = 1 }: ContentLayoutProps): React.JSX.Element {
  return (
    <View style={[styles.container, { flex }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.light.background.white,
    borderColor: colors.light.borderColor.pickerBorder,
    elevation: 3,
  },
});
