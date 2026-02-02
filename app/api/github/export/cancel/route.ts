import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { convex } from "@/lib/convex-client";
import { inngest } from "@/inngest/client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const requestSchema = z.object({
  projectId: z.string(),
});

/**
 * Handle POST requests to cancel a project's GitHub export.
 *
 * Emits an Inngest event named "github/export.cancel" with the provided `projectId` and updates the export status to "cancelled" in Convex.
 *
 * @returns A JSON NextResponse containing `success: true`, the provided `projectId`, and `eventId` (the first ID from the sent event). Responds with 401 if the user is unauthenticated or 500 if required server configuration is missing.
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

  const event = await inngest.send({
    name: "github/export.cancel",
    data: {
      projectId,
    },
  });

  // Update status to cancelled
  await convex.mutation(api.system.updateExportStatus, {
    internalKey,
    projectId: projectId as Id<"projects">,
    status: "cancelled",
  });

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0],
  });
}