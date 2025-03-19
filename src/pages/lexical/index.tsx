import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import Editor from "./editor";
import { InlineImageNode } from "./ToolbarPlugin/image";

const UndoRedoEditor = () => {
  // 创建编辑器实例

  return (
    <LexicalComposer
      initialConfig={{
        nodes: [HeadingNode, ListNode, ListItemNode, LinkNode, InlineImageNode],
        editor: {
          namespace: "MyLexicalEditor",
          text: {
            bold: "my-bold-class", // 可选：自定义 CSS 类名
            italic: "my-italic-class",
            underline: "my-underline-class",
          },
          theme: {
            paragraph: "editor-paragraph",
            heading: {
              h1: "editor-heading-h1",
              h2: "editor-heading-h2",
              h3: "editor-heading-h3",
            },
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
