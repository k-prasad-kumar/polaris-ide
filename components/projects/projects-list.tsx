import { useProjectsPartial } from "@/hooks/use-projects";
import { Spinner } from "../ui/spinner";
import { Kbd } from "../ui/kbd";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { getProjectIcon } from "./get-project-icon";

interface ProjectListProps {
  onViewAll: () => void;
}

const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

const ContinueCard = ({ data }: { data: Doc<"projects"> }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Last updated</span>
      <Button
        variant={"outline"}
        asChild
        className="h-auto flex flex-col items-start justify-start p-4 bg-background border rounded-none gap-2"
      >
        <Link href={`projects/${data._id}`} className="group">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getProjectIcon(data)}
              <span className="truncate font-medium">{data.name}</span>
            </div>
            <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  );
};

const ProjectItem = ({ data }: { data: Doc<"projects"> }) => {
  return (
    <Link
      href={`projects/${data._id}`}
      className="w-full flex items-center justify-between text-sm text-foreground/60 font-medium hover:text-foreground py-1 group"
    >
      <div className="flex items-center gap-2">
        {getProjectIcon(data)}
        <span className="truncate">{data.name}</span>
      </div>
      <span>{formatTimestamp(data.updatedAt)}</span>
    </Link>
  );
};

export const ProjectsList = ({ onViewAll }: ProjectListProps) => {
  const projects = useProjectsPartial(6);

  if (projects === undefined) {
    return <Spinner className="text-ring size-4" />;
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {mostRecent ? <ContinueCard data={mostRecent} /> : null}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground text-xs">
              Recent Projects
            </span>
            <button
              onClick={onViewAll}
              className="flex items-center gap-2 text-muted-foreground text-xs trasistion-colors hover:text-foreground"
            >
              <span>View all</span>
              <Kbd className="bg-accent border">⌘ K</Kbd>
            </button>
          </div>
          <ul className="flex flex-col">
            {rest.map((project) => (
              <ProjectItem key={project._id} data={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
