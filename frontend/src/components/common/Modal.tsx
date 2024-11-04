import {useModalStore} from '@store/useModalStore';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './Text';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {borderRadius} from '@theme/borderRadius';
import CloseButtonIcon from '@assets/icons/cancelIcon.svg';
import {iconSize} from '@theme/iconSize';

function Modal(): React.JSX.Element {
  const {setIsModalOpened, isModalOpened, modalContent, modalTitle, modalSize} =
    useModalStore();

  return (
    <>
      {isModalOpened && (
        <View style={styles.modalBackground}>
          <View style={styles.modalWrapper}>
            <View style={[styles.modalContent, styles[modalSize]]}>
              {/* 모달 제목 */}
              {modalTitle && (
                <Text variant="title" weight="bold" style={styles.title}>
                  {modalTitle}
                </Text>
              )}

              {/* 닫기 버튼 */}
              <TouchableOpacity
                onPress={() => setIsModalOpened(false)}
                style={styles.closeButton}>
                <CloseButtonIcon width={iconSize.sm} height={iconSize.sm} />
              </TouchableOpacity>

              {/* 모달 본문 */}
              <View>{modalContent}</View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

export default Modal;

const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000aa',
  },
  modalWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalContent: {
    padding: spacing.xxl,
    backgroundColor: colors.light.background.white,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    alignSelf: 'center',
    position: 'relative',
  },
  title: {
    marginBottom: spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    padding: spacing.md,
    alignItems: 'center',
  },
  sm: {
    width: '50%',
  },
  md: {
    width: '60%',
  },
  lg: {
    width: '70%',
  },
});
