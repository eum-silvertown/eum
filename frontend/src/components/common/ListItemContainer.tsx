import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import {StyleSheet, View} from 'react-native';
import {ViewProps} from 'react-native-svg/lib/typescript/fabric/utils';

interface ListItemContainerProps extends ViewProps {
  variant: 'homework' | 'userinfo';
  children: React.ReactNode;
}

function ListItemContainer({
  variant,
  children,
  style,
  ...props
}: ListItemContainerProps): React.JSX.Element {
  return (
    <View style={[styles.common, styles[variant], style]} {...props}>
      {children}
    </View>
  );
}

export default ListItemContainer;

const styles = StyleSheet.create({
  common: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: borderRadius.sm,
  },
  homework: {
    width: '90%',
    height: getResponsiveSize(75),
    marginHorizontal: spacing.lg,
    borderBottomWidth: borderWidth.sm,
    borderColor: '#00000020',
  },
  userinfo: {
    height: getResponsiveSize(75),
    paddingVertical: spacing.md * 1.2,
    paddingHorizontal: spacing.xxl,
  },
});
