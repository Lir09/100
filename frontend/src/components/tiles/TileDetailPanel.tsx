"use client";

import { useRealtime } from "../providers/RealtimeProvider";

export default function TileDetailPanel({ tileId }: { tileId: string | null }) {
  const { tiles } = useRealtime();

  if (!tileId) {
    return (
      <p className="text-sm text-slate-400">
        왼쪽 배치도에서 타일을 선택하면 센서 상세 정보를 볼 수 있습니다.
      </p>
    );
  }

  const tile = tiles[tileId];

  if (!tile) {
    return (
      <p className="text-sm text-slate-400">
        타일 {tileId} 데이터가 아직 들어오지 않았습니다.
      </p>
    );
  }

  const statusLabel =
    tile.alarmStatus === "alarm"
      ? "알람"
      : tile.alarmStatus === "warn"
      ? "주의"
      : tile.alarmStatus === "fault"
      ? "장애"
      : "정상";

  return (
    <div className="grid gap-2 text-sm md:grid-cols-2">
      <div>
        <div className="text-xs text-slate-400">타일 ID</div>
        <div className="font-semibold">{tile.tileId}</div>
      </div>
      <div>
        <div className="text-xs text-slate-400">상태</div>
        <div className="font-semibold">{statusLabel}</div>
      </div>
      <div>
        <div className="text-xs text-slate-400">위험도 (EMA)</div>
        <div className="font-mono text-lg">{tile.riskScore.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-xs text-slate-400">최신 업데이트</div>
        <div className="font-mono">
          {new Date(tile.updatedAt).toLocaleTimeString("ko-KR", {
            timeZone: "Asia/Seoul",
          })}
        </div>
      </div>
      <div>
        <div className="text-xs text-slate-400">온도 (°C)</div>
        <div className="font-mono">{tile.temperature.toFixed(1)}</div>
      </div>
      <div>
        <div className="text-xs text-slate-400">연기 (0~1)</div>
        <div className="font-mono">{tile.smoke.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-xs text-slate-400">조도 (0~1)</div>
        <div className="font-mono">{tile.illuminance.toFixed(2)}</div>
      </div>
    </div>
  );
}
