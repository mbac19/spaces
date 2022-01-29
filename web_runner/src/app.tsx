import { Document, DocumentBlockType } from "./fs_api";
import { Notebook } from "./notebook";
import { useState } from "react";

export function App() {
  const [document, setDocument] = useState<Document>({
    version: "0.0.1",
    blocks: [
      {
        id: "1",
        type: DocumentBlockType.MARKDOWN,
        content: `# Test Document\nThis is a test document to make sure things get displayed correctly.`,
      },
      {
        id: "2",
        type: DocumentBlockType.LEVR,
        content: `(+ 1 2)`,
      },
    ],
  });

  return <Notebook document={document} />;
}
