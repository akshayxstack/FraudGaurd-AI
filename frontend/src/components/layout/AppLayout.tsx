import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  title: string | ReactNode;
  subtitle?: string;
  searchPlaceholder?: string;
}

export default function AppLayout({ children, title, subtitle, searchPlaceholder }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans flex w-full">
      <Sidebar />
      <div className="flex-1 pl-[260px] flex flex-col min-h-screen min-w-0 w-full">
        <Topbar title={title} subtitle={subtitle} searchPlaceholder={searchPlaceholder} />
        <main className="flex-grow p-8 w-full min-w-0 flex flex-col min-h-0">
          <div className="w-full min-w-0 flex flex-col flex-1 min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
