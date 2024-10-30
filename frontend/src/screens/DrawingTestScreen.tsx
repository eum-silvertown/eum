import {Text} from '@components/common/Text';
import {Canvas, Path, Skia, useCanvasRef} from '@shopify/react-native-skia';
import {useEffect, useMemo, useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {io} from 'socket.io-client';

const ROOM_ID = 'canvas';

function DrawingTestScreen(): React.JSX.Element {
  const {socket: websocket1, socketError: error1} = useWebSocket('user1');
  const {socket: websocket2, socketError: error2} = useWebSocket('user2');

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {error1 ? (
          <View>
            <Text>{error1}</Text>
          </View>
        ) : (
          <SharedCanvas socket={websocket1} />
        )}
      </View>
      <View style={styles.container}>
        {error2 ? (
          <View>
            <Text>{error2}</Text>
          </View>
        ) : (
          <SharedCanvas socket={websocket2} />
        )}
      </View>
    </View>
  );
}

export default DrawingTestScreen;

interface SharedCanvasProps {
  socket: any;
}

type PathType = {
  roomId: string;
  path: any;
  color: string;
  strokeWidth: number;
};

function SharedCanvas({socket}: SharedCanvasProps): React.JSX.Element {
  const [paths, setPaths] = useState<PathType[]>([]);
  const [currentPath, setCurrentPath] = useState<any | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [roomId, setRoomId] = useState(ROOM_ID);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const canvasRef = useCanvasRef();

  // Debounce function to emit current path every 0.1 seconds
  const emitPathDebounced = useCallback(() => {
    if (currentPath) {
      const pathString = currentPath.toSVGString();
      socket.emit('draw-operation', {
        roomId,
        pathString,
        penColor,
        penSize,
      });
      setPaths(prevPaths => [
        ...prevPaths,
        {roomId, path: currentPath, color: penColor, strokeWidth: penSize},
      ]);
      setCurrentPath(Skia.Path.Make()); // reset currentPath
    }
  }, [currentPath, socket, roomId, penColor, penSize]);

  useEffect(() => {
    const interval = setInterval(emitPathDebounced, 200);
    return () => clearInterval(interval);
  }, [emitPathDebounced]);

  const handleTouchStart = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    const newPath = Skia.Path.Make();
    newPath.moveTo(locationX, locationY);
    setCurrentPath(newPath);
    setLastPosition({x: locationX, y: locationY});
  };

  const handleTouchMove = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    if (lastPosition) {
      currentPath.moveTo(lastPosition?.x, lastPosition?.y);
    }
    currentPath.lineTo(locationX, locationY);

    setLastPosition({x: locationX, y: locationY});
    requestAnimationFrame(() => canvasRef.current?.redraw());
  };

  const handleTouchEnd = () => {
    if (currentPath) {
      const pathString = currentPath.toSVGString();
      socket.emit('draw-operation', {
        roomId,
        pathString,
        penColor,
        penSize,
      });
      setPaths(prevPaths => [
        ...prevPaths,
        {roomId, path: currentPath, color: penColor, strokeWidth: penSize},
      ]);
      setCurrentPath(null); // reset after end
      setLastPosition(null);
    }
  };

  useEffect(() => {
    socket.on('draw-operation', (data: any) => {
      const receivePath = Skia.Path.MakeFromSVGString(data.pathString);
      if (receivePath) {
        setPaths(prevPaths => [
          ...prevPaths,
          {
            roomId: roomId,
            path: receivePath,
            color: data.penColor,
            strokeWidth: data.penSize,
          },
        ]);
      }
    });
    return () => {
      socket.off('draw-operation');
    };
  }, [socket, roomId]);

  return (
    <Canvas
      ref={canvasRef}
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {paths.map(({path, color, strokeWidth}, index) => (
        <Path
          key={index}
          path={path}
          color={Skia.Color(color)}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          strokeJoin="round"
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
        />
      )}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});

function useWebSocket(userId: string) {
  const [socketError, setSocketError] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const socket = useMemo(() => {
    const SERVER_URL = 'http://192.168.100.104:3001';

    const newSocket = io(SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
      timeout: 10000,
    });
    newSocket.on('connect', () => {
      console.log(`User ${userId} connected with socket Id:`, newSocket.id);
      setIsConnected(true);
      setSocketError('');

      // 연결 후 room 참여
      newSocket.emit('join-room', ROOM_ID);
    });

    newSocket.on('connect_error', error => {
      console.error(`User ${userId} connection error:`, error.message);
      setSocketError(`Connection error: ${error.message}`);
      setIsConnected(false);
    });

    newSocket.on('join-room', roomId => {
      console.log(`User ${userId} successfully joined room: ${roomId}`);
    });

    return newSocket;
  }, [userId]);

  useEffect(() => {
    return () => {
      if (socket) {
        console.log(`Cleaning up socket connection for user ${userId}`);
        socket.disconnect();
      }
    };
  }, [socket, userId]);

  return {socket, socketError, isConnected};
}
