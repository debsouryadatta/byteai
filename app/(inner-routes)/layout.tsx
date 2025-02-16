import { Sidebar } from "@/components/sidebar";

export default function InnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="relative">
        <Sidebar />
      </aside>
      <main className="relative flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
