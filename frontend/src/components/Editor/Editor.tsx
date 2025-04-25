import { useEffect, useState, useRef } from "react";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Dynamically import Editor from react-draft-wysiwyg
const { Editor } = require("react-draft-wysiwyg");

const CustomEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  
    if (value) {
      const blocks = convertFromHTML(value);
      const content = ContentState.createFromBlockArray(
        blocks.contentBlocks,
        blocks.entityMap
      );
      const state = EditorState.createWithContent(content);
  
      if (isMounted.current) {
        setEditorState(state);
        }
    }
  
    return () => {
      isMounted.current = false; // cleanup
    };
  }, [value]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const contentText = state.getCurrentContent().getPlainText();
    onChange(contentText);
  };

  return (
    <div className="border border-gray-300 rounded">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor px-2 min-h-[200px]"
      />
    </div>
  );
};

export default CustomEditor;
