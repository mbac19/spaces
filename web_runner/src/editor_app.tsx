import "./editor_app.css";

import { assertIsDefined } from "./error_utils";
import { Editor } from "./_editor/editor";
import { useEffect, useRef } from "react";

export interface EditorAppProps {}

export function EditorApp(props: EditorAppProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { current } = rootRef;
    assertIsDefined(current);

    const editor = new Editor({ rootElement: current });
    editor.start();

    return () => {
      editor.stop();
    };
  }, []);

  return <div ref={rootRef} className="EditorApp-Root"></div>;
}
