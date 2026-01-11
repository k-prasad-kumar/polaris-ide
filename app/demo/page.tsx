"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const handleBlocking = async () => {
    setLoading(true);
    await fetch("/api/demo/blocking", { method: "POST" });
    setLoading(false);
  };

  const handleBackground = async () => {
    setLoading2(true);
    await fetch("/api/demo/background", { method: "POST" });
    setLoading2(false);
  };

  const handleClientError = () => {
    Sentry.logger.info("User is attempting to click on client function", {
      userId: userId,
    });
    throw new Error("Client error : Something went wrong in the browser!");
  };

  const handleAPIError = async () => {
    await fetch("/api/demo/error", { method: "POST" });
    throw new Error("API error : Something went wrong in the server!");
  };

  const handleInngestError = async () => {
    await fetch("/api/demo/inngest-error", { method: "POST" });
    // throw new Error("Inngest error : Something went wrong in the server!");
  };

  return (
    <div className="p-8 space-x-4 ">
      <Button onClick={handleBlocking}>
        {loading ? "Loading..." : "Blocking"}
      </Button>
      <Button onClick={handleBackground}>
        {loading2 ? "Loading..." : "Background"}
      </Button>

      <Button variant={"destructive"} onClick={handleClientError}>
        Client Error
      </Button>
      <Button variant={"destructive"} onClick={handleAPIError}>
        API Error
      </Button>
      <Button variant={"destructive"} onClick={handleInngestError}>
        Inngest Error
      </Button>
    </div>
  );
};

export default Page;
