import "./globals.css";
import type { Metadata } from "next";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";

export const metadata: Metadata = {
  title: "스마트 화재 감지 타일 대시보드",
  description: "다중 센서 융합 기반 스마트 화재 감지 시스템 모니터링 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <RealtimeProvider>{children}</RealtimeProvider>
      </body>
    </html>
  );
}
