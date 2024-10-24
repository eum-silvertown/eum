import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import {StyleSheet, View} from 'react-native';

interface ListItemContainerProps {
  variant: 'homework' | 'question' | 'userinfo';
  children: React.ReactNode;
}

function ListItemContainer({
  variant,
  children,
}: ListItemContainerProps): React.JSX.Element {
  return <View style={[styles.common, styles[variant]]}>{children}</View>;
}

export default ListItemContainer;

const styles = StyleSheet.create({
  common: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.md * 1.2,
    paddingHorizontal: spacing.xl,
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.sm,
    borderStyle: 'solid',
  },
  homework: {
    height: getResponsiveSize(75),
  },
  question: {
    height: getResponsiveSize(60),
  },
  userinfo: {
    height: getResponsiveSize(75),
    paddingHorizontal: spacing.xxl,
  },
});
