import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet } from 'react-native';

function Chart(): React.JSX.Element {
    return (
        <View style={styles.chart}>
            <Text>Score</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    chart: {
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
});

export default Chart;
