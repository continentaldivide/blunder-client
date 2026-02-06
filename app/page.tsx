"use client";

import { useState } from "react";
import Header from "./_components/header";
import { Request } from "./_components/request";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">

      <div className="mx-auto max-w-7xl px-4 py-6">
        <Header />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Request />
          <div className="bg-zinc-900 p-4 rounded-lg">response</div>
        </div>
      </div>
    </div>
  );
}
