import React, { useEffect, useRef } from "react";
import Editor, { ContentEditableEvent } from "react-simple-wysiwyg";

interface SimpleWYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void; // Just pass the updated string
}

const SimpleWYSIWYGEditor: React.FC<SimpleWYSIWYGEditorProps> = ({ value, onChange }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const iframe = wrapperRef.current?.querySelector("iframe");
        const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
        if (!iframeDoc) return;

        // Ensure focus before toolbar button action
        const toolbarButtons = wrapperRef.current?.querySelectorAll("button");
        toolbarButtons?.forEach((btn) => {
          btn.addEventListener("mousedown", () => {
            iframeDoc.body.focus();
          });
        });

        clearInterval(interval); // Run only once
      } catch (error) {
        // Silent fail
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (event: ContentEditableEvent) => {
    onChange(event.target.value);
  };

  return (
    <div ref={wrapperRef}>
      <Editor value={value} onChange={handleChange} />
    </div>
  );
};

export default SimpleWYSIWYGEditor;
