"use client";

import { useRealtime } from "@/components/providers/RealtimeProvider";

const ROWS = ["A", "B", "C", "D"];
const COLS = [1, 2, 3, 4];

function getTileColor(risk: number, alarmStatus: string) {
  if (alarmStatus === "fault") return "bg-slate-700 border-pink-500";
  if (risk < 0.3) return "bg-emerald-600/70 border-emerald-300/70";
  if (risk < 0.7) return "bg-yellow-500/70 border-yellow-200/80";
  return "bg-red-600/80 border-red-300/80";
}

export default function TileGrid() {
  const { tiles, selectedTileId, setSelectedTileId } = useRealtime();

  return (
    <div className="inline-grid grid-cols-4 gap-2">
      {ROWS.map((r) =>
        COLS.map((c) => {
          const id = `${r}${c}`;
          const tile = tiles[id];
          const risk = tile?.riskScore ?? 0;
          const alarm = tile?.alarmStatus ?? "none";

          const active = selectedTileId === id;

          return (
            <button
              key={id}
              onClick={() => setSelectedTileId(id)}
              className={[
                "flex h-16 w-16 flex-col items-center justify-center rounded-lg border text-xs transition",
                getTileColor(risk, alarm),
                active ? "ring-2 ring-cyan-400" : "ring-0",
              ].join(" ")}
            >
              <span className="font-semibold">{id}</span>
              <span className="mt-1 text-[10px] text-slate-50/80">
                {(risk * 100).toFixed(0)}%
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
