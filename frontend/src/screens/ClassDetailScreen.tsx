import { Text } from '@components/common/Text';
import { spacing } from '@theme/spacing';
import { StyleSheet, View } from 'react-native';

function ClassDetailScreen(): React.JSX.Element {
    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <Text variant="title" weight="bold">
                    수업 상세 정보
                </Text>
            </View>
            {/* 본문 */}
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={styles.overviewLayout}>
                        {/* 오버뷰 */}
                        <View style={styles.overview}>
                            <Text>Overview 1</Text>
                        </View>
                        {/* 공지사항 */}
                        <View style={styles.overview}>
                            <Text>Overview 2</Text>
                        </View>
                    </View>
                    <View style={styles.mainContentLayout}>
                        {/* 선생님 Detail */}
                        <View style={styles.mainContent}>
                            <Text>Content 1</Text>
                        </View>
                        {/* 성취도 차트 */}
                        <View style={styles.mainContent}>
                            <Text>Content 2</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.row}>
                    {/* 다시보기 */}
                    <View style={styles.review}>
                        <Text>Review</Text>
                    </View>
                    {/* 숙제 */}
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
    overviewLayout: {
        flex: 4,
        flexDirection: 'column',
        gap: spacing.md,
    },
    overview: {
        flex: 1,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContentLayout: {
        flex: 2,
        flexDirection: 'column',
        gap: spacing.md,
    },
    mainContent: {
        flex: 1,
        backgroundColor: 'lightgreen',
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
