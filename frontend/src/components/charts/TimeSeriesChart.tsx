"use client";

import { useEffect, useMemo, useState } from "react";

import { useRealtime } from "../providers/RealtimeProvider";

type HistoryPoint = {
  t: number; // timestamp(ms)
  temperature: number;
  smoke: number;
  illuminance: number;
  riskScore: number;
};

const WINDOW_MS = 5 * 60 * 1000; // 최근 5분만 시각화

export default function TimeSeriesChart({ tileId }: { tileId: string | null }) {
  const { tiles } = useRealtime();
  const tile = tileId ? tiles[tileId] : undefined;

  const [history, setHistory] = useState<HistoryPoint[]>([]);

  // 타일이 바뀌면 기존 이력을 초기화
  useEffect(() => {
    setHistory([]);
  }, [tileId]);

  // 선택된 타일의 최신 값을 히스토리에 누적
  useEffect(() => {
    if (!tileId || !tile) return;

    setHistory((prev) => {
      const now = tile.updatedAt || Date.now();
      const cutoff = now - WINDOW_MS;

      const filtered = prev.filter((p) => p.t >= cutoff);

      if (filtered.length && filtered[filtered.length - 1].t === tile.updatedAt) {
        return filtered;
      }

      return [
        ...filtered,
        {
          t: now,
          temperature: tile.temperature,
          smoke: tile.smoke,
          illuminance: tile.illuminance,
          riskScore: tile.riskScore,
        },
      ];
    });
  }, [tileId, tile?.updatedAt]);

  const svgData = useMemo(() => {
    if (!history.length) return null;

    const width = 320;
    const height = 160;
    const marginLeft = 24;
    const marginRight = 4;
    const marginTop = 10;
    const marginBottom = 18;

    const xMin = history[0].t;
    const xMax = history[history.length - 1].t || xMin + 1;
    const xRange = xMax - xMin || 1;

    const xScale = (t: number) =>
      marginLeft + ((t - xMin) / xRange) * (width - marginLeft - marginRight);

    const yScale = (norm: number) =>
      marginTop +
      (1 - Math.min(Math.max(norm, 0), 1)) *
        (height - marginTop - marginBottom);

    const normTemp = (temp: number) => (temp - 20) / 70; // 20~90°C -> 0~1
    const normSmoke = (s: number) => s; // 0~1
    const normIll = (v: number) => v; // 0~1
    const normRisk = (r: number) => r; // 0~1

    const buildPath = (getter: (p: HistoryPoint) => number): string => {
      return history
        .map((p, idx) => {
          const x = xScale(p.t).toFixed(1);
          const y = yScale(getter(p)).toFixed(1);
          return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
    };

    const tempPath = buildPath((p) => normTemp(p.temperature));
    const smokePath = buildPath((p) => normSmoke(p.smoke));
    const illPath = buildPath((p) => normIll(p.illuminance));
    const riskPath = buildPath((p) => normRisk(p.riskScore));

    const alarmLines = history
      .filter((p) => p.riskScore >= 0.8)
      .map((p) => xScale(p.t));

    return {
      width,
      height,
      marginLeft,
      marginBottom,
      tempPath,
      smokePath,
      illPath,
      riskPath,
      alarmLines,
    };
  }, [history]);

  if (!tileId) {
    return (
      <p className="text-sm text-slate-400">
        그래프를 보려면 타일을 먼저 선택하세요.
      </p>
    );
  }

  if (!tile) {
    return (
      <p className="text-sm text-slate-400">
        선택한 타일 데이터가 아직 준비되지 않았습니다.
      </p>
    );
  }

  if (!svgData || history.length < 2) {
    return (
      <p className="text-sm text-slate-400">
        최근 5분 데이터 수집 중입니다...
      </p>
    );
  }

  const {
    width,
    height,
    marginLeft,
    marginBottom,
    tempPath,
    smokePath,
    illPath,
    riskPath,
    alarmLines,
  } = svgData;

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full rounded-lg bg-slate-950/60"
      >
        <line
          x1={marginLeft}
          y1={height - marginBottom}
          x2={width - 4}
          y2={height - marginBottom}
          stroke="#64748b"
          strokeWidth={0.5}
        />

        <line
          x1={marginLeft}
          x2={width - 4}
          y1={height - marginBottom - (height - marginBottom - 10) * 0.3}
          y2={height - marginBottom - (height - marginBottom - 10) * 0.3}
          stroke="#22c55e33"
          strokeDasharray="3 3"
          strokeWidth={0.5}
        />
        <line
          x1={marginLeft}
          x2={width - 4}
          y1={height - marginBottom - (height - marginBottom - 10) * 0.7}
          y2={height - marginBottom - (height - marginBottom - 10) * 0.7}
          stroke="#facc1533"
          strokeDasharray="3 3"
          strokeWidth={0.5}
        />

        {alarmLines.map((x, idx) => (
          <line
            key={idx}
            x1={x}
            x2={x}
            y1={10}
            y2={height - marginBottom}
            stroke="#ef4444aa"
            strokeWidth={0.8}
          />
        ))}

        <path d={riskPath} fill="none" stroke="#e5e7eb" strokeWidth={1.4} />

        <path d={tempPath} fill="none" stroke="#f97316" strokeWidth={1.1} />

        <path d={smokePath} fill="none" stroke="#a855f7" strokeWidth={1.1} />

        <path
          d={illPath}
          fill="none"
          stroke="#eab308"
          strokeWidth={1}
          strokeDasharray="4 2"
        />
      </svg>

      <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
        <LegendDot color="#e5e7eb" label="위험도(EMA)" />
        <LegendDot color="#f97316" label="온도" />
        <LegendDot color="#a855f7" label="연기" />
        <LegendDot color="#eab308" label="조도(상대)" />
        <span className="text-slate-500">
          붉은 세로선 = 위험도 0.8 이상 구간
        </span>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </span>
  );
}
