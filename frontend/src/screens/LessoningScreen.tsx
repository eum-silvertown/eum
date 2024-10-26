import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
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
    const [penColor, setPenColor] = useState('#000000');
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

            {/* 도구 선택 영역 */}
            <View style={styles.toolPanel}>
                <Text>도구 선택</Text>

                {/* 색상 선택 */}
                <View style={styles.colorOptions}>
                    {['#000000', '#FF0000', '#00FF00', '#0000FF'].map((color) => (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorButton, { backgroundColor: color }, penColor === color && styles.selectedColorButton]}
                            onPress={() => setPenColor(color)}
                        />
                    ))}
                </View>

                {/* 펜 굵기 선택 */}
                <View style={styles.penSizeButtons}>
                    {[2, 4, 6].map((size) => (
                        <TouchableOpacity
                            key={size}
                            style={[styles.penButton, penSize === size && styles.activePenButton]}
                            onPress={() => setPenSize(size)}
                        >
                            <Text>{size}px</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity onPress={resetPaths} style={styles.resetButton}>
                    <Text style={styles.resetText}>지우기</Text>
                </TouchableOpacity>
            </View>

            {/* 캔버스 영역 */}
            <View
                style={styles.canvasContainer}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <Canvas ref={canvasRef} style={styles.canvas}>
                    {paths.map(({ path, color, strokeWidth }, index) => (
                        <Path key={index} path={path} color={Skia.Color(color)} style="stroke" strokeWidth={strokeWidth} />
                    ))}
                    {currentPath && (
                        <Path path={currentPath} color={Skia.Color(penColor)} style="stroke" strokeWidth={penSize} />
                    )}
                    {/* 문제 텍스트와 이미지 */}
                </Canvas>
                <ScrollView contentContainerStyle={styles.problemContainer}>
                    <MathJax html={`<p>${textWithoutImage}</p>`} />
                    {imageUrl && (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.problemImage}
                        />
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    problemContainer: {
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    toolPanel: {
        padding: 16,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    colorOptions: {
        flexDirection: 'row',
    },
    colorButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    selectedColorButton: {
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    penSizeButtons: {
        flexDirection: 'row',
        marginHorizontal: 8,
    },
    penButton: {
        padding: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#ddd',
    },
    activePenButton: {
        backgroundColor: '#4CAF50',
    },
    resetButton: {
        padding: 8,
        backgroundColor: '#FF5252',
        borderRadius: 4,
    },
    resetText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    canvasContainer: {
        flex: 1,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    problemImage: {
        width: 100,
        height: 150,
        alignSelf: 'center',
    },
    canvas: {
        width: '100%',
        height: '100%',
    },
});

export default LessoningScreen;
