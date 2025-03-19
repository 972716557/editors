import { TextNode } from "lexical";

export class StyledTextNode extends TextNode {
  __styles: Record<string, string>;

  constructor(text: string, styles?: Record<string, string>, key?: string) {
    super(text, key);
    this.__styles = styles || {};
  }

  static getType(): string {
    return "StyledText";
  }

  static clone(node: StyledTextNode): StyledTextNode {
    return new StyledTextNode(node.__text, node.__styles, node.__key);
  }

  setStyle(property: string, value: string): void {
    const writable = this.getWritable();
    writable.__styles[property] = value;
  }

  getStyles(): Record<string, string> {
    return this.__styles;
  }

  createDOM(config: any): HTMLElement {
    const element = super.createDOM(config);
    Object.entries(this.__styles).forEach(([prop, val]) => {
      element.style.setProperty(prop, val);
    });
    return element;
  }

  updateDOM(prevNode: StyledTextNode, dom: HTMLElement): boolean {
    super.updateDOM(prevNode, dom);
    Object.entries(prevNode.__styles).forEach(([prop]) => {
      dom.style.removeProperty(prop);
    });
    Object.entries(this.__styles).forEach(([prop, val]) => {
      dom.style.setProperty(prop, val);
    });
    return true;
  }
}
