import { Id } from "@/convex/_generated/dataModel";
import { ProjectIdView } from "@/components/projects/projectid-view";

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  return <ProjectIdView projectId={projectId as Id<"projects">} />;
};
export default page;
