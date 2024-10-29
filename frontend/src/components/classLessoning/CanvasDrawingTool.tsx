import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';

type CanvasComponentProps = {
    canvasRef: React.RefObject<any>;
    paths: { path: any; color: string; strokeWidth: number; opacity: number }[];
    currentPath: any | null;
    penColor: string;
    penSize: number;
    penOpacity: number;
    handleTouchStart: (event: any) => void;
    handleTouchMove: (event: any) => void;
    handleTouchEnd: () => void;
    setPenColor: (color: string) => void;
    setPenSize: (size: number) => void;
    togglePenOpacity: () => void;
    undo: () => void;
    redo: () => void;
    toggleEraserMode: () => void;
    isErasing: boolean;
    eraserPosition: { x: number; y: number } | null;
};

const COLOR_PALETTE = ['#000000', '#FF5F5F', '#FFCD29', '#14AE5C', '#0D99FF'];
const PEN_SIZES = [2, 4, 6, 8, 10];

const CanvasDrawingTool = ({
    canvasRef,
    paths,
    currentPath,
    penColor,
    penSize,
    penOpacity,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setPenColor,
    setPenSize,
    togglePenOpacity,
    undo,
    redo,
    toggleEraserMode,
    isErasing,
    eraserPosition,
}: CanvasComponentProps) => (
    <View style={styles.canvasContainer}>
        <Canvas
            ref={canvasRef}
            style={styles.canvas}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            {paths.map(({ path, color, strokeWidth, opacity }, index) => (
                <Path
                    key={index}
                    path={path}
                    color={Skia.Color(color)}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    strokeCap="round"
                    strokeJoin="round"
                    opacity={opacity}
                />
            ))}
            {currentPath && (
                <Path
                    path={currentPath}
                    color={Skia.Color(penColor)}
                    style="stroke"
                    strokeWidth={penSize}
                    strokeCap="round"
                    strokeJoin="round"
                    opacity={penOpacity}
                />
            )}
            {/* 지우개 범위 시각화 */}
            {isErasing && eraserPosition && (
                <Circle
                    cx={eraserPosition.x}
                    cy={eraserPosition.y}
                    r={10}
                    color="rgba(0, 0, 0, 0.1)"
                    style="stroke"
                    strokeWidth={2}
                />
            )}
        </Canvas>

        {/* 툴바 */}
        <View style={styles.floatingToolbar}>
            <View style={styles.paletteContainer}>
                {COLOR_PALETTE.map(color => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorPalette,
                            { backgroundColor: color },
                            penColor === color && styles.selectedColor,
                        ]}
                        onPress={() => setPenColor(color)}
                    />
                ))}
            </View>

            <View style={styles.penSizeContainer}>
                {PEN_SIZES.map(size => (
                    <TouchableOpacity
                        key={size}
                        style={[
                            styles.penSize,
                            penSize === size && styles.selectedPenSize,
                        ]}
                        onPress={() => setPenSize(size)}>
                        <View
                            style={{
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                backgroundColor: penColor,
                            }}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                onPress={togglePenOpacity}
                style={[
                    styles.highlighterButton,
                    penOpacity < 1 && styles.activeHighlighter,
                ]}>
                <Text style={styles.buttonText}>형광펜</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={undo} style={styles.toolbarButton}>
                <Text style={styles.buttonText}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={redo} style={styles.toolbarButton}>
                <Text style={styles.buttonText}>Redo</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={toggleEraserMode}
                style={isErasing ? styles.activeEraser : styles.eraserButton}>
                <Text style={styles.buttonText}>지우개</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default CanvasDrawingTool;

const styles = StyleSheet.create({
    canvasContainer: { flex: 1, backgroundColor: 'transparent' },
    canvas: { flex: 1 },
    floatingToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    paletteContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    colorPalette: {
        width: 25,
        height: 25,
        borderRadius: 15,
        marginHorizontal: 1.5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#000',
    },
    penSizeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    penSize: {
        width: 25,
        height: 25,
        borderRadius: 15,
        marginHorizontal: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '#eee',
    },
    selectedPenSize: {
        borderColor: '#000',
        borderWidth: 3,
    },
    highlighterButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    activeHighlighter: {
        backgroundColor: '#FFD700',
    },
    toolbarButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    eraserButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    activeEraser: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#FFA500',
        borderRadius: 5,
    },
    buttonText: { color: '#000', fontWeight: 'bold' },
});
