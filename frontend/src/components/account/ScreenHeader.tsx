import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface ScreenHeaderProps {
  title: string;
}

function ScreenHeader({title}: ScreenHeaderProps): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <BackArrowIcon />
      </TouchableOpacity>
      <Text variant="title" style={styles.headerText} weight="bold">
        {title}
      </Text>
    </View>
  );
}

export default ScreenHeader;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 25,
    left: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
  },
});
