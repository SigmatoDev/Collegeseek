import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditorComponent = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (value) {
      const blocksFromHTML = convertFromHTML(value);
      const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [value]);

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
    const contentState = newState.getCurrentContent();
    const contentText = contentState.getPlainText();
    onChange(contentText);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleEditorChange}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
    />
  );
};

export default EditorComponent;
