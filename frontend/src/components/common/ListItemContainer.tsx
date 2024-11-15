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
    borderRadius: 5,
  },
  homework: {
    width: '95%',
    height: 119,
    borderBottomWidth: 1,
    borderColor: '#00000020',
  },
  userinfo: {
    height: 119,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
});
