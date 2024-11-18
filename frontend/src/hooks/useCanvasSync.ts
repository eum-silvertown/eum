import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { DrawingEvent, CanvasState } from '~types/canvas';

export const useCanvasSync = (
  roomId: string,
  onRemoteDrawing: (event: DrawingEvent) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentState, setCurrentState] = useState<CanvasState>({
    events: [],
    version: 0,
  });

  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://k11d101.p.ssafy.io/ws-gateway/drawing');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = () => {
      console.log('connected');
      setIsConnected(true);

      stompClient.current?.subscribe(
        `/topic/classroom/${roomId}`,
        message => {
          const event: DrawingEvent = JSON.parse(message.body);
          console.log('DrawingEvent', event);
          onRemoteDrawing(event);

          setCurrentState(prev => ({
            events: [...prev.events, event],
            version: prev.version + 1,
          }));
        }
      );

      // 초기 상태 요청
      // requestInitialState();
    };

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, onRemoteDrawing]);

  // const requestInitialState = useCallback(async () => {
  //   try {
  //     const response = await fetch(`http://k11d101.p.ssafy.io/ws-gateway/drawing/rooms/${roomId}/state`);
  //     const initialState: CanvasState = await response.json();
  //     setCurrentState(initialState);
  //   } catch (error) {
  //     console.error('Failed to fetch initial state:', error);
  //   }
  // }, [roomId]);

  const sendEvent = useCallback((event: DrawingEvent) => {
    // console.log('sendEvent', event);
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/drawing/classroom/${roomId}`,
        body: JSON.stringify(event),
      });
      console.log('sendEvent', event);
    }
  }, [roomId]);

  return {
    sendEvent,
    currentState,
    isConnected,
  };
};
