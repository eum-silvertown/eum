import {Text} from '@components/common/Text';
import {useCallback, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

type Tool = 'whiteCholk' | 'redCholk' | 'blueCholk' | 'eraser';

interface ToolbarProps {
  currentTool: React.MutableRefObject<Tool>;
  currentColor: React.MutableRefObject<string>;
}

export default function Toolbar({
  currentTool,
  currentColor,
}: ToolbarProps): React.JSX.Element {
  const [selectedTool, setSelectedTool] = useState<Tool>('whiteCholk');

  const handleToolChange = useCallback((tool: Tool) => {
    currentTool.current = tool;
    setSelectedTool(tool);
    switch (tool) {
      case 'whiteCholk':
        currentColor.current = '#ffffff';
        break;
      case 'redCholk':
        currentColor.current = '#ff4f4f';
        break;
      case 'blueCholk':
        currentColor.current = '#5c8fff';
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.toolbar}>
      <View style={styles.cholks}>
        <Pressable
          style={[
            styles.whiteCholk,
            selectedTool === 'whiteCholk' && styles.selectedTool,
          ]}
          onPress={() => handleToolChange('whiteCholk')}
        />
        <Pressable
          style={[
            styles.redCholk,
            selectedTool === 'redCholk' && styles.selectedTool,
          ]}
          onPress={() => handleToolChange('redCholk')}
        />
        <Pressable
          style={[
            styles.blueCholk,
            selectedTool === 'blueCholk' && styles.selectedTool,
          ]}
          onPress={() => handleToolChange('blueCholk')}
        />
      </View>
      <Pressable
        style={[
          styles.eraser,
          selectedTool === 'eraser' && styles.selectedTool,
        ]}
        onPress={() => handleToolChange('eraser')}>
        <Text color="white">지우개</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    width: '100%',
  },
  cholks: {
    flexDirection: 'row',
    gap: 15,
  },
  whiteCholk: {
    width: 80,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  redCholk: {
    width: 80,
    height: 20,
    backgroundColor: '#ff4f4f',
    borderRadius: 5,
  },
  blueCholk: {
    width: 80,
    height: 20,
    backgroundColor: '#5c8fff',
    borderRadius: 5,
  },
  eraser: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 60,
    backgroundColor: '#550055',
    borderRadius: 10,
  },
  selectedTool: {
    borderWidth: 2,
    borderColor: '#ffff00',
  },
});
