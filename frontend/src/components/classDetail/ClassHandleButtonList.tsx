import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '@theme/spacing';

function ClassHandleButtonList(): React.JSX.Element {
    return (
        <View style={styles.buttonList}>
            <TouchableOpacity style={styles.classButton}>
                <Text style={styles.buttonText}>수업 시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.testButton}>
                <Text style={styles.buttonText}>시험 내기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeworkButton}>
                <Text style={styles.buttonText}>숙제 내기</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ClassHandleButtonList;

const styles = StyleSheet.create({
    buttonList: {
        flexDirection: 'column',
        marginTop: spacing.md,
        gap: spacing.lg,
        padding: spacing.md,
    },
    classButton: {
        backgroundColor: '#14AE5C',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
    },
    testButton: {
        backgroundColor: '#FF5F5F',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
    },
    homeworkButton: {
        backgroundColor: '#5F9FFF',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: spacing.xs,
    },
});
