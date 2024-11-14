import {useModalStore} from '@store/useModalStore';
import {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Text} from './Text';
import CloseButtonIcon from '@assets/icons/cancelIcon.svg';
import {iconSize} from '@theme/iconSize';
import {borderRadius} from '@theme/borderRadius';
import {spacing} from '@theme/spacing';
import {ModalContext} from 'src/contexts/useModalContext';
import {getResponsiveSize} from '@utils/responsive';

interface ModalProps {
  modal: {
    id: string;
    title: string;
    content: React.ReactNode;
    size: keyof typeof size;
  };
}

function Modal({modal}: ModalProps): React.JSX.Element {
  const {closeModal} = useModalStore();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const isClosing = useRef(false);

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 200});
    translateY.value = withTiming(0, {
      duration: 200,
    });
  }, [opacity, translateY]);

  const finishClosing = useCallback(() => {
    if (!isClosing.current) {
      return;
    }
    closeModal(modal.id);
  }, [closeModal, modal.id]);

  const handleClose = useCallback(() => {
    if (isClosing.current) {
      return;
    }
    isClosing.current = true;

    // Simultaneous fade out and slide animations
    opacity.value = withTiming(0, {
      duration: 200,
    });

    translateY.value = withTiming(
      10,
      {
        duration: 200,
      },
      finished => {
        if (finished) {
          runOnJS(finishClosing)();
        }
      },
    );
  }, [opacity, translateY, finishClosing]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
    };
  });

  return (
    <ModalContext.Provider value={{close: handleClose}}>
      <Animated.View
        style={[styles.container, size[modal.size], animatedStyle]}>
        <View style={styles.header}>
          <Text variant="title" weight="bold">
            {modal.title}
          </Text>
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
            <CloseButtonIcon width={iconSize.sm} height={iconSize.sm} />
          </TouchableOpacity>
        </View>
        <View>{modal.content}</View>
      </Animated.View>
    </ModalContext.Provider>
  );
}

export default Modal;

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    elevation: getResponsiveSize(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const size = StyleSheet.create({
  xs: {
    width: '40%',
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
  full: {
    width: '100%',
  },
});
