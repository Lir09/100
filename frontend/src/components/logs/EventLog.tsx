"use client";

import { useRealtime } from "../providers/RealtimeProvider";

export default function EventLog() {
  const { events, setSelectedTileId } = useRealtime();

  if (!events.length) {
    return (
      <p className="text-sm text-slate-400">
        아직 발생한 이벤트가 없습니다. 곧 모의 데이터가 들어옵니다.
      </p>
    );
  }

  return (
    <div className="h-56 overflow-y-auto pr-1 text-xs">
      <ul className="space-y-2">
        {events.map((e) => (
          <li
            key={e.id}
            className="flex cursor-pointer items-start justify-between rounded border border-slate-700 bg-slate-900/60 px-2 py-1.5 hover:bg-slate-800/80"
            onClick={() => setSelectedTileId(e.tileId)}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400">
                  {new Date(e.timestamp).toLocaleTimeString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}
                </span>
                <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px]">
                  {e.tileId}
                </span>
                <span
                  className={
                    "rounded px-1.5 py-0.5 text-[10px] " +
                    (e.state === "alarm"
                      ? "bg-red-600/80"
                      : e.state === "warn"
                      ? "bg-yellow-500/80 text-slate-900"
                      : "bg-pink-500/80")
                  }
                >
                  {e.state === "alarm"
                    ? "알람"
                    : e.state === "warn"
                    ? "주의"
                    : "장애"}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-200">
                {e.reasonText}
              </div>
            </div>
            <div className="ml-2 text-right">
              <div className="font-mono text-[11px] text-slate-50">
                {(e.riskScore * 100).toFixed(0)}%
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
