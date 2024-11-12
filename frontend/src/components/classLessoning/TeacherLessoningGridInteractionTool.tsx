import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import DrawingTabletIcon from '@assets/icons/drawingTabletIcon.svg';
import {iconSize} from '@theme/iconSize';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {getResponsiveSize} from '@utils/responsive';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

const TeacherLessoningGridInteractionTool = () => {
  const navigation = useNavigation<NavigationProps>();

  const handleExit = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.InteractionToolBar}>
      <View style={styles.InteractionContainer}>
        <View style={styles.floatingToolbar}>
          {/* 필기 화면 닫기 */}
          <TouchableOpacity
            style={styles.iconTouchLayout}
            onPress={() =>
              navigation.navigate('LessoningScreen')
            }>
            <DrawingTabletIcon
              width={iconSize.mdPlus}
              height={iconSize.mdPlus}
            />
            <Text style={styles.btnTitle}>문제 페이지 이동하기</Text>
          </TouchableOpacity>
          {/* 종료 버튼 */}
          <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>수업 종료하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TeacherLessoningGridInteractionTool;

const styles = StyleSheet.create({
  InteractionToolBar: {
    ...StyleSheet.absoluteFillObject,
  },
  InteractionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginTop: getResponsiveSize(4),
    marginHorizontal: 'auto',
    padding: getResponsiveSize(8),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
  },
  pageControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageInfoText: {
    marginHorizontal: getResponsiveSize(12),
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pageButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  pageButton: {
    paddingVertical: getResponsiveSize(4),
    paddingHorizontal: getResponsiveSize(12),
    borderRadius: 8,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
  },
  disabledText: {
    color: '#999',
  },
  exitButton: {
    padding: getResponsiveSize(4),
    borderRadius: 8,
    backgroundColor: '#FFCDD2', // 퇴장 버튼 강조 색상
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  btnTitle: {
    marginRight: 'auto',
  },
  iconTouchLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
