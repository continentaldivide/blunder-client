"use client";

import { useState } from "react";
import Header from "./_components/header";
import { Request } from "./_components/request";
import { ResponseCard } from "./_components/response/response-card";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Header />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Request />
          <ResponseCard />
        </div>
      </div>
    </div>
  );
}
