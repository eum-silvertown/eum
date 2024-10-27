import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import MathJax from 'react-native-mathjax';

// 문제 텍스트와 이미지 URL이 포함된 예제
const problemText = `# [24011-0050]

### 2. 그림과 같이 양수 $t$ 에 대하여 곡선 $y = e^{x} - 1$ 이 두 직선 $y = t$, $y = 5t$ 와 만나는 점을 각각 $A$, $B$ 라 하고, 점 $B$ 에서 $x$ 축에 내린 수선의 발을 $C$ 라 하자. 삼각형 $ \\mathrm{ACB} $ 의 넓이를 $S(t)$ 라 할 때,
$$\\lim_{t \\rightarrow 0+} \\frac{S(t)}{t^{2}}$$
의 값을 구하시오.

![문제 그림](https://cdn.mathpix.com/cropped/2024_10_24_e358a6c41606b0dd1525g-1.jpg?height=376&width=299&top_left_y=821&top_left_x=1511)`;

// 이미지 URL 추출 함수
const extractImageUrl = (text: string): string | null => {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = text.match(imageRegex);
    return match ? match[1] : null;
};

// 텍스트에서 이미지 URL 제거 함수
const removeImageMarkdown = (text: string): string => {
    return text.replace(/!\[.*?\]\(.*?\)/g, '');
};

function LessoningScreen(): React.JSX.Element {
    const canvasRef = useCanvasRef();
    const [paths, setPaths] = useState<{ path: Path; color: string; strokeWidth: number }[]>([]);
    const [currentPath, setCurrentPath] = useState<Path | null>(null);
    const [penColor, setPenColor] = useState('#000000'); // 기본 검정색 펜
    const [penSize, setPenSize] = useState(2);

    // 이미지 URL 추출
    const imageUrl = extractImageUrl(problemText);
    const textWithoutImage = removeImageMarkdown(problemText);

    const handleTouchStart = (event: any) => {
        const { locationX, locationY } = event.nativeEvent;
        const newPath = Skia.Path.Make();
        newPath.moveTo(locationX, locationY);
        setCurrentPath(newPath);
    };

    const handleTouchMove = (event: any) => {
        if (currentPath) {
            const { locationX, locationY } = event.nativeEvent;
            currentPath.lineTo(locationX, locationY);
            canvasRef.current?.redraw();
        }
    };

    const handleTouchEnd = () => {
        if (currentPath) {
            setPaths((prevPaths) => [
                ...prevPaths,
                { path: currentPath, color: penColor, strokeWidth: penSize },
            ]);
            setCurrentPath(null);
        }
    };

    const resetPaths = () => {
        setPaths([]);
        canvasRef.current?.redraw();
    };

    return (
        <View style={styles.container}>
            {/* 문제 영역 */}
            <ScrollView style={styles.problemContainer}>
                <MathJax html={`<p>${textWithoutImage}</p>`} />
                {imageUrl && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.problemImage}
                    />
                )}
            </ScrollView>

            {/* 캔버스 영역 */}
            <View style={styles.canvasContainer}>
                <Canvas
                    ref={canvasRef}
                    style={styles.canvas}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {paths.map(({ path, color, strokeWidth }, index) => (
                        <Path key={index} path={path} color={Skia.Color(color)} style="stroke" strokeWidth={strokeWidth} />
                    ))}
                    {currentPath && (
                        <Path path={currentPath} color={Skia.Color(penColor)} style="stroke" strokeWidth={penSize} />
                    )}
                </Canvas>
            </View>
            {/* 플로팅 버튼 영역 */}
            <View style={styles.floatingToolbar}>
                <TouchableOpacity style={styles.colorButton} onPress={() => setPenColor('#FF0000')}>
                    <Text style={styles.buttonText}>Red</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.colorButton} onPress={() => setPenColor('#00FF00')}>
                    <Text style={styles.buttonText}>Green</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.colorButton} onPress={() => setPenColor('#0000FF')}>
                    <Text style={styles.buttonText}>Blue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sizeButton} onPress={() => setPenSize(4)}>
                    <Text style={styles.buttonText}>Size: 4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sizeButton} onPress={() => setPenSize(6)}>
                    <Text style={styles.buttonText}>Size: 6</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={resetPaths}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    problemContainer: {
        padding: 16,
        zIndex: 1, // 문제 1층
    },
    problemImage: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: 10,
    },
    canvasContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2, // 캔버스 2층
    },
    canvas: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    floatingToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 3, // 플로팅 버튼 3층
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    colorButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    sizeButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    resetButton: {
        padding: 10,
        backgroundColor: '#FF5252',
        borderRadius: 5,
    },
});

export default LessoningScreen;
