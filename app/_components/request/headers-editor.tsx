"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { HeaderRow, type Header } from "./header-row";

function makeHeader(): Header {
  return { key: "", value: "" };
}

export function HeadersEditor() {
  const [headers, setHeaders] = useState<Header[]>([makeHeader()]);

  function addHeader() {
    setHeaders((prev) => [...prev, makeHeader()]);
  }

  function updateHeader(index: number, updated: Header) {
    setHeaders((prev) => prev.map((h, i) => (i === index ? updated : h)));
  }

  function removeHeader(index: number) {
    setHeaders((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {headers.map((header, index) => (
        <HeaderRow
          key={index}
          header={header}
          onChange={(updated) => updateHeader(index, updated)}
          onRemove={() => removeHeader(index)}
        />
      ))}
      <div>
        <Button variant="ghost" onClick={addHeader}>
          + Add Header
        </Button>
      </div>
    </div>
  );
}
