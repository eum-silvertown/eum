import {useModalStore} from '@store/useModalStore';
import {StyleSheet, View} from 'react-native';
import Modal from './Modal';

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
});
