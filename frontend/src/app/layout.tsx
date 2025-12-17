import "./globals.css";
import type { Metadata } from "next";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";

export const metadata: Metadata = {
  title: "스마트 화재 감시 대시보드",
  description: "센서 데이터 기반 화재 위험 모니터링 프로토타입 (JSON 더미 데이터 사용)",
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
