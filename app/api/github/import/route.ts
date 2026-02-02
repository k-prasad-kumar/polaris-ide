import { z } from "zod";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { convex } from "@/lib/convex-client";
import { inngest } from "@/inngest/client";

import { api } from "@/convex/_generated/api";

const requestSchema = z.object({
  url: z.url(),
});

/**
 * Extracts the repository owner and name from a GitHub repository URL.
 *
 * @param url - A GitHub repository URL (e.g. "https://github.com/owner/repo" or "https://github.com/owner/repo.git")
 * @returns An object with `owner` (the repository owner or organization) and `repo` (the repository name without a trailing ".git")
 * @throws Error if the provided URL is not a valid GitHub repository URL
 */
function parseGitHubUrl(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/**
 * Handles importing a GitHub repository URL to create a project and enqueue an import event.
 *
 * Authenticates the user, validates the request body for a `url` (GitHub repo), ensures the user has a connected GitHub OAuth token and server internal key, creates a project via Convex, and sends an import event to Inngest.
 *
 * @param request - The incoming HTTP request whose JSON body must include a `url` field containing a GitHub repository URL.
 * @returns On success, an object `{ success: true, projectId: string, eventId: string }`. On failure, an error object is returned with an appropriate HTTP status: `401` when unauthenticated, `400` when GitHub is not connected, or `500` for server configuration errors.
 */
export async function POST(request: Request) {
  const { userId, has } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // const hasPro = has({ plan: "pro" });
  // const hasPro = has({ role: "pro" });

  // if (!hasPro) {
  //   return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  // }

  const body = await request.json();
  const { url } = requestSchema.parse(body);

  const { owner, repo } = parseGitHubUrl(url);
  // https://github.com/AntonioErdeljac/cursor-dev
  // { owner: "AntonioErdeljac", repo: "cursor-dev" }

  const client = await clerkClient();
  const tokens = await client.users.getUserOauthAccessToken(userId, "github");
  const githubToken = tokens.data[0]?.token;

  if (!githubToken) {
    return NextResponse.json(
      { error: "GitHub not connected. Please reconnect your GitHub account." },
      { status: 400 },
    );
  }

  const internalKey = process.env.POLARIS_IDE_CONVEX_INTERNAL_KEY;

  if (!internalKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const projectId = await convex.mutation(api.system.createProject, {
    internalKey,
    name: repo,
    ownerId: userId,
  });

  const event = await inngest.send({
    name: "github/import.repo",
    data: {
      owner,
      repo,
      projectId,
      githubToken,
    },
  });

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0],
  });
}