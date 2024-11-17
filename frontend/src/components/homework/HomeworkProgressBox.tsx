import { Text } from '@components/common/Text';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from 'src/hooks/useColors';
import HomeworkIcon from '@assets/icons/homeworkIcon.svg';
import CompletedHomeworkIcon from '@assets/icons/completeHomeworkIcon.svg';
import UncompletedHomeworkIcon from '@assets/icons/incompleteHomeworkIcon.svg';
import AverageScoreIcon from '@assets/icons/scoreIcon.svg';

interface HomeworkProgressBoxProps {
  variant: '전체 숙제 수' | '완료한 숙제 수' | '미완료' | '평균 점수';
  value: number;
  selected?: '전체 숙제 수' | '완료한 숙제 수' | '미완료';
  setSelected?: React.Dispatch<React.SetStateAction<'전체 숙제 수' | '완료한 숙제 수' | '미완료'>>
}

const HomeworkProgressBox: React.FC<HomeworkProgressBoxProps> = ({ variant, value, selected, setSelected }): React.JSX.Element => {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const getIcon = () => {
    switch (variant) {
      case '전체 숙제 수':
        return <HomeworkIcon width={width * 0.025} height={width * 0.025} color={getIconColor()} />;
      case '완료한 숙제 수':
        return <CompletedHomeworkIcon width={width * 0.025} height={width * 0.025} color={getIconColor()} />;
      case '미완료':
        return <UncompletedHomeworkIcon width={width * 0.025} height={width * 0.025} color={getIconColor()} />;
      case '평균 점수':
        return <AverageScoreIcon width={width * 0.025} height={width * 0.025} color={getIconColor()} />;
      default:
        return null;
    }
  };

  const getIconBackgroundColor = () => {
    switch (variant) {
      case '전체 숙제 수':
        return '#ccccff';
      case '완료한 숙제 수':
        return '#ccffcc';
      case '미완료':
        return '#ffcccc';
      case '평균 점수':
        return '#ffffcc';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case '전체 숙제 수':
        return '#7777ff';
      case '완료한 숙제 수':
        return '#77bb77';
      case '미완료':
        return '#ff7777';
      case '평균 점수':
        return '#cccc77';
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.progressBox,
        selected && selected === variant && {
          borderColor: colors.light.background.main,
        },
        pressed && {
          backgroundColor: '#fafafa',
        },
      ]}
      onPress={() => {
        if(setSelected && variant !== '평균 점수') {
          setSelected(variant);
        }
      }}
    >
      <View style={styles.progressContent}>
        <Text variant="xxl" weight="bold">{value}</Text>
        <Text color="secondary">{variant}</Text>
      </View>
      <View style={[styles.progressIcon, { backgroundColor: getIconBackgroundColor() }]}>
        {getIcon()}
      </View>
    </Pressable>
  );
};

export default HomeworkProgressBox;

function getStyles(width: number) {
  return StyleSheet.create({
    progressBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.01,
      padding: width * 0.015,
      backgroundColor: 'white',
      borderWidth: width * 0.001,
      borderRadius: width * 0.01,
      borderColor: colors.light.borderColor.pickerBorder,
    },
    progressContent: {
      flex: 6,
    },
    progressIcon: {
      flex: 4,
      justifyContent: 'center',
      alignItems: 'center',
      aspectRatio: 1,
      borderRadius: width * 0.01,
    },
  });
}