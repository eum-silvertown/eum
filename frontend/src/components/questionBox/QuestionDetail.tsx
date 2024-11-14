import {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import CancelIcon from '@assets/icons/cancelIcon.svg';
import {colors} from 'src/hooks/useColors';
import {detailQuestion, DetailQuestionType} from '@services/questionBox';
import {useQuery} from '@tanstack/react-query';
import {Text} from '@components/common/Text';
import ProblemExSection from './ProblemExSection';

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
      <View style={styles.header}>
        <Text variant="subtitle" weight="medium">
          {questionDetail?.title}
        </Text>
        <Pressable
          onPress={() => {
            setIsOpened(false);
            setSelectedFileId(0);
          }}>
          <CancelIcon width={30} height={30} />
        </Pressable>
      </View>
      {questionDetail ? (
        <View style={styles.preview}>
          <ProblemExSection
            fontSize={16}
            problemText={questionDetail.content}
          />
          <View>
            <Text style={styles.detailText}>정답: {questionDetail.answer}</Text>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>미리보기</Text>
          <Text>파일을 터치하면 문제를 미리볼 수 있습니다.</Text>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    right: '-50%',
    width: '50%',
    padding: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.light.borderColor.pickerBorder,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  preview: {
    justifyContent: 'space-between',
    width: '100%',
    height: '70%',
    padding: 15,
    borderRadius: 10,
    borderColor: `${colors.light.background.main}7f`,
    backgroundColor: 'white',
    elevation: 2,
    overflow: 'hidden',
  },
  detailText: {
    width: '100%',
    fontSize: 14,
    color: colors.light.text.main,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 25,
    color: colors.light.text.main,
  },
});
