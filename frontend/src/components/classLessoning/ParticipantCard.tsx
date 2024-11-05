import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Participant {
    id: string;
    name: string;
    isTeacher?: boolean;
}

interface ParticipantCardProps {
    participant: Participant;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>
                {participant.isTeacher ? '선생님' : participant.name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 200,
        height: 120,
        margin: 5,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        position: 'relative',
    },
    name: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(128, 128, 128, 0.7)',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});

export default ParticipantCard;
