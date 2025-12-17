"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

import {
  defaultSelectedTileId,
  initialTiles,
  mockEvents,
  tileUpdateQueue,
} from "@/data/mockData";
import { EventLogItem, TileState } from "@/types/realtime";

type RealtimeContextValue = {
  tiles: Record<string, TileState>;
  events: EventLogItem[];
  selectedTileId: string | null;
  setSelectedTileId: (id: string | null) => void;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

const TILE_UPDATE_MS = 2500;
const EVENT_PUSH_MS = 4500;
const INITIAL_EVENT_COUNT = 3;

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [tiles, setTiles] = useState<Record<string, TileState>>(() => {
    const stamped: Record<string, TileState> = {};
    const baseUpdatedAt = initialTiles[0]?.updatedAt ?? 0;
    initialTiles.forEach((tile, idx) => {
      stamped[tile.tileId] = {
        ...tile,
        updatedAt: baseUpdatedAt + idx * 500,
      };
    });
    return stamped;
  });

  const [events, setEvents] = useState<EventLogItem[]>(() => {
    const initial = mockEvents.slice(0, INITIAL_EVENT_COUNT);
    return initial.reverse();
  });

  const [selectedTileId, setSelectedTileId] = useState<string | null>(
    defaultSelectedTileId ?? initialTiles[0]?.tileId ?? null
  );

  const tileCursorRef = useRef(0);
  const eventCursorRef = useRef(
    Math.min(INITIAL_EVENT_COUNT, mockEvents.length)
  );

  useEffect(() => {
    const applyNextTileFrame = () => {
      const nextFrame =
        tileUpdateQueue[tileCursorRef.current % tileUpdateQueue.length];
      tileCursorRef.current += 1;

      setTiles((prev) => ({
        ...prev,
        [nextFrame.tileId]: { ...nextFrame, updatedAt: Date.now() },
      }));
    };

    const tileTimer = window.setInterval(applyNextTileFrame, TILE_UPDATE_MS);
    applyNextTileFrame();

    const pushNextEvent = () => {
      const next = mockEvents[eventCursorRef.current];
      if (!next) return;
      eventCursorRef.current += 1;
      setEvents((prev) => [next, ...prev].slice(0, 200));
    };

    const eventTimer = window.setInterval(pushNextEvent, EVENT_PUSH_MS);

    return () => {
      window.clearInterval(tileTimer);
      window.clearInterval(eventTimer);
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
