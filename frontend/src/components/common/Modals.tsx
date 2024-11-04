import {useModalStore} from '@store/useModalStore';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './Text';
import CloseButtonIcon from '@assets/icons/cancelIcon.svg';
import {iconSize} from '@theme/iconSize';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useCallback, useEffect, useRef} from 'react';

function Modals(): React.JSX.Element {
  const {modals} = useModalStore();

  return (
    <>
      {modals.map((modal, index) => (
        <View
          key={modal.id}
          style={[
            styles.overlay,
            {
              zIndex: 1000 + index,
            },
          ]}>
          <View
            style={[
              styles.wrapper,
              {
                zIndex: 1001 + index,
              },
            ]}>
            <Modal modal={modal} />
          </View>
        </View>
      ))}
    </>
  );
}

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
    opacity.value = withTiming(1, {duration: 150});
    translateY.value = withTiming(0, {
      duration: 150,
    });
  }, [opacity, translateY]);

  const finishClosing = useCallback(() => {
    if (!isClosing.current) return;
    closeModal(modal.id);
  }, [closeModal, modal.id]);

  const handleClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    // Simultaneous fade out and slide animations
    opacity.value = withTiming(0, {
      duration: 100,
    });

    translateY.value = withTiming(
      10,
      {
        duration: 100,
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
    <Animated.View style={[styles.container, size[modal.size], animatedStyle]}>
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
  );
}

export default Modals;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  container: {
    padding: spacing.xxl,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
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
