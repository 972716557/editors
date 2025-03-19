import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import Editor from "./editor";
import { InlineImageNode } from "./ToolbarPlugin/image";
import "./index.less";
import { StyledTextNode } from "./ToolbarPlugin/color";
const UndoRedoEditor = () => {
  // 创建编辑器实例

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "MyLexicalEditor",
        nodes: [
          HeadingNode,
          ListNode,
          ListItemNode,
          LinkNode,
          InlineImageNode,
          StyledTextNode,
        ],
        theme: {
          text: {
            bold: "editor-text-bold", // 可选：自定义 CSS 类名
            italic: "editor-text-italic",
            strikethrough: "editor-text-strikethrough",
            underline: "editor-text-underline",
            underlineStrikethrough: "editor-text-underlineStrikethrough",
          },
          paragraph: "editor-paragraph",
          heading: {
            h1: "editor-heading-h1",
            h2: "editor-heading-h2",
            h3: "editor-heading-h3",
          },
        },
        onError: (error) => {
          console.error(error);
        },
      }}
    >
      <Editor />
    </LexicalComposer>
  );
};

export default UndoRedoEditor;
