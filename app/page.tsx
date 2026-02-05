"use client";

import { useState } from "react";
import Header from "./_components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">

      <div className="mx-auto max-w-7xl px-4 py-6">
        <Header />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="bg-zinc-900 p-4 rounded-lg">request</div>
          <div className="bg-zinc-900 p-4 rounded-lg">response</div>
        </div>
      </div>
    </div>
  );
}
