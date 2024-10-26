import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet } from 'react-native';

function Teacher(): React.JSX.Element {
    return (
        <View style={styles.teacher}>
            <Text>Teacher</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    teacher: {
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
});

export default Teacher;
