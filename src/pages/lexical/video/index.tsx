/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type { JSX } from "react";

import {
  addClassNamesToElement,
  removeClassNamesFromElement,
} from "@lexical/utils";
import {
  $applyNodeReplacement,
  createEditor,
  DecoratorNode,
  isHTMLElement,
} from "lexical";
import * as React from "react";

export type Position = "left" | "right" | "full" | undefined;

export interface InlineImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: number;
  key?: NodeKey;
  showCaption?: boolean;
  src: string;
  width?: number;
  position?: Position;
}

export interface UpdateInlineImagePayload {
  altText?: string;
  showCaption?: boolean;
  position?: Position;
}

function $convertInlineImageElement(domNode: Node): null | DOMConversionOutput {
  if (isHTMLElement(domNode) && domNode.nodeName === "VIDEO") {
    const { alt: altText, src, width, height } = domNode as HTMLImageElement;
    const node = $createVideoNode({ altText, height, src, width });
    return { node };
  }
  return null;
}

export type SerializedInlineImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    showCaption: boolean;
    src: string;
    width?: number;
    position?: Position;
  },
  SerializedLexicalNode
>;

function getPositionClass(position: Position | undefined): string | undefined {
  return typeof position === "string" ? `position-${position}` : undefined;
}

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __showCaption: boolean;
  __caption: LexicalEditor;
  __position: Position;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(
      node.__src,
      node.__altText,
      node.__position,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedInlineImageNode): VideoNode {
    const { altText, height, width, src, showCaption, position } =
      serializedNode;
    return $createVideoNode({
      altText,
      height,
      position,
      showCaption,
      src,
      width,
    }).updateFromJSON(serializedNode);
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedInlineImageNode>
  ): this {
    const { caption } = serializedNode;
    const node = super.updateFromJSON(serializedNode);
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: (node: Node) => ({
        conversion: $convertInlineImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    position: Position,
    width?: "inherit" | number,
    height?: "inherit" | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__showCaption = showCaption || false;
    this.__caption = caption || createEditor();
    this.__position = position;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("video");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    return { element };
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === "inherit" ? 0 : this.__height,
      position: this.__position,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  getShowCaption(): boolean {
    return this.__showCaption;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  getPosition(): Position {
    return this.__position;
  }

  setPosition(position: Position): void {
    const writable = this.getWritable();
    writable.__position = position;
  }

  update(payload: UpdateInlineImagePayload): void {
    const writable = this.getWritable();
    const { altText, showCaption, position } = payload;
    if (altText !== undefined) {
      writable.__altText = altText;
    }
    if (showCaption !== undefined) {
      writable.__showCaption = showCaption;
    }
    if (position !== undefined) {
      writable.__position = position;
    }
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    for (const cls of [
      config.theme.inlineImage,
      getPositionClass(this.__position),
    ]) {
      if (cls) {
        addClassNamesToElement(span, cls);
      }
    }
    return span;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): false {
    const position = this.__position;
    if (position !== prevNode.__position) {
      removeClassNamesFromElement(dom, getPositionClass(prevNode.__position));
      addClassNamesToElement(dom, getPositionClass(position));
    }
    return false;
  }

  decorate(): JSX.Element {
    return (
      <video
        src={this.__src}
        width={this.__width}
        height={this.__height}
        controls
      />
    );
  }
}

export function $createVideoNode({
  altText,
  position,
  height,
  src,
  width,
  showCaption,
  caption,
  key,
}: InlineImagePayload): VideoNode {
  return $applyNodeReplacement(
    new VideoNode(
      src,
      altText,
      position,
      width,
      height,
      showCaption,
      caption,
      key
    )
  );
}
