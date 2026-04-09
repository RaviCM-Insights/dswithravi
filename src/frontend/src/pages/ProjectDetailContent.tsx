import { useParams } from "@tanstack/react-router";
import { ProjectDetailPage } from "./ProjectDetailPage";

export function ProjectDetailView() {
  const { id } = useParams({ strict: false }) as { id: string };
  return <ProjectDetailPage projectId={BigInt(id)} />;
}
