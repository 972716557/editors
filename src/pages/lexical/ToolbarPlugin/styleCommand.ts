// StyleCommands.ts
import { $getSelection, $isRangeSelection, createCommand } from "lexical";
import { $patchStyleText } from "@lexical/selection";

export const APPLY_STYLE_COMMAND = createCommand<{
  property: string;
  value: string;
}>("APPLY_STYLE_COMMAND");

export function applyStyle(property: string, value: string): void {
  const selection = $getSelection();

  if ($isRangeSelection(selection)) {
    $patchStyleText(selection, { color: "#F2f3f5" });
  }
}
