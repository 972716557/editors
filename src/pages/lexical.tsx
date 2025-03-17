import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $generateHtmlFromNodes } from "@lexical/html";
import "./index.less";

const editorConfig = {
  namespace: "MyEditor",
  //   theme: {
  //     text: {
  //       bold: "text-bold",
  //       italic: "text-italic",
  //     },
  //   },
  onError: (error) => {
    console.error("Lexical error:", error);
  },
};

function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor" />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={<div>Enter some text...</div>}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}

export default LexicalEditor;
