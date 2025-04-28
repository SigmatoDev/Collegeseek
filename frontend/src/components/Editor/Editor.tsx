import { useEffect, useState, useRef } from "react";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";

const CustomEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const isMounted = useRef(false); // Track if the component is mounted

  useEffect(() => {
    isMounted.current = true; // Mark as mounted on mount

    if (value) {
      try {
        const blocks = convertFromHTML(value);
        const content = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
        const state = EditorState.createWithContent(content);

        // Only update state if mounted
        if (isMounted.current) {
          setEditorState(state);
        }
      } catch (error) {
        console.error("Error converting HTML to editor content:", error);
      }
    }

    // Cleanup on unmount
    return () => {
      isMounted.current = false; 
    };
  }, [value]);

  const handleEditorChange = (state: EditorState) => {
    if (isMounted.current) {
      setEditorState(state);
      const contentText = state.getCurrentContent().getPlainText();
      onChange(contentText);
    }
  };

  const handleFocus = () => {
    if (isMounted.current) {
      console.log("Editor focused.");
    }
  };

  return (
    <div className="border border-gray-300 rounded">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        onFocus={handleFocus}  // Ensure focus only happens when mounted
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor px-2 min-h-[200px]"
      />
    </div>
  );
};

export default CustomEditor;
