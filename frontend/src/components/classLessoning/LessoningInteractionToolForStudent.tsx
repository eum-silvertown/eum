import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MikeOffIcon from '@assets/icons/mikeOffIcon.svg';
import MikeOnIcon from '@assets/icons/mikeOnIcon.svg';
import TeacherScreenMoveIcon from '@assets/icons/teacherScreenMoveIcon.svg';
import TeacherScreenOffIcon from '@assets/icons/teacherScreenOffIcon.svg';
import TeacherScreenOnIcon from '@assets/icons/teacherScreenOnIcon.svg';
import StudentGridIcon from '@assets/icons/studentGridIcon.svg';
import DrawingTabletIcon from '@assets/icons/drawingTabletIcon.svg';
import { iconSize } from '@theme/iconSize';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface LessoningInteractionToolForStudentProps {
  onToggleScreen: () => void;
}

const LessoningInteractionToolForStudent = ({ onToggleScreen }: LessoningInteractionToolForStudentProps) => {
  const navigation = useNavigation<NavigationProps>();
  const [isTeacherScreenOn, setIsTeacherScreenOn] = useState(false);

  const handleToggle = () => {
    setIsTeacherScreenOn(prev => !prev); // 로컬 상태 업데이트
    onToggleScreen(); // 상위 컴포넌트로 전달된 콜백 호출
  };

  return (
    <View style={styles.InteractionToolBar}>
      <View style={styles.InteractionContainer}>
        <View style={styles.floatingToolbar}>
          {/* 선생님 필기 On / Off */}
          <TouchableOpacity onPress={handleToggle}>
            {isTeacherScreenOn ? (
              <TeacherScreenOnIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
            ) : (
              <TeacherScreenOffIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
            )}
          </TouchableOpacity>
          {/* 선생님 화면으로 이동 */}
          <TouchableOpacity>
            <TeacherScreenMoveIcon
              width={iconSize.mdPlus}
              height={iconSize.mdPlus}
            />
          </TouchableOpacity>
          {/* 학생 화면 Grid 보기 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('LessoningStudentListScreen')}>
            <StudentGridIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
          </TouchableOpacity>
          {/* 필기 화면 닫기 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('LessoningScreen')}>
            <DrawingTabletIcon
              width={iconSize.mdPlus}
              height={iconSize.mdPlus}
            />
          </TouchableOpacity>
          {/* 녹음 시작/중지 */}
          <TouchableOpacity>
            <MikeOffIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MikeOnIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LessoningInteractionToolForStudent;

const styles = StyleSheet.create({
  InteractionToolBar: {
    ...StyleSheet.absoluteFillObject,
  },
  InteractionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginTop: 4,
    marginHorizontal: 'auto',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
});
