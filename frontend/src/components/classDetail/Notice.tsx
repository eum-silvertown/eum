import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import postit from '@assets/images/postit.png';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {iconSize} from '@theme/iconSize';
import {useModal} from 'src/hooks/useModal';
import NoticeCreateModal from './NoticeCreateModal';
import CancelIcon from '@assets/icons/cancelIcon.svg';
import {deleteNotice} from '@services/lectureNotice';
import {useMutation, useQueryClient} from '@tanstack/react-query';

type NoticeData = {
  noticeId: number;
  title: string;
  content: string;
};

type NoticeProps = {
  isTeacher: boolean;
  lectureId?: number;
  notices?: NoticeData[];
};

function Notice({
  isTeacher,
  lectureId,
  notices = [],
}: NoticeProps): React.JSX.Element {
  const {open} = useModal();
  const displayedNotices = notices
    .slice(Math.max(notices.length - 3, 0))
    .reverse();
  const queryClient = useQueryClient();
  const {mutate: deleteMutation} = useMutation({
    mutationFn: (noticeId: number) => deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
    },
  });

  const showDeleteConfirmation = (noticeId: number) => {
    Alert.alert(
      '경고',
      '정말 삭제하시겠습니까?',
      [
        {
          text: '삭제',
          onPress: () => {
            console.log('삭제 확정');
            deleteMutation(noticeId);
          },
          style: 'destructive',
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.notice}>
      <View style={styles.noticeHeader}>
        <Text variant="subtitle" weight="bold">
          공지사항
        </Text>
        {isTeacher && (
          <TouchableOpacity
            onPress={() => {
              open(<NoticeCreateModal lectureId={lectureId} />, {
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
        {Array.from({length: 3}).map((_, index) => {
          const notice = displayedNotices[index];
          return (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={postit}
                alt="postit"
                style={styles.imageContainer}
              />
              <View style={styles.textIconContainer}>
                <Text style={styles.overlayText}>
                  {notice ? notice.title : '등록된 공지가 없습니다.'}
                </Text>
                {isTeacher && notice && (
                  <TouchableOpacity
                    style={styles.cancelIcon}
                    onPress={() => showDeleteConfirmation(notice.noticeId)}>
                    <CancelIcon width={iconSize.xxs} height={iconSize.xxs} />
                  </TouchableOpacity>
                )}
              </View>
              {notice && (
                <Text style={styles.noticeContent}>{notice.content}</Text>
              )}
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
    paddingVertical: getResponsiveSize(16),
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
    paddingHorizontal: getResponsiveSize(28),
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
    left: getResponsiveSize(12),
    top: getResponsiveSize(25),
    right: getResponsiveSize(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayText: {
    fontWeight: 'bold',
  },
  noticeContent: {
    position: 'absolute',
    left: getResponsiveSize(12),
    right: getResponsiveSize(12),
    top: getResponsiveSize(50),
    color: '#333',
  },
  cancelIcon: {
    right: getResponsiveSize(6),
  },
});

export default Notice;
