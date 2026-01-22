"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { SparkleIcon } from "lucide-react";
import { Kbd } from "../ui/kbd";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { ProjectsList } from "@/components/projects/projects-list";
import { useCreateProject } from "@/hooks/use-projects";
import { ProjectsCommandDialog } from "./projects-command-dialog";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProjectsView = () => {
  const createProject = useCreateProject();
  const [CommandDialogOpen, setCommandDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        setCommandDialogOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <ProjectsCommandDialog
        open={CommandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <div className="w-full min-h-screen bg-sidebar flex flex-col justify-center items-center p-6 md:p-16">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">
          <div className="w-full flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full group/logo">
              <Image
                src="/logo.svg"
                alt="logo"
                width={100}
                height={100}
                className="size-8 md:size-11.5"
              />
              <h1
                className={cn(
                  "font-semibold text-4xl md:text-5xl",
                  font.className
                )}
              >
                PolarisIDE
              </h1>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={"outline"}
                onClick={() => {
                  const projectName = uniqueNamesGenerator({
                    dictionaries: [adjectives, colors, animals],
                    separator: "-",
                    length: 3,
                  });
                  createProject({ name: projectName });
                }}
                className="h-full items-start justify-start p-4 border flex flex-col rounded-none bg-background gap-6"
              >
                <div className="w-full flex justify-between items-center">
                  <SparkleIcon className="size-4" />
                  <Kbd className="border bg-accent">⌘ J</Kbd>
                </div>
                <div>
                  <span className="text-sm">New </span>
                </div>
              </Button>
              <Button
                variant={"outline"}
                onClick={() => {}}
                className="h-full items-start justify-start p-4 border flex flex-col rounded-none bg-background gap-6"
              >
                <div className="w-full flex justify-between items-center">
                  <FaGithub className="size-4" />
                  <Kbd className="border bg-accent">⌘ I</Kbd>
                </div>
                <div>
                  <span className="text-sm">Import </span>
                </div>
              </Button>
            </div>
            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
          </div>
        </div>
      </div>
    </>
  );
};
