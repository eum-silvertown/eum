import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Canvas, Circle, Path, Skia} from '@shopify/react-native-skia';
import UndoOffIcon from '@assets/icons/undoOffIcon.svg';
import UndoOnIcon from '@assets/icons/undoOnIcon.svg';
import RedoOffIcon from '@assets/icons/redoOffIcon.svg';
import RedoOnIcon from '@assets/icons/redoOnIcon.svg';
import EraserOffIcon from '@assets/icons/eraserOffIcon.svg';
import EraserOnIcon from '@assets/icons/eraserOnIcon.svg';
import HighlighterOffIcon from '@assets/icons/highlighterOffIcon.svg';
import HighlighterOnIcon from '@assets/icons/highlighterOnIcon.svg';
import {iconSize} from '@theme/iconSize';

type CanvasComponentProps = {
  canvasRef: React.RefObject<any>;
  paths: {path: any; color: string; strokeWidth: number; opacity: number}[];
  currentPath: any | null;
  penColor: string;
  penSize: number;
  penOpacity: number;
  handleTouchStart: (event: any) => void;
  handleTouchMove: (event: any) => void;
  handleTouchEnd: () => void;
  setPenColor: (color: string) => void;
  setPenSize: (size: number) => void;
  togglePenOpacity?: () => void;
  undo?: () => void;
  redo?: () => void;
  undoStack: number | null;
  redoStack: number | null;
  toggleEraserMode?: () => void;
  isErasing?: boolean;
  eraserPosition?: {x: number; y: number} | null;
  startRecording?: () => void;
  stopRecording?: () => void;
  isRecording?: boolean;
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
  undoStack,
  redoStack,
  toggleEraserMode,
  isErasing,
  eraserPosition,
  startRecording,
  stopRecording,
  isRecording,
}: CanvasComponentProps) => (
  <View style={styles.canvasLayout}>
    <View style={styles.canvasContainer}>
      <Canvas
        ref={canvasRef}
        style={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {paths.map(({path, color, strokeWidth, opacity}, index) => (
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
                {backgroundColor: color},
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

        {/* 형광펜 아이콘 */}
        <TouchableOpacity onPress={togglePenOpacity}>
          {penOpacity < 1 ? (
            <HighlighterOnIcon width={iconSize.lg} height={iconSize.lg} />
          ) : (
            <HighlighterOffIcon width={iconSize.lg} height={iconSize.lg} />
          )}
        </TouchableOpacity>

        {/* Undo 아이콘 */}
        <TouchableOpacity onPress={undo}>
          {undoStack ? (
            <UndoOnIcon width={iconSize.lg} height={iconSize.lg} />
          ) : (
            <UndoOffIcon width={iconSize.lg} height={iconSize.lg} />
          )}
        </TouchableOpacity>

        {/* Redo 아이콘 */}
        <TouchableOpacity onPress={redo}>
          {redoStack ? (
            <RedoOnIcon width={iconSize.lg} height={iconSize.lg} />
          ) : (
            <RedoOffIcon width={iconSize.lg} height={iconSize.lg} />
          )}
        </TouchableOpacity>

        {/* 지우개 아이콘 */}
        <TouchableOpacity onPress={toggleEraserMode}>
          {isErasing ? (
            <EraserOnIcon width={iconSize.lg} height={iconSize.lg} />
          ) : (
            <EraserOffIcon width={iconSize.lg} height={iconSize.lg} />
          )}
        </TouchableOpacity>
        {/* 녹화 시작/중지 버튼 */}
        {isRecording ? (
          <TouchableOpacity
            onPress={stopRecording}
            style={styles.recordingButtonActive}>
            <Text style={styles.buttonText}>녹화 중지</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startRecording}
            style={styles.recordingButton}>
            <Text style={styles.buttonText}>녹화 시작</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

export default CanvasDrawingTool;

const styles = StyleSheet.create({
  canvasLayout: {
    ...StyleSheet.absoluteFillObject,
  },
  canvasContainer: {flex: 1, backgroundColor: 'transparent'},
  canvas: {flex: 1},
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
    alignItems: 'center',
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
    alignItems: 'center',
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
    paddingHorizontal: 3,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  buttonText: {color: '#000', fontWeight: 'bold'},
  recordingButton: {
    paddingVertical: 5,
    paddingHorizontal: 3,
    backgroundColor: '#32CD32', // 녹화 시작 버튼 색상
    borderRadius: 5,
  },
  recordingButtonActive: {
    paddingVertical: 5,
    paddingHorizontal: 3,
    backgroundColor: '#FF4500', // 녹화 중 버튼 색상
    borderRadius: 5,
  },
});
