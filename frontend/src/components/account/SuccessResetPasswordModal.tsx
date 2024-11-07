import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {useModalContext} from 'src/contexts/useModalContext';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';

type NavigationProps = NativeStackNavigationProp<ScreenType>;


export default function SuccessResetPasswordModal(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();
  const {close} = useModalContext();

  const handleToLogin = () => {
    close();
    navigation.navigate('LoginScreen');
    setCurrentScreen('LoginScreen');
  };

  return (
    <View>
      <Text>이메일을 확인해주세요.</Text>
      <View style={styles.moveOptions}>
        <TouchableOpacity onPress={handleToLogin}>
          <Text>로그인 하러가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  moveOptions: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
