import { EmptyState } from "@/components/layout";
import { searchApplications } from "@/lib/search";
import { useApplications } from "@/lib/swr";
import { LayoutGrid } from "lucide-react";
import { ApplicationCard } from "./application-card";
import { ApplicationCardPlaceholder } from "./application-card-placeholder";
import type { ApplicationTypeOrAll } from "./application-types";
import { EmptyApplicationIndicator } from "./empty-application-indicator";

export function ApplicationList({
  search,
  type,
}: { search?: string; type?: ApplicationTypeOrAll }) {
  const { applications, loading } = useApplications();
  const filteredApplications = searchApplications(applications || [], search).filter((app) => {
    if (!type || type === "all") return true;
    return app.type === type;
  });

  if (loading) {
    return Array.from({ length: 6 }).map((_, i) => <ApplicationCardPlaceholder key={i} />);
  }

  if (!applications || applications.length === 0) {
    return <EmptyApplicationIndicator />;
  }

  if (filteredApplications.length === 0) {
    return (
      <div className="col-span-3 flex h-[400px] justify-center">
        <EmptyState icon={LayoutGrid} title="没有符合筛选条件的应用" />
      </div>
    );
  }

  return filteredApplications.map((d) => <ApplicationCard key={d.id} {...d} />);
}
