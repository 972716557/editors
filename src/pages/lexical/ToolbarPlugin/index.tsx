/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import { Dispatch, useEffect, useState } from "react";
import * as React from "react";
import { $createHeadingNode } from "@lexical/rich-text";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

import { $setBlocksType } from "@lexical/selection";

import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createInlineImageNode } from "./image";
type HeadingTagType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export default function ToolbarPlugin({
  editor,
  activeEditor,
  setActiveEditor,
}: {
  editor: LexicalEditor;
  activeEditor: LexicalEditor;
  setActiveEditor: Dispatch<LexicalEditor>;
}): JSX.Element {
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const formatParagraph = (editor: LexicalEditor) => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);

        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, setActiveEditor]);

  const toggleH1 = () => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createHeadingNode("h1"));
    });
  };

  const applyColor = (color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText("color", color); // 自定义文本颜色格式
      }
    });
  };

  const toggleList = (listType) => {
    activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };
  return (
    <div className="toolbar">
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={"Undo (Ctrl+Z)"}
        type="button"
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        undo
      </button>
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={"Redo (Ctrl+Y)"}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        Redo
      </button>
      <button
        disabled={!isEditable}
        onClick={() => formatParagraph(editor)}
        title={"Redo (Ctrl+Y)"}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        正文
      </button>
      <button
        disabled={!isEditable}
        onClick={() => toggleH1()}
        title={"Redo (Ctrl+Y)"}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        标题一
      </button>
      <button
        disabled={!isEditable}
        onClick={() =>
          activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        title={"Redo (Ctrl+Y)"}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        有序列表
      </button>
      <button
        disabled={!isEditable}
        onClick={() => toggleList("ul")}
        title={"Redo (Ctrl+Y)"}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        无序列表
      </button>
      <button
        disabled={!isEditable}
        onClick={() => applyColor("#f4d6bfe")}
        title={"Redo (Ctrl+Y)"}
        type="button"
        className="toolbar-item"
        aria-label="Redo"
      >
        字体颜色
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        加粗
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        倾斜
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        下划线
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        aria-label="Format Strikethrough"
      >
        删除线
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://www.baidu.com");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        链接
      </button>
      <button
        onClick={() => {
          // 显示上传占位符
          editor.update(() => {
            const placeholderNode = $createInlineImageNode({
              src: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
              altText: "上传中...",
            });
            $insertNodes([placeholderNode]);
          });
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        图片上传
      </button>
    </div>
  );
}
