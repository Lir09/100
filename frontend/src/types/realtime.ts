export type AlarmStatus = "none" | "warn" | "alarm" | "fault";

export type TileState = {
  tileId: string;
  riskScore: number; // 0~1
  alarmStatus: AlarmStatus;
  temperature: number;
  smoke: number;
  illuminance: number;
  updatedAt: number; // timestamp(ms)
};

export type EventLogItem = {
  id: string;
  timestamp: number;
  tileId: string;
  state: Exclude<AlarmStatus, "none">;
  riskScore: number;
  reasonText: string;
  contributions?: {
    temperature: number;
    tempSlope: number;
    smoke: number;
    luminanceDelta: number;
  };
};
