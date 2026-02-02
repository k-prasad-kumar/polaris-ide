import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { convex } from "@/lib/convex-client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const requestSchema = z.object({
  projectId: z.string(),
});

/**
 * Resets the export status for the project identified in the request body.
 *
 * Expects a JSON body with a `projectId` string. Authenticates the caller, verifies
 * the required internal Convex key is present, clears the project's export status and repo URL,
 * and returns the result.
 *
 * @returns A NextResponse with `{ success: true, projectId }` on success; on failure returns a JSON error with status `401` when unauthenticated or `500` when the server is misconfigured.
 */
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectId } = requestSchema.parse(body);

  const internalKey = process.env.POLARIS_IDE_CONVEX_INTERNAL_KEY;

  if (!internalKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  // Clear export status
  await convex.mutation(api.system.updateExportStatus, {
    internalKey,
    projectId: projectId as Id<"projects">,
    status: undefined,
    repoUrl: undefined,
  });

  return NextResponse.json({
    success: true,
    projectId,
  });
}