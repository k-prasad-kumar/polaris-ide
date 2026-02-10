import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useProject, useRenameProject } from "@/hooks/use-projects";
import { useState } from "react";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
  const [name, setName] = useState("");
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const project = useProject(projectId);
  const renameProject = useRenameProject();

  const handleStartRename = () => {
    if (!project) return;
    setIsRenameOpen(true);
    setName(project?.name ?? "");
  };

  const handleSubmit = () => {
    if (!project) return;
    setIsRenameOpen(false);
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === project?.name) return;
    renameProject({ id: projectId, name: trimmedName });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsRenameOpen(false);
    }
  };
  return (
    <nav className="flex justify-between items-center gap-x-2 p-2 bg-sidebar border-b">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={"/"}
                className="flex items-center gap-1.5"
                asChild
              >
                <Button variant="ghost" className="w-fit! p-1.5! h-7!" asChild>
                  <Link href={"/"}>
                    <Image src="/logo.svg" alt="logo" width={20} height={20} />
                    <span className={cn("text-sm font-medium", font.className)}>
                      PolarisIDE
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="ml-0! mr-1!" />
            <BreadcrumbItem>
              {isRenameOpen ? (
                <input
                  type="text"
                  className="text-sm bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-ring font-medium max-w-40 truncate"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <BreadcrumbPage
                  className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 truncate"
                  onClick={handleStartRename}
                >
                  {project?.name ?? "Loading..."}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="w-fit! p-1.5! h-7!">
                <LoaderIcon className="animate-spin size-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Importing...</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="w-fit! p-1.5! h-7!">
                <CloudCheckIcon className="size-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Saved{" "}
              {project?.updatedAt
                ? formatDistanceToNow(project.updatedAt, { addSuffix: true })
                : "just now"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-2">
        <UserButton />
      </div>
    </nav>
  );
};
