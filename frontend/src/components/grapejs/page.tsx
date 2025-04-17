"use client";
import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";

interface GrapesEditorProps {
  value: string;
  onChange: (newContent: string) => void;
}

const GrapesEditor = ({ value, onChange }: GrapesEditorProps) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      height: "100vh",
      fromElement: false,
      storageManager: false,
      components: value, // Initial content
      style: "",
    });

    // Store the editor instance in ref
    editorRef.current = editor;

    // Listen for changes in the editor content
    editor.on("change", () => {
      const content = editor.getHtml();  // Get the updated content as a string
      onChange(content);  // Pass it to onChange as a string
    });

    // Cleanup on unmount
    return () => editor.destroy();
  }, [value, onChange]);

  return <div id="gjs" />;
};

export default GrapesEditor;
