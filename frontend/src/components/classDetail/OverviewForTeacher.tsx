import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet } from 'react-native';
import ProgressBox from '@components/homework/ProgressBox';
import { spacing } from '@theme/spacing';
import { getResponsiveSize } from '@utils/responsive';

type OverviewForTeacherProps = {
    isTeacher: boolean;
    homeworkAvgScore?: number;
    testAvgScore?: number;
    attitudeAvgScore?: number;
};

function OverviewForTeacher({
    isTeacher,
    homeworkAvgScore = 0,
    testAvgScore = 0,
    attitudeAvgScore = 0,
}: OverviewForTeacherProps): React.JSX.Element {
    return (
        <View style={styles.overview}>
            <Text variant="subtitle" weight="bold" style={styles.subtitle}>
                평균 점수 Overview
            </Text>
            <View style={styles.progressLayout}>
                <ProgressBox
                    color="red"
                    title="시험 평균 점수"
                    content={`${testAvgScore}`}
                    unit="점"
                    icon="complete"
                    isTeacher={isTeacher}
                />
                <ProgressBox
                    color="blue"
                    title="숙제 평균 점수"
                    content={`${homeworkAvgScore}`}
                    unit="점"
                    icon="homeworkCheck"
                    isTeacher={isTeacher}
                />
                <ProgressBox
                    color="green"
                    title="태도 평균 점수"
                    content={`${attitudeAvgScore}`}
                    unit="점"
                    icon="folderCheck"
                    isTeacher={isTeacher}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overview: {
        flex: 1,
        gap: spacing.md,
    },
    subtitle: {
        marginStart: spacing.xl,
    },
    progressLayout: {
        flex: 1,
        flexDirection: 'row',
        gap: spacing.xxl,
        paddingHorizontal: getResponsiveSize(20),
    },
});

export default OverviewForTeacher;
