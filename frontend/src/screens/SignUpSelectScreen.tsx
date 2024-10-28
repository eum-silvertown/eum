import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Text } from '@components/common/Text';
import { StyleSheet } from 'react-native';
import { spacing } from '@theme/spacing';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { colors } from 'src/hooks/useColors';
import signUpStudentImage from '@assets/images/signUpStudentImage.png';
import signUpTeacherImage from '@assets/images/signUpTeacherImage.png';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SignUpSelectScreen(): React.JSX.Element {
    const navigation = useNavigation<NavigationProps>();
    const {setCurrentScreen} = useCurrentScreenStore();  

    const moveSignUpScreen = (userType: 'teacher' | 'student') => {
      navigation.navigate('SignUpScreen', { userType });
      setCurrentScreen('SignUpScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text variant="title" style={styles.headerText} weight="bold">
                    회원가입
                </Text>
            </View>

            <View style={styles.selectionContainer}>
                {/* 선생님 가입 섹션 */}
                <SignUpOption
                    imageSource={signUpTeacherImage}
                    buttonText="선생님으로 가입하기"
                    onPress={() => moveSignUpScreen('teacher')}
                />

                {/* 중앙 구분선 */}
                <View style={styles.divider} />

                {/* 학생 가입 섹션 */}
                <SignUpOption
                    imageSource={signUpStudentImage}
                    buttonText="학생으로 가입하기"
                    onPress={() => moveSignUpScreen('student')}
                />
            </View>
        </View>
    );
}

interface SignUpOptionProps {
    imageSource: any;
    buttonText: string;
    onPress: () => void;
}

const SignUpOption = ({ imageSource, buttonText, onPress }: SignUpOptionProps) => (
    <View style={styles.optionContainer}>
        <Image source={imageSource} style={styles.image} />
        <TouchableOpacity style={styles.submitButton} onPress={onPress}>
            <Text style={styles.submitButtonText} weight="bold">
                {buttonText}
            </Text>
        </TouchableOpacity>
    </View>
);

export default SignUpSelectScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: spacing.xl,
        left: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: spacing.sm,
    },
    selectionContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionContainer: {
        width: '48%',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    divider: {
        width: 1,
        backgroundColor: '#C1C1C1',
        height: '80%',
        marginHorizontal: spacing.sm,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
    },
    submitButton: {
        backgroundColor: colors.dark.background.main,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        marginTop: spacing.md,
    },
    image: {
        width: '100%', // 고정된 비율을 적용
        height: '70%',
        resizeMode: 'contain',
        marginBottom: spacing.sm,
    },
});
