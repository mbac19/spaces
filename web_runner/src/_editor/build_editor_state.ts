import { EditorState, EditorStateDef } from "./editor_state";
import { GUTTER_WIDTH } from "./editor_specs";

export type LineElement = HTMLDivElement;

export function buildEditorState(def: EditorStateDef): EditorState {
  // ---------------------------------------------------------------------------
  // STATE / PROPERTIES
  // ---------------------------------------------------------------------------

  const textElement = buildTextElement();

  const lineElements: Array<LineElement> = [];

  // ---------------------------------------------------------------------------
  // HARDWARE EVENT HANDLERS
  // ---------------------------------------------------------------------------

  function onClick(event: Event) {
    console.log("ON CLICK");
  }

  function onFocus(event: FocusEvent) {}

  function onBlur(event: FocusEvent) {}

  function onSelectionChange(event: Event) {
    console.log(window.getSelection());
  }

  function onInput(event: Event) {}

  function onKeyDown(event: KeyboardEvent) {
    const command = `${event.code}/${event.shiftKey}/${event.ctrlKey}/${event.metaKey}/${event.altKey}`;

    console.log(command);

    if (!allowDefaultKeyHandler[command]) {
      event.preventDefault();
    }

    const fn = keyHandler[event.code];

    if (fn === undefined) {
      return;
    }

    fn(event);
  }

  function onKeyUp(event: KeyboardEvent) {
    event.preventDefault();
  }

  // ---------------------------------------------------------------------------
  // KEY EVENT HANDLERS
  // ---------------------------------------------------------------------------

  function onBackspace(event: KeyboardEvent) {}

  function onNewline(event: KeyboardEvent) {
    addLine();
  }

  function onText(event: KeyboardEvent, text: string, shiftedText: string) {
    addText(event.shiftKey ? shiftedText : text);
  }

  // ---------------------------------------------------------------------------
  // KEY TO FUNCTION MAPPING
  // ---------------------------------------------------------------------------

  function makeTextEventCallback(text: string, shiftedText: string) {
    return (event: KeyboardEvent) => {
      if (!event.metaKey) {
        onText(event, text, shiftedText);
      }
    };
  }

  const allowDefaultKeyHandler: Record<string, boolean> = {
    // cmd + shift + i -> debug console
    "KeyI/false/false/true/true": true,
    "KeyI/false/true/true/true": true,
    "KeyI/true/false/true/true": true,
    "KeyI/true/true/true/true": true,

    // cmd + f -> search
    "KeyF/true/true/true/true": true,
  };

  const keyCommandHandler: Record<string, (event: KeyboardEvent) => void> = {};

  const keyHandler: Record<string, (event: KeyboardEvent) => void> = {
    Backspace: onBackspace,
    Digit1: makeTextEventCallback("1", "!"),
    Digit2: makeTextEventCallback("2", "@"),
    Digit3: makeTextEventCallback("3", "#"),
    Digit4: makeTextEventCallback("4", "$"),
    Digit5: makeTextEventCallback("5", "%"),
    Digit6: makeTextEventCallback("6", "^"),
    Digit7: makeTextEventCallback("7", "&"),
    Digit8: makeTextEventCallback("8", "*"),
    Digit9: makeTextEventCallback("9", "("),
    Digit0: makeTextEventCallback("0", ")"),
    Enter: onNewline,
    KeyA: makeTextEventCallback("a", "A"),
    KeyB: makeTextEventCallback("b", "B"),
    KeyC: makeTextEventCallback("c", "C"),
    KeyD: makeTextEventCallback("d", "D"),
    KeyE: makeTextEventCallback("e", "E"),
    KeyF: makeTextEventCallback("f", "F"),
    KeyG: makeTextEventCallback("g", "G"),
    KeyH: makeTextEventCallback("h", "H"),
    KeyI: makeTextEventCallback("i", "I"),
    KeyJ: makeTextEventCallback("j", "J"),
    KeyK: makeTextEventCallback("k", "K"),
    KeyL: makeTextEventCallback("l", "L"),
    KeyM: makeTextEventCallback("m", "M"),
    KeyN: makeTextEventCallback("n", "N"),
    KeyO: makeTextEventCallback("o", "O"),
    KeyP: makeTextEventCallback("p", "P"),
    KeyQ: makeTextEventCallback("q", "Q"),
    KeyR: makeTextEventCallback("r", "R"),
    KeyS: makeTextEventCallback("s", "S"),
    KeyT: makeTextEventCallback("t", "T"),
    KeyU: makeTextEventCallback("u", "U"),
    KeyV: makeTextEventCallback("v", "V"),
    KeyW: makeTextEventCallback("w", "W"),
    KeyX: makeTextEventCallback("x", "X"),
    KeyY: makeTextEventCallback("y", "Y"),
    KeyZ: makeTextEventCallback("z", "Z"),
    Space: makeTextEventCallback(" ", " "),
  };

  // ---------------------------------------------------------------------------
  // TEXT EDITOR OPERATIONS
  // ---------------------------------------------------------------------------

  function addText(text: string) {
    textElement.innerHTML += text;
  }

  function addLine() {
    const lineElement = buildTextLine();
    lineElements.push(lineElement);
    textElement.appendChild(lineElement);
  }

  function highlight(x0: number, y0: number, x1: number, y1: number) {
    const el = buildHighlightElement();
    textElement.prepend(el);
  }

  // ---------------------------------------------------------------------------
  // INITIALIZE / SETUP
  // ---------------------------------------------------------------------------

  textElement.addEventListener("blur", onBlur);
  textElement.addEventListener("click", onClick);
  textElement.addEventListener("keydown", onKeyDown);
  textElement.addEventListener("keyup", onKeyUp);
  textElement.addEventListener("focus", onFocus);
  textElement.addEventListener("input", onInput);
  textElement.addEventListener("selectionchange", onSelectionChange);

  const element = buildContainerElement();

  const leftGutterElement = buildLeftGutterElement();

  element.appendChild(leftGutterElement);
  element.appendChild(textElement);

  // Setting up initial content.

  const initialContent = def.initialContent ?? [];

  for (const line of initialContent) {
    const lineElement = buildTextLine();
    lineElement.innerHTML = line;
    lineElements.push(lineElement);
    textElement.appendChild(lineElement);
  }

  return { element };
}

