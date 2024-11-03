import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import ParticipantCard from './ParticipantCard';

interface Participant {
    id: string;
    name: string;
    isTeacher?: boolean;
}

interface LessoningStudentGridModalProps {
    onClose: () => void;
}

const ROWS = 4;
const COLUMNS = 5;
const PARTICIPANTS_PER_PAGE = ROWS * COLUMNS;

function LessoningStudentGridModal({ onClose }: LessoningStudentGridModalProps): JSX.Element {
    const [participants] = useState<Participant[]>([
        { id: '1', name: '학생 1' },
        { id: '2', name: '학생 2' },
        { id: '3', name: '학생 3' },
        { id: '4', name: '학생 4' },
        { id: '5', name: '학생 5' },
        { id: '6', name: '학생 6' },
        { id: '7', name: '학생 7' },
        { id: '8', name: '학생 8' },
        { id: '9', name: '학생 9' },
        { id: '10', name: '학생 10' },
        { id: '11', name: '학생 11' },
        { id: '12', name: '학생 12' },
        { id: '13', name: '학생 13' },
        { id: '14', name: '학생 14' },
        { id: '15', name: '학생 15' },
        { id: '16', name: '학생 16' },
        { id: '17', name: '학생 17' },
        { id: '18', name: '학생 18' },
        { id: '19', name: '학생 19' },
        { id: '20', name: '학생 20' },
        { id: '21', name: '학생 21' },
        { id: '22', name: '학생 22' },
        { id: '23', name: '학생 23' },
        { id: '24', name: '학생 24' },
    ]);

    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(participants.length / PARTICIPANTS_PER_PAGE);

    const currentParticipants = participants.slice(
        currentPage * PARTICIPANTS_PER_PAGE,
        (currentPage + 1) * PARTICIPANTS_PER_PAGE
    );

    const goToPreviousPage = () => {
        if (currentPage > 0) { setCurrentPage(currentPage - 1); }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) { setCurrentPage(currentPage + 1); }
    };

    return (
        <Modal transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                {/* 닫기 버튼 */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                {/* 총 인원수 */}
                <View style={styles.header}>
                    <Text style={styles.totalText}>총 인원: {participants.length}명</Text>
                </View>

                {/* 참가자 그리드 */}
                <FlatList
                    data={currentParticipants}
                    keyExtractor={(item) => item.id}
                    numColumns={COLUMNS}
                    renderItem={({ item }) => <ParticipantCard participant={item} />}
                    contentContainerStyle={styles.grid}
                />

                {/* 페이지 컨트롤 */}
                <View style={styles.pageControls}>
                    <TouchableOpacity onPress={goToPreviousPage} disabled={currentPage === 0} style={styles.arrow}>
                        <Text style={styles.arrowText}>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageText}>{currentPage + 1} / {totalPages}</Text>
                    <TouchableOpacity onPress={goToNextPage} disabled={currentPage === totalPages - 1} style={styles.arrow}>
                        <Text style={styles.arrowText}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default LessoningStudentGridModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    header: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    grid: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
        paddingHorizontal: 10,
    },
    pageControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    pageText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        color: '#fff',
    },
    arrow: {
        padding: 10,
    },
    arrowText: {
        fontSize: 20,
        color: '#fff',
    },
});
