import { Text } from '@components/common/Text';
import { HomeworkDetailType } from '@services/homeworkService';
import { calculateTimeRemaining } from '@utils/calculateTimeRemaining';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '@hooks/useColors';

interface HomeworkListProps {
  homeworkList: HomeworkDetailType[];
  selectedHomework: number;
  setSelectedHomework: React.Dispatch<React.SetStateAction<number>>;
}

const HomeworkList: React.FC<HomeworkListProps> = ({ homeworkList, selectedHomework, setSelectedHomework }): React.JSX.Element => {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <View style={styles.container}>
      <Text variant="subtitle" weight="bold">숙제 목록</Text>
      <ScrollView style={styles.homeworkList}>
        {homeworkList.map((homeworkDetail) => (
          <Pressable key={homeworkDetail.homeworkId} style={[styles.homework, selectedHomework === homeworkDetail.homeworkId && styles.selectedHomework]} onPress={() => setSelectedHomework(homeworkDetail.homeworkId)}>
            <View style={styles.subject}>
              <Text variant="subtitle" weight="medium" style={[styles.subjectText, { backgroundColor: homeworkDetail.backgroundColor, color: homeworkDetail.fontColor }]}>
                {homeworkDetail.subject}
              </Text>
            </View>
            <Text style={styles.title}>{homeworkDetail.title}</Text>
            <Text style={[
              styles.score,
              !homeworkDetail.isComplete && styles.incompleteScore,
            ]}>
              {homeworkDetail.isComplete ? `${Math.floor(homeworkDetail.score)}점` : '미제출'}
            </Text>
            <Text
              style={[
                styles.endTime,
                calculateTimeRemaining(homeworkDetail.endTime) === '기간 만료' && styles.expiredText
              ]}
            >
              {calculateTimeRemaining(homeworkDetail.endTime)}
            </Text>
          </Pressable>
        )
        )}
      </ScrollView>
    </View>
  );
};

export default HomeworkList;

const getStyles = (width: number) => StyleSheet.create({
  container: {
    flex: 6,
    gap: width * 0.01,
  },
  homeworkList: {
    flex: 1,
    paddingTop: width * 0.01,
    paddingBottom: width * 0.005,
    paddingHorizontal: width * 0.01,
    backgroundColor: 'white',
    borderWidth: width * 0.001,
    borderRadius: width * 0.01,
    borderColor: colors.light.borderColor.pickerBorder,
  },
  homework: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.005,
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.015,
    borderWidth: width * 0.00075,
    borderRadius: width * 0.005,
    borderColor: colors.light.borderColor.pickerBorder,
  },
  selectedHomework: {
    borderWidth: width * 0.00075,
    borderRadius: width * 0.005,
    borderColor: colors.light.background.main,
  },
  subject: {
    width: '20%',
    alignItems: 'flex-start',
  },
  subjectText: {
    paddingHorizontal: width * 0.005,
    borderRadius: width * 0.005,
  },
  title: {
    width: '40%',
  },
  score: {
    width: '20%',
  },
  incompleteScore: {
    color: colors.light.text.error,
  },
  endTime: {
    marginLeft: 'auto',
  },
  expiredText: {
    color: 'red',
  },
});
