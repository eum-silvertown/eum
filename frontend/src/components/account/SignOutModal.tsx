import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import {useModalContext} from 'src/contexts/useModalContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {signOut} from '@services/authService';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

export default function SignOutModal(): React.JSX.Element {
  const {close} = useModalContext();
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();
  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('회원탈퇴가 완료되었습니다.');

      close(); // 모달 닫기
      navigation.navigate('LoginScreen');
      setCurrentScreen('LoginScreen');
    } catch (error) {
      console.log('회원탈퇴를 실패하였습니다.', error);
      Alert.alert('회원탈퇴를 실패하였습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: colors.light.background.danger},
        ]}
        onPress={handleSignOut}>
        <Text weight="bold" color="white">
          탈퇴
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.light.background.main,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: borderRadius.md,
  },
});
