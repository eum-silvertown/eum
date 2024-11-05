import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import postit from '@assets/images/postit.png';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {iconSize} from '@theme/iconSize';
import {useModal} from 'src/hooks/useModal';
import NoticeCreateModal from './NoticeCreateModal';

function Notice(): React.JSX.Element {
  const {open} = useModal();
  return (
    <View style={styles.notice}>
      <View style={styles.noticeHeader}>
        <Text variant="subtitle" weight="bold">
          공지사항
        </Text>
        <TouchableOpacity
          onPress={() => {
            open(<NoticeCreateModal />, {
              title: '공지사항 생성',
              onClose: () => {
                console.log('공지사항 생성 닫기');
              },
            });
          }}>
          <AddCircleIcon width={iconSize.mdPlus} height={iconSize.mdPlus} />
        </TouchableOpacity>
      </View>
      <View style={styles.noticeLayout}>
        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 1</Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 2</Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image source={postit} alt="postit" style={styles.imageContainer} />
          <Text style={styles.overlayText}>공지사항 3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    height: '50%',
    justifyContent: 'center',
    paddingVertical: getResponsiveSize(10),
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginStart: spacing.xl,
  },
  noticeLayout: {
    flexDirection: 'row',
    gap: spacing.xxl,
    paddingHorizontal: getResponsiveSize(20),
  },
  imageWrapper: {
    position: 'relative',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  overlayText: {
    position: 'absolute',
    marginTop: spacing.xl,
    marginLeft: spacing.lg,
    fontWeight: 'bold',
  },
});

export default Notice;
