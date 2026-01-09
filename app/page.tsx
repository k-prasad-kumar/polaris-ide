"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const projects = useQuery(api.projects.get);
  const createMutation = useMutation(api.projects.create);
  return (
    <div className="flex flex-col gap-2 p-4">
      <h2>PolarisIDE</h2>
      <Button
        onClick={() =>
          createMutation({
            name: "Prasad Kumar",
          })
        }
      >
        Add new
      </Button>
      <div className="flex flex-col gap-2 rounded">
        {projects?.map((project) => (
          <div key={project._id} className="p-2 border">
            <p>{project.name}</p>
            <p>User ID: {project.ownerId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
