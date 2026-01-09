"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Page = () => {
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

  return (
    <div className="p-8 space-x-4 ">
      <Button onClick={handleBlocking}>
        {loading ? "Loading..." : "Blocking"}
      </Button>
      <Button onClick={handleBackground}>
        {loading2 ? "Loading..." : "Background"}
      </Button>
    </div>
  );
};

export default Page;
