import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createNotice, LectureNoticeType} from '@services/lectureNotice';
import {useModal} from 'src/hooks/useModal';

type LectureIdProps = {
  lectureId?: number;
};

const NoticeCreateModal = ({lectureId}: LectureIdProps): React.JSX.Element => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const {closeAll} = useModal();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNoticeData: LectureNoticeType) =>
      createNotice(newNoticeData),
    onSuccess: () => {
      console.log('성공적으로 공지사항을 게시했습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      closeAll();
    },
    onError: error => {
      console.error('공지사항 생성 실패:', error);
    },
  });

  const createNewNotice = () => {
    if (title.trim() && content.trim()) {
      const newNoticeData = {
        lectureId: lectureId!,
        title: title,
        content: content,
      };
      mutation.mutate(newNoticeData);
    } else {
      if (!title.trim()) {
        setTitleError('제목을 입력해 주세요.');
      }
      if (!content.trim()) {
        setContentError('내용을 입력해 주세요.');
      }
    }
  };

  return (
    <>
      <View style={styles.titleContainer}>
        <View style={styles.titleHeader}>
          <Text variant="subtitle" weight="bold">
            제목
          </Text>
          <Text style={styles.charLimitText}>({title.length} / 10자)</Text>
        </View>
        <InputField
          placeholder="제목을 입력해주세요."
          value={title}
          onChangeText={text => {
            if (text.length <= 10) {
              setTitle(text);
              setTitleError(''); // 에러 메시지 초기화
            } else {
              setTitleError('제목은 최대 10자까지 입력 가능합니다.');
            }
          }}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleHeader}>
          <Text variant="subtitle" weight="bold">
            내용
          </Text>
          <Text style={styles.charLimitText}>({content.length} / 64자)</Text>
        </View>
        <InputField
          placeholder="내용을 입력해주세요."
          value={content}
          onChangeText={text => {
            if (text.length <= 64) {
              setContent(text);
              setContentError(''); // 에러 메시지 초기화
            } else {
              setContentError('내용은 최대 64자까지 입력 가능합니다.');
            }
          }}
        />
        {contentError ? (
          <Text style={styles.errorText}>{contentError}</Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={createNewNotice} style={styles.submitButton}>
        <Text color="white" weight="bold" align="center">
          게시
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: spacing.xl,
  },
  contentContainer: {
    marginBottom: spacing.xl,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charLimitText: {
    color: '#888', // 회색 텍스트 색상
    fontSize: 12,
  },
  errorText: {
    color: 'red', // 에러 메시지 텍스트 색상
    fontSize: 12,
    marginTop: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.light.background.main,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default NoticeCreateModal;
