import { MainNav, NavTabs } from "@/components/layout";
import { ModalProvider } from "@/components/modals";
import { type ReactNode, Suspense } from "react";

export const dynamic = "force-static";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <div className="min-h-screen w-full bg-gray-50/80">
        <div className="-top-16 sticky z-20 border-gray-200 border-b bg-white">
          <div className="mx-auto w-full overflow-hidden px-6 lg:px-8">
            <MainNav />
            <Suspense fallback={<div className="h-12 w-full" />}>
              <NavTabs />
            </Suspense>
          </div>
        </div>
        {children}
      </div>
    </ModalProvider>
  );
}
