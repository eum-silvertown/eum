import Button from '@components/common/Button';
import {Text} from '@components/common/Text';

import {iconSize} from '@theme/iconSize';
import {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {colors} from 'src/hooks/useColors';

interface QuestionsPageProps {
  questions: string[];
  questionNumber: number;
  pagerRef: React.RefObject<PagerView>;
  onPageSelected: (e: any) => void;
  onSelectedDone: (selections: number[]) => void;
}

function QuestionsPage({
  questions,
  questionNumber,
  pagerRef,
  onPageSelected,
  onSelectedDone,
}: QuestionsPageProps): React.JSX.Element {
  const [selections, setSelections] = useState<number[]>([]);

  const toggleSelection = (index: number) => {
    setSelections(prev => {
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const isSelected = (index: number) => selections.includes(index);

  return (
    <View style={styles.pageContent}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={onPageSelected}>
        {questions.map((question, index) => (
          <View key={index} style={styles.pageContainer}>
            <View style={styles.checkCircle}>
              <Pressable
                onPress={() => toggleSelection(index)}
                style={[
                  styles.checkInnerCircle,
                  isSelected(index) && styles.selectedCircle,
                ]}
              />
            </View>
            <ScrollView style={styles.questionCard}>
              <Text variant="body">{question}</Text>
            </ScrollView>
          </View>
        ))}
      </PagerView>
      <View style={styles.bottomButtons}>
        <View style={styles.navigationButtons}>
          {questionNumber > 0 && (
            <Button
              content="이전"
              size="sm"
              variant="pressable"
              style={styles.navButton}
              onPress={() => pagerRef.current?.setPage(questionNumber - 1)}
            />
          )}
          {questionNumber < questions.length - 1 && (
            <Button
              content="다음"
              size="sm"
              variant="pressable"
              style={styles.navButton}
              onPress={() => pagerRef.current?.setPage(questionNumber + 1)}
            />
          )}
        </View>
        <Button
          onPress={() => onSelectedDone(selections)}
          content="선택 완료"
          size="sm"
          variant="pressable"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    padding: 25,
    gap: 10,
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  checkCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 9999,
    width: iconSize.md,
    height: iconSize.md,
  },
  checkInnerCircle: {
    width: iconSize.sm,
    height: iconSize.sm,
    borderRadius: 9999,
  },
  selectedCircle: {
    backgroundColor: colors.light.text.success,
  },
  questionCard: {
    flex: 1,
    borderRadius: 15,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  navButton: {
    width: 100,
  },
});

export default QuestionsPage;
