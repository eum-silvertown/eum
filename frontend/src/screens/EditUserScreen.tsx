import ListItemContainer from '@components/common/ListItemContainer';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {Image, StyleSheet, View} from 'react-native';
import defaultUserImage from '@assets/images/defaultProfileImage.png';
import {iconSize} from '@theme/iconSize';
import Button from '@components/common/Button';

function EditUserScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View>
        <Text variant="title" weight="bold">
          회원 정보 수정
        </Text>
      </View>
      <View style={styles.userinfoContainer}>
        <ListItemContainer variant="userinfo">
          <View style={styles.imageContainer}>
            <Image style={styles.profileImage} source={defaultUserImage} />
          </View>
          <Text style={{flex: 0.5}}>OO고등학교 1학년 1반</Text>
          <Text style={{flex: 1}}>박효진</Text>
          <Button variant="pressable" content="사진 변경" size="sm" />
        </ListItemContainer>
        <View style={styles.detailInfoContainer}>
          <ListItemContainer variant="userinfo">
            <View>
              <Text>이름</Text>
              <Text>박효진</Text>
            </View>
          </ListItemContainer>
          <ListItemContainer variant="userinfo">
            <View>
              <Text>소속</Text>
              <Text>OO고등학교 1학년 1반</Text>
            </View>
          </ListItemContainer>
          <ListItemContainer variant="userinfo">
            <View>
              <Text>생일</Text>
              <Text>1996년 01월 01일</Text>
            </View>
          </ListItemContainer>
        </View>
      </View>
    </View>
  );
}

export default EditUserScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  userinfoContainer: {
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  imageContainer: {
    flex: 0.25,
    overflow: 'hidden',
  },
  profileImage: {
    width: iconSize.lg,
    height: undefined,
    aspectRatio: 1,
    objectFit: 'cover',
  },
  detailInfoContainer: {
    gap: spacing.md,
  },
});
