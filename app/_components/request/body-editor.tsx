"use client";

import { BodyTextarea } from "./body-textarea";
import {
  ContentTypeSelector,
  type ContentType,
} from "./content-type-selector";

interface BodyEditorProps {
  contentType: ContentType;
  onContentTypeChange: (contentType: ContentType) => void;
  body: string;
  onBodyChange: (body: string) => void;
}

export function BodyEditor({
  contentType,
  onContentTypeChange,
  body,
  onBodyChange,
}: BodyEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      <ContentTypeSelector value={contentType} onChange={onContentTypeChange} />
      <BodyTextarea value={body} onChange={onBodyChange} />
    </div>
  );
}
