// StylePlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { APPLY_STYLE_COMMAND, applyStyle } from "./styleCommand";
import { useEffect } from "react";

const StylePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      APPLY_STYLE_COMMAND,
      ({ property, value }) => {
        editor.update(() => {
          applyStyle(property, value);
        });
        return true;
      },
      1
    );
  }, [editor]);

  return null;
};
export default StylePlugin;
