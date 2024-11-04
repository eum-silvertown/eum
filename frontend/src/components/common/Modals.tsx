import {useModalStore} from '@store/useModalStore';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from './Text';
import CloseButtonIcon from '@assets/icons/cancelIcon.svg';
import {iconSize} from '@theme/iconSize';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';

function Modals(): React.JSX.Element {
  const {modals, closeModal} = useModalStore();

  return (
    <>
      {modals.map((modal, index) => (
        <View
          key={modal.id}
          style={[
            styles.overlay,
            {
              zIndex: 1000 + index, // 스택 순서대로 z-index 증가
            },
          ]}>
          <View
            style={[
              styles.wrapper,
              {
                zIndex: 1001 + index,
                // 모달 크기와 스타일링을 여기에 추가
              },
            ]}>
            <View style={[styles.container, size[modal.size]]}>
              <View style={styles.header}>
                <Text variant="title" weight="bold">
                  {modal.title}
                </Text>
                <TouchableOpacity onPress={() => closeModal(modal.id)}>
                  <CloseButtonIcon width={iconSize.sm} height={iconSize.sm} />
                </TouchableOpacity>
              </View>
              <View>{modal.content}</View>
            </View>
          </View>
        </View>
      ))}
    </>
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
