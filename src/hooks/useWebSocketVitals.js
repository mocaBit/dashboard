import { useState, useEffect, useRef, useCallback } from 'react';
import { createWebVitalsWebSocket, closeWebSocket } from '../services/websocketService';

/**
 * Custom hook to manage WebSocket connection for real-time Web Vitals data
 * @param {boolean} enabled - Whether WebSocket connection should be active
 * @returns {Object} { latestRecord, records, isConnected, error }
 */
export const useWebSocketWebVitals = (enabled = false) => {
  const [latestRecord, setLatestRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  const handleMessage = useCallback((newRecord) => {
    // Log new data to console
    console.log('Real-time Web Vitals update:', newRecord);

    // Update latest record
    setLatestRecord(newRecord);

    // Add to records history (keep last 50 records)
    setRecords((prev) => {
      const updated = [newRecord, ...prev];
      return updated.slice(0, 50);
    });
  }, []);

  const handleError = useCallback((err) => {
    console.error('WebSocket error:', err);
    setError(err.message || 'WebSocket connection error');
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Close WebSocket if it exists and enabled is false
      if (wsRef.current) {
        closeWebSocket(wsRef.current);
        wsRef.current = null;
        setIsConnected(false);
        setLatestRecord(null);
        setRecords([]);
        setError(null);
      }
      return;
    }

    // Create WebSocket connection for Web Vitals
    const ws = createWebVitalsWebSocket(handleMessage, handleError);
    wsRef.current = ws;

    // Update connection status when WebSocket opens
    ws.addEventListener('open', () => {
      setIsConnected(true);
      setError(null);
      console.log('WebSocket Simulator connected - real-time Web Vitals data enabled');
    });

    // Update connection status when WebSocket closes
    ws.addEventListener('close', () => {
      setIsConnected(false);
      console.log('WebSocket Simulator disconnected - real-time Web Vitals data disabled');
    });

    // Cleanup function
    return () => {
      closeWebSocket(ws);
      wsRef.current = null;
    };
  }, [enabled, handleMessage, handleError]);

  return {
    latestRecord,
    records,
    isConnected,
    error,
  };
};
