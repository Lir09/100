"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type TileState = {
  tileId: string;
  riskScore: number; // 0~1
  alarmStatus: "none" | "warn" | "alarm" | "fault";
  temperature: number;
  smoke: number;
  illuminance: number;
  updatedAt: number; // timestamp(ms)
};

type EventLogItem = {
  id: string;
  timestamp: number;
  tileId: string;
  state: "warn" | "alarm" | "fault";
  riskScore: number;
  reasonText: string;
  contributions?: {
    temperature: number;
    tempSlope: number;
    smoke: number;
    luminanceDelta: number;
  };
};

type RealtimeContextValue = {
  tiles: Record<string, TileState>;
  events: EventLogItem[];
  selectedTileId: string | null;
  setSelectedTileId: (id: string | null) => void;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [tiles, setTiles] = useState<Record<string, TileState>>({});
  const [events, setEvents] = useState<EventLogItem[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL;
    if (!url) {
      console.warn("NEXT_PUBLIC_WS_URL 미설정");
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] connected");
      // 필요하면 구독 메세지 전송
      // ws.send(JSON.stringify({ type: "subscribe", channel: "tiles" }));
    };

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);

        switch (msg.type) {
          case "tile_state": {
            const t: TileState = msg.payload;
            setTiles((prev) => ({
              ...prev,
              [t.tileId]: t,
            }));
            break;
          }
          case "event": {
            const e: EventLogItem = msg.payload;
            setEvents((prev) => {
              const next = [e, ...prev];
              // 최근 200개만 유지 같은 정책
              return next.slice(0, 200);
            });
            break;
          }
          default:
            break;
        }
      } catch (e) {
        console.error("WS message parse error", e);
      }
    };

    ws.onclose = () => {
      console.log("[WS] closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const value: RealtimeContextValue = {
    tiles,
    events,
    selectedTileId,
    setSelectedTileId,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error("useRealtime must be used within RealtimeProvider");
  return ctx;
}
