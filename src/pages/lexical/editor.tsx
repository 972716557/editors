import React, { useState } from "react";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarPlugin from "./ToolbarPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

// 创建根节点

const Editor = () => {
  // 创建编辑器实例
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  return (
    <div>
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <RichTextPlugin
        placeholder={<div className="editor-placeholder">Enter text...</div>}
        contentEditable={<ContentEditable className="editor-input" />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LinkPlugin />
      <ListPlugin />
      <HistoryPlugin />
    </div>
  );
};

export default Editor;
