"use client";

import TileGrid from "@/components/tiles/TileGrid";
import TileDetailPanel from "@/components/tiles/TileDetailPanel";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import EventLog from "@/components/logs/EventLog";
import SettingsPanel from "@/components/settings/SettingsPanel";
import { useRealtime } from "@/components/providers/RealtimeProvider";

export default function Page() {
  const { selectedTileId } = useRealtime();

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-6">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            스마트 화재 감지 타일 대시보드
          </h1>
          <p className="text-sm text-slate-400">
            온도·연기·조도·위험도 기반 실시간 모니터링
          </p>
        </div>
        <SettingsPanel />
      </header>

      <section className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 왼쪽: 지도 + 타일 상세 */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="mb-2 text-sm font-medium text-slate-300">
              지도 뷰(교실 배치도)
            </h2>
            <TileGrid />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="mb-2 text-sm font-medium text-slate-300">
              타일 상세 정보
            </h2>
            <TileDetailPanel tileId={selectedTileId} />
          </div>
        </div>

        {/* 오른쪽: 시계열 + 이벤트 로그 */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="mb-2 text-sm font-medium text-slate-300">
              시계열 그래프 (최근 5분)
            </h2>
            <TimeSeriesChart tileId={selectedTileId} />
          </div>

          <div className="min-h-[240px] flex-1 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="mb-2 text-sm font-medium text-slate-300">
              이벤트 로그
            </h2>
            <EventLog />
          </div>
        </div>
      </section>
    </main>
  );
}