// -----------------------------------------------------------------------------
// PRIVATE DOM UTILS
// -----------------------------------------------------------------------------

function buildContainerElement(): HTMLElement {
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

function buildLeftGutterElement(): HTMLElement {
  const element = document.createElement("div");

  element.style.boxSizing = "border-box";
  element.style.minWidth = `${GUTTER_WIDTH}px`;
  element.style.width = `${GUTTER_WIDTH}px`;
  element.style.background = "#f0f0f0";
  element.style.borderRight = "solid #ccc 1px";

  return element;
}

function buildTextElement(): HTMLElement {
  const element = document.createElement("div");

  element.style.boxSizing = "border-box";
  element.style.cursor = "text";
  element.style.flexGrow = "1";
  element.style.fontFamily = "monospace";

  return element;
}

function buildTextLine(): LineElement {
  const element = document.createElement("div");

  element.className = "editor_line";
  element.style.border = "solid red 1px";
  element.style.boxSizing = "border-box";
  element.style.height = `${LINE_HEIGHT}px`;
  element.style.lineHeight = `${LINE_HEIGHT}px`;
  element.style.position = "relative";

  return element;
}

function buildHighlightElement(): HTMLDivElement {
  const element = document.createElement("div");

  element.className = "editor_highlight";
  element.style.background = HIGHLIGHT;

  return element;
}

const LINE_CLASSNAME = "editor_line";

const LINE_HEIGHT = 24;

const BACKGROUND_PRIMARY = "#ffffff";

const BACKGROUND_SECONDARY = "#f0f0f0";

const HIGHLIGHT = "#cccccc";
