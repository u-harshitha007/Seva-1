export interface NodeData {
  id: string;
  name: string;
  location: { lat: number; lng: number; x: number; y: number };
  status: 'online' | 'warning' | 'critical' | 'offline';
  vehicleDensity: number;
  obstacleDetected: boolean;
  waterloggingRisk: number;
  crowdDensity: number;
  ambientVisibility: number;
  pedestrianActivity: number;
  signalState: 'green' | 'yellow' | 'red' | 'emergency';
  temperature: number;
  humidity: number;
  windSpeed: number;
  lastUpdated: number;
  connectedNodes: string[];
  riskScore: number;
}

export interface AIAlert {
  id: string;
  nodeId: string;
  nodeName: string;
  type: 'collision' | 'flood' | 'congestion' | 'pedestrian' | 'obstacle' | 'visibility' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  confidence: number;
  predictedImpactRadius: number;
  timestamp: number;
  resolved: boolean;
  adaptiveResponse?: string;
}

export interface PredictionResult {
  nodeId: string;
  collisionRisk: number;
  floodRisk: number;
  congestionProbability: number;
  pedestrianRisk: number;
  overallRisk: number;
  confidence: number;
  predictedAt: number;
}

export interface SystemHealth {
  totalNodes: number;
  onlineNodes: number;
  activeAlerts: number;
  criticalAlerts: number;
  avgRiskScore: number;
  systemUptime: number;
  predictionAccuracy: number;
  responseLatency: number;
}

export interface TrafficFlow {
  nodeId: string;
  timestamp: number;
  inflow: number;
  outflow: number;
  avgSpeed: number;
  congestionIndex: number;
}

export interface MqttEvent {
  topic: string;
  payload: Record<string, unknown>;
}
