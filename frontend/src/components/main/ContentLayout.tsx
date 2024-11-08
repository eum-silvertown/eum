import React from 'react';
import {StyleSheet, View} from 'react-native';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import {getResponsiveSize} from '@utils/responsive';

interface ContentLayoutProps {
  children: React.ReactNode;
  flex?: number;
  padding?: number;
}

export default function ContentLayout({
  children,
  flex = 1,
  padding = spacing.lg,
}: ContentLayoutProps): React.JSX.Element {
  return <View style={[styles.container, {flex, padding}]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.light.background.white,
    elevation: getResponsiveSize(2),
  },
});
