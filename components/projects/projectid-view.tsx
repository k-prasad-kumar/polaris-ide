"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import { Id } from "@/convex/_generated/dataModel";
import { FaGithub } from "react-icons/fa";

const Tab = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "h-full flex items-center gap-2 px-3 text-muted-foreground cursor-pointer border-r hover:bg-accent/30",
      isActive && "bg-background text-foreground"
    )}
    onClick={onClick}
  >
    <span className="text-sm">{label}</span>
  </div>
);
const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  return (
    <div className="h-full flex flex-col">
      <nav className="h-8.75 flex items-center bg-sidebar border-b">
        <Tab
          label="Code"
          isActive={activeView === "editor"}
          onClick={() => setActiveView("editor")}
        />
        <Tab
          label="Preview"
          isActive={activeView === "preview"}
          onClick={() => setActiveView("preview")}
        />
        <div className="h-full flex flex-1 justify-end">
          <div className="h-full flex items-center gap-1.5 px-3 text-muted-foreground cursor-pointer border-l hover:bg-accent/30">
            <FaGithub className="size-3.5" />{" "}
            <span className="text-sm">Export</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 relative">
        <div
          className={cn(
            "absolute inset-0",
            activeView == "editor" ? "visible" : "invisible"
          )}
        >
          <div>Editor</div>
        </div>
        <div
          className={cn(
            "absolute inset-0",
            activeView == "preview" ? "visible" : "invisible"
          )}
        >
          <div>Preview</div>
        </div>
      </div>
    </div>
  );
};
export default ProjectIdView;
