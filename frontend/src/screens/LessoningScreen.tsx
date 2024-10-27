import CanvasSection from '@components/common/Lessoning/CanvasSection';
import ProblemSection from '@components/common/Lessoning/ProblemSection';
import { View, StyleSheet } from 'react-native';

function LessoningScreen(): React.JSX.Element {
    return (
        <View style={styles.container}>
            {/* 문제 영역 */}
            <ProblemSection />
            {/* 캔버스 및 플로팅 툴바 영역 */}
            <CanvasSection />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default LessoningScreen;
