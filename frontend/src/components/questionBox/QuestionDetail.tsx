import {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import CancelIcon from '@assets/icons/cancelIcon.svg';
import {iconSize} from '@theme/iconSize';
import {spacing} from '@theme/spacing';
import {borderWidth} from '@theme/borderWidth';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import {detailQuestion, DetailQuestionType} from '@services/questionBox';
import {useQuery} from '@tanstack/react-query';
import {Text} from '@components/common/Text';

interface QuestionDetailProps {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  containerHeight: number;
  selectedFileId: number;
  setSelectedFileId: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuestionDetail({
  isOpened,
  setIsOpened,
  containerHeight,
  selectedFileId,
  setSelectedFileId,
}: QuestionDetailProps): React.JSX.Element {
  const toggleAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const {data: questionDetail, isLoading} = useQuery<DetailQuestionType>({
    queryKey: ['questionDetail', selectedFileId],
    queryFn: () => detailQuestion(selectedFileId),
    enabled: selectedFileId !== 0,
  });

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: isOpened ? -containerWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);

  useEffect(() => {
    if (selectedFileId) {
      detailQuestion(selectedFileId);
    }
  }, [selectedFileId]);

  return (
    <Animated.View
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
      style={[
        styles.container,
        {transform: [{translateX: toggleAnim}], height: containerHeight},
      ]}>
      <Pressable
        style={styles.cancelIcon}
        onPress={() => {
          setIsOpened(false);
          setSelectedFileId(0);
        }}>
        <Text variant="subtitle" weight="medium">
          {questionDetail?.title}
        </Text>
        <CancelIcon width={iconSize.md} height={iconSize.md} />
      </Pressable>
      <View style={styles.preview}>
        <Text>{questionDetail?.content}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    right: '-50%',
    width: '50%',
    padding: spacing.lg,
    backgroundColor: 'white',
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.lg,
    borderColor: colors.light.borderColor.pickerBorder,
    elevation: 2,
  },
  cancelIcon: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  preview: {
    width: '100%',
    height: '50%',
    padding: spacing.lg,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.pickerBorder,
  },
});
