"use client";

import { useState } from "react";

export default function SettingsPanel() {
  const [preset, setPreset] = useState<"A" | "B">("A");

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs">
      <span className="text-slate-300">알고리즘 프리셋</span>
      <select
        className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
        value={preset}
        onChange={(e) => setPreset(e.target.value as "A" | "B")}
      >
        <option value="A">A안 (보수적: ON 0.90 / OFF 0.70)</option>
        <option value="B">B안 (민감도: ON 0.70 / OFF 0.50)</option>
      </select>
      {/* 프리셋은 UI 목업용 - 계산식은 더미 데이터로 동작 */}
    </div>
  );
}
