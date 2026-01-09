import { inngest } from "@/inngest/client";

export async function POST() {
  await inngest.send({
    name: "demo/generate",
    date: {},
  });

  return Response.json({ status: "started" });
}
