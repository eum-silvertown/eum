import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';
import {useEffect} from 'react';
import {getUserInfo} from '@services/authService';
import BookModal from '@components/common/BookModal';
import {useBookModalStore} from '@store/useBookModalStore';
import Background from '@components/main/Background';
import Widgets from '@components/main/Widgets';

function HomeScreen(): React.JSX.Element {
  const bookPosition = useBookModalStore(state => state.bookPosition);

  useEffect(() => {
    // 유저 정보 조회
    const fetchData = async () => {
      try {
        const response = await getUserInfo();
      } catch (error) {}
    };

    fetchData(); // 함수 호출
  }, []);

  return (
    <View style={styles.container}>
      {bookPosition && <BookModal />}
      <Background />
      <Widgets />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    marginVertical: spacing.md,
  },
  contentTop: {
    flexDirection: 'row',
    flex: 4,
    gap: spacing.lg,
  },
  contentBottom: {
    flex: 5,
    gap: spacing.md,
  },
});
