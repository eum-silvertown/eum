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

type NoticeData = {
  title: string;
  content: string;
};

type NoticeProps = {
  isTeacher: boolean;
  notices?: NoticeData[];
};

function Notice({ isTeacher, notices = [] }: NoticeProps): React.JSX.Element {
  const { open } = useModal();
  const displayedNotices = notices.slice(0, 3); // 최대 3개의 공지사항만 표시

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
        {Array.from({ length: 3 }).map((_, index) => {
          const notice = displayedNotices[index];
          return (
            <View key={index} style={styles.imageWrapper}>
              <Image source={postit} alt="postit" style={styles.imageContainer} />
              <View style={styles.textIconContainer}>
                <Text style={styles.overlayText}>
                  {notice ? notice.title : '등록된 공지가 없습니다.'}
                </Text>
                {isTeacher && notice && (
                  <TouchableOpacity style={styles.cancelIcon}>
                    <CancelIcon width={iconSize.xxs} height={iconSize.xxs} />
                  </TouchableOpacity>
                )}
              </View>
              {notice && <Text style={styles.noticeContent}>{notice.content}</Text>}
            </View>
          );
        })}
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
    top: 24,
    right: 12,
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
    top: 54,
    color: '#333',
  },
  cancelIcon: {
    marginLeft: '46%',
  },
});

export default Notice;
