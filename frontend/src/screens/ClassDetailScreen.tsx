import { Text } from '@components/common/Text';
import { spacing } from '@theme/spacing';
import { StyleSheet, View } from 'react-native';

function ClassDetailScreen(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="title" weight="bold">
                    수업 상세 정보
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={styles.overview}>
                        <Text>Overview</Text>
                    </View>
                    <View style={styles.mainContent}>
                        <Text>Content</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.review}>
                        <Text>Review</Text>
                    </View>
                    <View style={styles.homework}>
                        <Text>Homework</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ClassDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        marginBottom: spacing.md,
    },
    content: {
        flex: 8,
        gap: spacing.md,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        gap: spacing.md,
    },
    overview: {
        flex: 2,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    review: {
        flex: 2,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
    },
    homework: {
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
