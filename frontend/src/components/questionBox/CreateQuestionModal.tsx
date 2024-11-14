import React, {useState, useRef, useEffect} from 'react';
import {Animated, StyleSheet, TextInput, View} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
import PagerView from 'react-native-pager-view';
import Button from '@components/common/Button';
import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {typography} from '@theme/typography';
import {colors} from 'src/hooks/useColors';
import {createQuestion, uploadPdf} from '@services/questionBox';
import {getResponsiveSize} from '@utils/responsive';
import LoadingSuccessIndicator from './LoadingSuccessIndicator';
import QuestionsPage from './QuestionPage';
import {
  QuestionBoxType,
  useQuestionExplorerStore,
} from '@store/useQuestionExplorerStore';
import {useModalContext} from 'src/contexts/useModalContext';

interface FileSelectionPageProps {
  pdfFileName: string | null;
  onPickFile: () => Promise<void>;
}
// 파일 선택 페이지 컴포넌트
const FileSelectionPage = ({
  pdfFileName,
  onPickFile,
}: FileSelectionPageProps) => (
  <View style={styles.pageContent}>
    <Text variant="subtitle">PDF 파일</Text>
    <View style={[styles.input, styles.questionSelector]}>
      <View style={styles.fileName}>
        <Text>{pdfFileName || '선택된 파일 없음'}</Text>
      </View>
      <Button
        content="파일 선택"
        size="sm"
        variant="pressable"
        style={styles.button}
        onPress={onPickFile}
      />
    </View>
  </View>
);

function CreateQuestionModal(): React.JSX.Element {
  const {close} = useModalContext();
  const getCurrentFolderId = useQuestionExplorerStore(
    state => state.getCurrentFolderId,
  );
  const createItem = useQuestionExplorerStore(state => state.createItem);

  const [questionName, setQuestionName] = useState('');
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const mainPagerRef = useRef<PagerView>(null);
  const questionsPagerRef = useRef<PagerView>(null);
  const heightAnim = useRef(new Animated.Value(getResponsiveSize(240))).current;
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const animateHeight = (toHeight: number) => {
    Animated.timing(heightAnim, {
      toValue: toHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onChangeText = (inputText: string) => {
    setQuestionName(inputText);
  };

  useEffect(() => {
    // 현재 페이지에 따라 높이 애니메이션 적용
    switch (currentPage) {
      case 0:
        animateHeight(getResponsiveSize(240));
        break;
      case 1:
        animateHeight(getResponsiveSize(160));
        break;
      case 2:
        animateHeight(getResponsiveSize(240));
        break;
      case 3:
        animateHeight(getResponsiveSize(160));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleAnimationComplete = () => {
    setCurrentPage(2);
    mainPagerRef.current?.setPage(2);
    setIsUploadSuccess(false);
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [types.pdf],
      });
      const pdfFile = {
        uri: res[0].uri,
        type: res[0].type,
        name: res[0].name,
      };
      setPdfFileName(res[0].name);
      if (res[0].name) {
        setIsPdfLoading(true);
        setCurrentPage(1);
        mainPagerRef.current?.setPage(1);
        const response = await uploadPdf(res[0].name, pdfFile);
        setQuestions(response);
        setIsPdfLoading(false);
        setIsUploadSuccess(true);
      }
    } catch (err) {
      setIsPdfLoading(false);
      if (DocumentPicker.isCancel(err)) {
        console.log('파일 선택이 취소되었습니다.');
      } else {
        console.error('파일 선택 오류:', err);
      }
    }
  };

  const onPageSelected = (e: any) => {
    setQuestionNumber(e.nativeEvent.position);
  };

  const onSelectedDone = (selections: number[]) => {
    setSelectedQuestions(selections.map(selection => questions[selection]));
    setCurrentPage(3);
    mainPagerRef.current?.setPage(3);
  };

  const onCreateQuestions = async () => {
    const folderId = getCurrentFolderId();
    for (const [index, selectedQuestion] of selectedQuestions.entries()) {
      const data = await createQuestion(
        folderId,
        `${questionName}_${index}`,
        selectedQuestion,
        '1',
      );
      const formedData: QuestionBoxType = {
        id: data.fileId,
        type: 'file',
        parentId: data.parentId,
        title: data.title,
        children: [],
        childrenCount: 0,
      };
      createItem(formedData);
    }
    close();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mainPagerContainer, {height: heightAnim}]}>
        <PagerView
          style={styles.mainPager}
          initialPage={0}
          ref={mainPagerRef}
          onPageSelected={e => {
            setCurrentPage(e.nativeEvent.position);
          }}
          scrollEnabled={false}>
          <FileSelectionPage
            key="0"
            pdfFileName={pdfFileName}
            onPickFile={pickFile}
          />
          <LoadingSuccessIndicator
            key="1"
            isLoading={isPdfLoading}
            isSuccess={isUploadSuccess}
            onAnimationComplete={handleAnimationComplete}
          />
          <QuestionsPage
            key="2"
            questions={questions}
            questionNumber={questionNumber}
            pagerRef={questionsPagerRef}
            onPageSelected={onPageSelected}
            onSelectedDone={onSelectedDone}
          />
          <View key="3" style={styles.inputContainer}>
            <View style={{gap: spacing.lg}}>
              <Text variant="subtitle">제목</Text>
              <TextInput
                onChangeText={onChangeText}
                value={questionName}
                placeholder="이름을 입력하세요."
                keyboardType="default"
                style={styles.input}
              />
            </View>
            <Button
              style={{marginTop: 'auto'}}
              content="생성"
              size="full"
              variant="pressable"
              onPress={onCreateQuestions}
            />
          </View>
        </PagerView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mainPagerContainer: {
    width: '100%',
  },
  mainPager: {
    flex: 1,
  },
  pageContent: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  inputContainer: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.xl,
  },
  input: {
    alignItems: 'center',
    height: spacing.xxl * 1.75,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.md,
    fontSize: typography.size.body,
  },
  questionSelector: {
    flexDirection: 'row',
  },
  fileName: {
    flex: 8,
  },
  button: {
    flex: 2,
  },
  pagerView: {
    flex: 1,
  },
});

export default CreateQuestionModal;
