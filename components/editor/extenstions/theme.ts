import { EditorView } from "codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { oneDark } from "@codemirror/theme-one-dark";

export const customTheme = EditorView.theme({
  "&": {
    outline: "none !important",
    height: "100%",
  },
  ".cm-content": {
    fontFamily: "var(--font-plex-mono), monospace",
    fontSize: "14px",
  },
  ".cm-scroller": {
    scrollbarWidth: "thin",
    scrollbarColor: "#3f3f46 transparent",
  },
});
