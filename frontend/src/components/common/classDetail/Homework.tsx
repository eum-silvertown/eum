import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from '@components/common/Text';

function Homework(): React.JSX.Element {
    const [homeworkData] = useState([
        { id: '5', title: '숙제 1', dueDate: '11-01', questionCount: 5 },
        { id: '4', title: '숙제 2', dueDate: '11-02', questionCount: 10 },
        { id: '3', title: '숙제 3', dueDate: '11-03', questionCount: 7 },
        { id: '2', title: '숙제 4', dueDate: '11-04', questionCount: 8 },
        { id: '1', title: '숙제 5', dueDate: '11-05', questionCount: 12 },
    ]);

    const renderItem = ({ item }: { item: typeof homeworkData[0] }) => (
        <View style={styles.item}>
            <View style={[styles.textContainer, styles.idContainer]}>
                <Text>{item.id}</Text>
            </View>
            <View style={[styles.textContainer, styles.titleContainer]}>
                <Text>{item.title}</Text>
            </View>
            <View style={[styles.textContainer, styles.dueDateContainer]}>
                <Text>{item.dueDate}</Text>
            </View>
            <View style={[styles.textContainer, styles.questionCountContainer]}>
                <Text>{item.questionCount}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.homework}>
            <Text variant="title" weight="bold">숙제</Text>
            <FlatList data={homeworkData} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </View>
    );
}

const styles = StyleSheet.create({
    homework: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        padding: 12,
        marginVertical: 6,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    textContainer: {
        paddingHorizontal: 4,
        justifyContent: 'center',
    },
    idContainer: {
        flex: 1,
    },
    titleContainer: {
        flex: 4,
    },
    dueDateContainer: {
        flex: 4,
    },
    questionCountContainer: {
        flex: 1,
    },
});

export default Homework;
