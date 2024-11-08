import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
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
  const {closeAll} = useModal();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNoticeData: LectureNoticeType) =>
      createNotice(newNoticeData),
    onSuccess: () => {
      console.log('성공적으로 공지사항을 게시했습니다.');
      queryClient.invalidateQueries({
        queryKey: ['memorizeWordList', lectureId],
      });
      closeAll();
    },
    onError: error => {
      console.error('공지사항 생성 실패:', error);
      Alert.alert('실패', '공지사항 생성에 실패했습니다. 다시 시도해 주세요.');
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
      Alert.alert('오류', '제목과 내용을 모두 입력해 주세요.');
    }
  };

  return (
    <View>
      <View style={[styles.titleContainer]}>
        <Text variant="subtitle" weight="bold">
          제목
        </Text>
        <InputField
          placeholder="제목을 입력해주세요."
          onChangeText={setTitle}
        />
      </View>

      <View style={[styles.contentContainer]}>
        <Text variant="subtitle" weight="bold">
          내용
        </Text>
        <InputField
          placeholder="내용을 입력해주세요."
          onChangeText={setContent}
        />
      </View>

      <TouchableOpacity onPress={createNewNotice} style={styles.submitButton}>
        <Text color="white" weight="bold" align="center">
          게시
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: spacing.xl,
  },
  contentContainer: {
    marginBottom: spacing.xl,
  },
  importanceLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  importanceButton: {
    flex: 1,
    backgroundColor: colors.light.background.main,
    padding: spacing.md,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: colors.light.background.main,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default NoticeCreateModal;
