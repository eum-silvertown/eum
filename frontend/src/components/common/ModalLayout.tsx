import React from 'react';
import {Modal, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {borderRadius} from '@theme/borderRadius';
import CloseButtonIcon from '@assets/icons/cancelIcon.svg';
import {iconSize} from '@theme/iconSize';

interface ModalLayoutProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const ModalLayout = ({
  visible,
  onClose,
  title,
  children,
}: ModalLayoutProps): React.JSX.Element => {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* 모달 제목 */}
          {title && (
            <Text variant="title" weight="bold" style={styles.title}>
              {title}
            </Text>
          )}

          {/* 닫기 버튼 */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CloseButtonIcon width={iconSize.sm} height={iconSize.sm} />
          </TouchableOpacity>

          {/* 모달 본문 */}
          <View style={styles.bodyContent}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background.modalOverlay,
  },
  modalContent: {
    width: '60%',
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
  bodyContent: {},
  closeButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    padding: spacing.md,
    alignItems: 'center',
  },
});

export default ModalLayout;
