"use client";

import { useState } from "react";
import { type ProxyResponse } from "./lib/types";
import { MainLayout } from "./_components/layout/main-layout";
import { Request } from "./_components/request";
import { ResponseCard } from "./_components/response/response-card";

export default function Home() {
  const [response, setResponse] = useState<ProxyResponse | null>(null);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Request onResponse={setResponse} />
        <ResponseCard response={response} />
      </div>
    </MainLayout>
  );
}
