import {useModalStore} from '@store/useModalStore';
import {StyleSheet, View} from 'react-native';

function Modal(): React.JSX.Element {
  const {isModalOpened, modalContent} = useModalStore();

  return (
    <>
      {isModalOpened && (
        <View style={styles.modalBackground}>
          <View style={styles.modalWrapper}>{modalContent}</View>
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
});
