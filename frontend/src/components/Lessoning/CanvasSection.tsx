import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';

function CanvasSection(): React.JSX.Element {
    const canvasRef = useCanvasRef();
    const [paths, setPaths] = useState<{ path: Path; color: string; strokeWidth: number }[]>([]);
    const [currentPath, setCurrentPath] = useState<Path | null>(null);
    const [penColor, setPenColor] = useState('#000000'); // 기본 검정색 펜
    const [penSize, setPenSize] = useState(2);

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
            const newPathData = { path: currentPath, color: penColor, strokeWidth: penSize };
            console.log(newPathData);
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

    const removePath = (index: number) => {
        setPaths((prevPaths) => prevPaths.filter((_, i) => i !== index));
    };

    return (
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
            <View style={styles.floatingToolbar}>
                <TouchableOpacity onPress={() => removePath(paths.length - 1)} style={styles.removeButton}>
                    <Text style={styles.buttonText}>Remove Last Path</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPenColor('#FF0000')}>
                    <Text style={styles.buttonText}>Red</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPenColor('#00FF00')}>
                    <Text style={styles.buttonText}>Green</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPenColor('#0000FF')}>
                    <Text style={styles.buttonText}>Blue</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPenSize(4)}>
                    <Text style={styles.buttonText}>Size: 4</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPenSize(6)}>
                    <Text style={styles.buttonText}>Size: 6</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={resetPaths}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    removeButton: {
        padding: 10,
        backgroundColor: '#FF5252',
        borderRadius: 5,
    },
});

export default CanvasSection;
