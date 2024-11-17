import { Text } from '@components/common/Text';
import { HomeworkDetailType } from '@services/homeworkService';
import { calculateTimeRemaining } from '@utils/calculateTimeRemaining';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from 'src/hooks/useColors';

interface HomeworkListProps {
  homeworkList: HomeworkDetailType[];
}

const HomeworkList: React.FC<HomeworkListProps> = ({homeworkList}): React.JSX.Element => {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <View style={styles.container}>
        <Text variant="subtitle" weight="bold">숙제 목록</Text>
        <ScrollView style={styles.homeworkList}>
          {homeworkList.map((homeworkDetail) => (
            <View key={homeworkDetail.homeworkId} style={styles.homework}>
              <Text variant="subtitle" weight="medium" style={styles.subject}>
                {homeworkDetail.subject}
              </Text>
              <Text style={styles.title}>{homeworkDetail.title}</Text>
              <Text style={styles.score}>{homeworkDetail.score}점</Text>
              <Text style={styles.endTime}>
                {calculateTimeRemaining(homeworkDetail.endTime)}
              </Text>
            </View>
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
  subject: {
    width: '20%',
  },
  title: {
    width: '50%',
  },
  score: {
    width: '20%',
  },
  endTime: {
    marginLeft: 'auto',
  },
});
