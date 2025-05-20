import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";

// Editor.js Tools

import Header from "@editorjs/header";

import List from "@editorjs/list";

import Quote from "@editorjs/quote";

import Code from "@editorjs/code";

import Embed from "@editorjs/embed";

import Table from "@editorjs/table";

interface EditorComponentProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ data, onChange }) => {
  const ejInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (ejInstance.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      /**
       * 👇 Ensure data is either valid OutputData or undefined
       */
      data: data ?? {
        time: Date.now(),
        blocks: [],
        version: "2.27.0", // Or your current version
      },
      tools: {
        // 👇 Suppress type mismatch for tools
        header: {
          // @ts-expect-error
          class: Header,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
          },
        },
        list: {
          // @ts-expect-error
          class: List,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        code: Code,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
            },
          },
        },
        table: {
          // @ts-expect-error
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
      },
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        const savedData = await editor.save();
        onChange(savedData);
      },
    });

    return () => {
      ejInstance.current?.isReady
        .then(() => ejInstance.current?.destroy())
        .catch((err) => console.error("Editor cleanup error:", err));
      ejInstance.current = null;
    };
  }, [data, onChange]);

  return (
    <div
      id="editorjs"
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "6px",
        minHeight: "300px",
      }}
    />
  );
};

export default EditorComponent;
