import { Extension } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";

export const getLanguageExtension = (fileName: string): Extension => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "html":
      return html();
    case "css":
      return css();
    case "js":
      return javascript();
    case "jsx":
      return javascript({ jsx: true });
    case "ts":
      return javascript({ typescript: true });
    case "tsx":
      return javascript({ typescript: true, jsx: true });
    case "json":
      return json();
    case "md":
    case "mdx":
      return markdown();
    case "py":
      return python();
    default:
      return [];
  }
};
