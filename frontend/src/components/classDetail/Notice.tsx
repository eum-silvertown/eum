import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import postit from '@assets/images/postit.png';
import { spacing } from '@theme/spacing';
import { getResponsiveSize } from '@utils/responsive';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import { iconSize } from '@theme/iconSize';
import { useModal } from 'src/hooks/useModal';
import NoticeCreateModal from './NoticeCreateModal';
import CancelIcon from '@assets/icons/cancelIcon.svg';

type IsTeacherProps = {
  isTeacher: boolean;
}

function Notice({ isTeacher }: IsTeacherProps): React.JSX.Element {
  const { open } = useModal();

  const noticeDatas = [
    {
      title: '공지사항 1',
      content: '공지사항 내용 1@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
    },
    {
      title: '공지사항 2',
      content: '공지사항 내용 2',
    },
    {
      title: '공지사항 3',
      content: '공지사항 내용 3',
    },
  ];

  return (
    <View style={styles.notice}>
      <View style={styles.noticeHeader}>
        <Text variant="subtitle" weight="bold">
          공지사항
        </Text>
        {isTeacher && (
          <TouchableOpacity
            onPress={() => {
              open(<NoticeCreateModal />, {
                title: '공지사항 생성',
                onClose: () => {
                  console.log('공지사항 생성 닫기');
                },
              });
            }}>
            <AddCircleIcon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.noticeLayout}>
        {noticeDatas.map((notice, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={postit} alt="postit" style={styles.imageContainer} />
            <View style={styles.textIconContainer}>
              <Text style={styles.overlayText}>{notice.title}</Text>
              {isTeacher &&
                <TouchableOpacity style={styles.cancelIcon}>
                  <CancelIcon width={iconSize.xxs} height={iconSize.xxs} />
                </TouchableOpacity>
              }
            </View>
            <Text style={styles.noticeContent}>{notice.content}</Text>
          </View>
        ))}
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
  textIconContainer: {
    position: 'absolute',
    left: 12,
    top: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayText: {
    fontWeight: 'bold',
  },
  noticeContent: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 42,
    color: '#333',
  },
  cancelIcon: {
    marginLeft: '46%',
  },
});

export default Notice;
