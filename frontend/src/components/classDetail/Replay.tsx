import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from '@components/common/Text';

function Replay(): React.JSX.Element {
    const [reviewData] = useState([
        { id: '5', title: '수업 다시보기 1', date: '10-25', duration: '30:00' },
        { id: '4', title: '수업 다시보기 2', date: '10-24', duration: '28:00' },
        { id: '3', title: '수업 다시보기 3', date: '10-23', duration: '32:00' },
        { id: '2', title: '수업 다시보기 4', date: '10-22', duration: '35:00' },
        { id: '1', title: '수업 다시보기 5', date: '10-21', duration: '29:00' },
    ]);

    const renderItem = ({ item }: { item: typeof reviewData[0] }) => (
        <View style={styles.item}>
            <View style={[styles.textContainer, styles.idContainer]}>
                <Text>{item.id}</Text>
            </View>
            <View style={[styles.textContainer, styles.titleContainer]}>
                <Text>{item.title}</Text>
            </View>
            <View style={[styles.textContainer, styles.dateContainer]}>
                <Text>{item.date}</Text>
            </View>
            <View style={[styles.textContainer, styles.durationContainer]}>
                <Text>{item.duration}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.replay}>
            <Text variant="title" weight="bold">다시보기</Text>
            <FlatList data={reviewData} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </View>
    );
}

const styles = StyleSheet.create({
    replay: {
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
        flex: 5,
    },
    dateContainer: {
        flex: 2,
    },
    durationContainer: {
        flex: 1,
    },
});

export default Replay;
