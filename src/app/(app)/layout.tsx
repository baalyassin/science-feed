import { NavBar } from "@/components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex flex-1 min-h-0 flex-col">{children}</div>
      <NavBar />
    </div>
  );
}
