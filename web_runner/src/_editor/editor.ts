import { assert } from "../error_utils";
import { buildEditorState } from "./build_editor_state";
import { EditorState } from "./editor_state";

export interface EditorDef {
  rootElement: HTMLElement;
}

export class Editor {
  private readonly rootElement: HTMLElement;

  private state?: EditorState;

  constructor(def: EditorDef) {
    this.rootElement = def.rootElement;
  }

  // ---------------------------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------------------------

  public start() {
    if (this.state) {
      return; // Already started.
    }

    assert(
      this.rootElement.childNodes.length === 0,
      "Cannot start editor in root node that already has children"
    );

    const state = buildEditorState({
      initialContent: ["Hello World", "This is some initial content"],
    });

    this.rootElement.appendChild(state.element);

    this.state = state;
  }

  public stop() {
    if (this.state === undefined) {
      return; // Already stopped
    }

    this.rootElement.removeChild(this.state.element);
    this.state = undefined;
  }
}
