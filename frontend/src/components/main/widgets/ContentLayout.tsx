import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from 'src/hooks/useColors';

interface ContentLayoutProps {
  children: React.ReactNode;
  flex?: number;
  padding?: number;
}

export default function ContentLayout({
  children,
  flex = 1,
  padding = 15,
}: ContentLayoutProps): React.JSX.Element {
  return <View style={[styles.container, {flex, padding}]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    backgroundColor: `${colors.light.background.white}aa`,
  },
});
