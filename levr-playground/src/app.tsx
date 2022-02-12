import "./app.css";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-lisp";
import "ace-builds/src-noconflict/theme-github";

export function App() {
  function onBlurEditor() {}

  function onChangeEditor() {}

  function onFocusEditor() {}

  return (
    <div className="App">
      <div className="Toolbar">
        <div role="button" className="RunButton">
          Run
        </div>
      </div>
      <div className="Content">
        <div className="CodeEditorContainer">
          <AceEditor
            height="100%"
            highlightActiveLine={true}
            mode="lisp"
            onBlur={onBlurEditor}
            onChange={onChangeEditor}
            onFocus={onFocusEditor}
            showGutter={true}
            showPrintMargin={false}
            tabSize={4}
            theme="github"
            width="100%"
          />
        </div>
        <div className="CodeOutput"></div>
      </div>
    </div>
  );
}
