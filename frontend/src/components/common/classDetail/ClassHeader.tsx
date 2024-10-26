import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@theme/spacing';

function ClassHeader(): React.JSX.Element {
    return (
        <View style={styles.header}>
            <Text variant="title" weight="bold">
                수업 상세 정보
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        marginBottom: spacing.md,
    },
});

export default ClassHeader;
