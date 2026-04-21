"use client";

import { Button } from "../ui/button";
import { HeaderRow, type Header } from "./header-row";

function makeHeader(): Header {
  return { key: "", value: "" };
}

interface HeadersEditorProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

export function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  function addHeader() {
    onChange([...headers, makeHeader()]);
  }

  function updateHeader(index: number, updated: Header) {
    onChange(headers.map((h, i) => (i === index ? updated : h)));
  }

  function removeHeader(index: number) {
    onChange(headers.filter((_, i) => i !== index));
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
