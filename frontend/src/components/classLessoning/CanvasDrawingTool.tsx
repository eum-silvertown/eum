import {View, TouchableOpacity, StyleSheet} from 'react-native';
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
import {getResponsiveSize} from '@utils/responsive';
import {spacing} from '@theme/spacing';

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

        {/* 지우개 아이콘 */}
        <TouchableOpacity onPress={toggleEraserMode}>
          {isErasing ? (
            <EraserOnIcon width={iconSize.lg} height={iconSize.lg} />
          ) : (
            <EraserOffIcon width={iconSize.lg} height={iconSize.lg} />
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
      </View>
    </View>
  </View>
);

export default CanvasDrawingTool;

const styles = StyleSheet.create({
  canvasLayout: {
    ...StyleSheet.absoluteFillObject,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  canvas: {flex: 1},
  floatingToolbar: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{translateY: -250}],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    gap: getResponsiveSize(12),
  },
  paletteContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPalette: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    borderRadius: 15,
    marginVertical: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#ccc',
    borderWidth: 3,
  },
  penSizeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  penSize: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    borderRadius: 15,
    marginVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#eee',
  },
  selectedPenSize: {
    borderColor: '#ccc',
    borderWidth: 3,
  },
  highlighterButton: {
    paddingVertical: 5,
    paddingHorizontal: 3,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});
