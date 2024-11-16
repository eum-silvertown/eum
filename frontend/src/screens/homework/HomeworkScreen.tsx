import { Text } from '@components/common/Text';
import { AllAboutHomeworkType, getAllAboutHomework } from '@services/homeworkService';
import { useAuthStore } from '@store/useAuthStore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from 'src/hooks/useColors';

import HomeworkIcon from '@assets/icons/homeworkIcon.svg';

export default function HomeworkScreen(): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  const userId = useAuthStore(state => state.userInfo.id);
  const [allAboutHomework, setAllAboutHomework] = useState<AllAboutHomeworkType>();

  async function fetchHomework() {
    try {
      const data = await getAllAboutHomework(userId);
      setAllAboutHomework(data);
    } catch (error) {
      console.error('Failed to fetch Homework: ', error);
    }
  }

  useEffect(() => {
    fetchHomework();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!allAboutHomework) {
    return <View><Text>Loading...</Text></View>
  }

  return <View style={styles.container}>
    <View style={styles.progressView}>
      <Text variant="subtitle" weight="bold">숙제 진행도</Text>
      <View style={styles.progressBoxes}>
        <View style={styles.progressBox}>
          <View style={styles.progressContent}>
            <Text variant="xxl" weight="bold">{allAboutHomework.totalHomeworkCount}</Text>
            <Text color="secondary">전체 숙제 수</Text>
          </View>
          <View style={[styles.progressIcon, {backgroundColor: '#ccccff'}]}>
          <HomeworkIcon width={width * 0.02} height={width * 0.02} color={'#7777ff'}/>
          </View>
        </View>
        <View style={styles.progressBox}>
          <View style={styles.progressContent}>
            <Text variant="xxl" weight="bold">{allAboutHomework.completedHomeworkCount}</Text>
            <Text color="secondary">완료한 숙제 수</Text>
          </View>
          <View style={[styles.progressIcon, {backgroundColor: '#ccffcc'}]}>
          <HomeworkIcon width={width * 0.02} height={width * 0.02} color={'#77bb77'}/>
          </View>
        </View>
        <View style={styles.progressBox}>
          <View style={styles.progressContent}>
            <Text variant="xxl" weight="bold">{allAboutHomework.totalHomeworkCount - allAboutHomework.completedHomeworkCount}</Text>
            <Text color="secondary">미완료</Text>
          </View>
          <View style={[styles.progressIcon, {backgroundColor: '#ffcccc'}]}>
          <HomeworkIcon width={width * 0.02} height={width * 0.02} color={'#ff7777'}/>
          </View>
        </View>
        <View style={styles.progressBox}>
          <View style={styles.progressContent}>
            <Text variant="xxl" weight="bold">{allAboutHomework.averageScore}</Text>
            <Text color="secondary">평균 점수</Text>
          </View>
          <View style={[styles.progressIcon, {backgroundColor: '#ffffcc'}]}>
          <HomeworkIcon width={width * 0.02} height={width * 0.02} color={'#cccc77'}/>
          </View>
        </View>
      </View>
    </View>
    <View style={styles.homeworkView}>
      <View style={{flex: 6, gap: width * 0.01}}>
        <Text variant="subtitle" weight="bold">숙제 목록</Text>
        <View style={styles.homeworkList}>
          {allAboutHomework.homeworkDetails.map(homeworkDetail => <View>
            <Text>{homeworkDetail.title}</Text>
            </View>)}
        </View>
      </View>
      <View style={{flex: 4, gap: width * 0.01}}>
        <Text variant="subtitle" weight="bold">숙제 미리보기</Text>
        <View style={styles.homeworkList}></View>
      </View>
    </View>
  </View>
}

function getStyles(width: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: width * 0.01,
      padding: width * 0.025,
      backgroundColor: '#f0f0f0',
    },
    leftContentView: {
      flex: 1,
      gap: width * 0.01,
    },
    rightContentView: {
      flex: 1,
    },
    progressView: {
      flex: 2,
      gap: width * 0.01,
    },
    progressBoxes: {
      flex: 1,
      flexDirection: 'row',
      gap: width * 0.025,
    },
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
    progressBar: {
      flex: 1,
    },
    homeworkView: {
      flex: 6.5,
      flexDirection: 'row',
      gap: width * 0.025,
    },
    homeworkList: {
      flex: 1,
      backgroundColor: 'white',
      borderWidth: width * 0.001,
      borderRadius: width * 0.01,
      borderColor: colors.light.borderColor.pickerBorder,
    }
  })
}