'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { NodeData, AIAlert, PredictionResult, SystemHealth, TrafficFlow, MqttEvent } from '@/types';

const BACKEND_URL = 'http://localhost:4000';

export interface RastaState {
  nodes: NodeData[];
  alerts: AIAlert[];
  predictions: PredictionResult[];
  health: SystemHealth | null;
  trafficFlows: TrafficFlow[];
  mqttEvents: MqttEvent[];
  connected: boolean;
  eventLog: string[];
}

const DEFAULT_HEALTH: SystemHealth = {
  totalNodes: 5,
  onlineNodes: 5,
  activeAlerts: 0,
  criticalAlerts: 0,
  avgRiskScore: 0,
  systemUptime: 0,
  predictionAccuracy: 87,
  responseLatency: 15,
};

export function useSocket(): RastaState {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<RastaState>({
    nodes: [],
    alerts: [],
    predictions: [],
    health: DEFAULT_HEALTH,
    trafficFlows: [],
    mqttEvents: [],
    connected: false,
    eventLog: [],
  });

  const addLog = useCallback((msg: string) => {
    setState((prev) => ({
      ...prev,
      eventLog: [msg, ...prev.eventLog].slice(0, 60),
    }));
  }, []);

  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setState((prev) => ({ ...prev, connected: true }));
      addLog('🔗 Connected to RASTA Cortex backend');
    });

    socket.on('disconnect', () => {
      setState((prev) => ({ ...prev, connected: false }));
      addLog('⚡ Connection to backend lost — reconnecting...');
    });

    socket.on('nodes:update', (nodes: NodeData[]) => {
      setState((prev) => ({ ...prev, nodes }));
    });

    socket.on('predictions:update', (predictions: PredictionResult[]) => {
      setState((prev) => ({ ...prev, predictions }));
    });

    socket.on('health:update', (health: SystemHealth) => {
      setState((prev) => ({ ...prev, health }));
    });

    socket.on('traffic:update', (flows: TrafficFlow[]) => {
      setState((prev) => ({ ...prev, trafficFlows: flows }));
    });

    socket.on('alerts:new', (newAlerts: AIAlert[]) => {
      setState((prev) => ({
        ...prev,
        alerts: [...newAlerts, ...prev.alerts].slice(0, 50),
      }));
      newAlerts.forEach((a) => {
        addLog(`${a.severity === 'critical' ? '🚨' : '⚠️'} [${a.nodeName}] ${a.message}`);
      });
    });

    socket.on('alerts:history', (alerts: AIAlert[]) => {
      setState((prev) => ({ ...prev, alerts }));
    });

    socket.on('mqtt:event', (event: MqttEvent) => {
      setState((prev) => ({
        ...prev,
        mqttEvents: [event, ...prev.mqttEvents].slice(0, 20),
      }));
      addLog(`📡 MQTT [${event.topic}] — ${JSON.stringify(event.payload)}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [addLog]);

  return state;
}
