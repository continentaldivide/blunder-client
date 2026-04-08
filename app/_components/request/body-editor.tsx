"use client";

import { useState } from "react";
import { BodyTextarea } from "./body-textarea";
import {
  ContentTypeSelector,
  type ContentType,
} from "./content-type-selector";

export function BodyEditor() {
  const [contentType, setContentType] = useState<ContentType>(
    "application/json"
  );
  const [body, setBody] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <ContentTypeSelector value={contentType} onChange={setContentType} />
      <BodyTextarea value={body} onChange={setBody} />
    </div>
  );
}
