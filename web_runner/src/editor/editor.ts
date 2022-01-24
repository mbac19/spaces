import { assert } from "../error_utils";
import { GUTTER_WIDTH } from "./editor_specs";

export interface EditorDef {
  rootElement: HTMLElement;
}

export interface EditorState {
  containerElement: HTMLElement;
  leftGutterElement: HTMLElement;
  textElement: HTMLElement;
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

    const state = this.buildState();

    this.rootElement.appendChild(state.containerElement);

    this.state = state;
  }

  public stop() {
    if (this.state === undefined) {
      return; // Already stopped
    }

    this.rootElement.removeChild(this.state.containerElement);
    this.state = undefined;
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  private buildState(): EditorState {
    const containerElement = this.buildContainerElement();
    const leftGutterElement = this.buildLeftGutterElement();
    const textElement = this.buildTextElement();

    containerElement.appendChild(leftGutterElement);
    containerElement.appendChild(textElement);

    return {
      containerElement,
      leftGutterElement,
      textElement,
    };
  }

  private buildContainerElement(): HTMLElement {
    const containerElement = document.createElement("div");

    containerElement.style.bottom = "0";
    containerElement.style.boxSizing = "border-box";
    containerElement.style.display = "flex";
    containerElement.style.flexDirection = "row";
    containerElement.style.left = "0";
    containerElement.style.position = "absolute";
    containerElement.style.right = "0";
    containerElement.style.top = "0";

    return containerElement;
  }

  private buildTextElement(): HTMLElement {
    const rootTextElement = document.createElement("div");
    rootTextElement.contentEditable = "true";

    rootTextElement.style.boxSizing = "border-box";
    rootTextElement.style.flexGrow = "1";

    return rootTextElement;
  }

  private buildLeftGutterElement(): HTMLElement {
    const element = document.createElement("div");

    element.style.boxSizing = "border-box";
    element.style.minWidth = `${GUTTER_WIDTH}px`;
    element.style.width = `${GUTTER_WIDTH}px`;
    element.style.background = "#f0f0f0";
    element.style.borderRight = "solid #ccc 1px";

    return element;
  }
}
