'use client';

import { useEffect, useRef, useState } from "react";

const Editor2 = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);
  const [isClient, setIsClient] = useState<boolean>(false); // To track client-side rendering

  useEffect(() => {
    // Set isClient to true once component is mounted (client-side)
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Save history when the component mounts on the client-side
    if (isClient && editorRef.current) {
      saveHistory();
    }
  }, [isClient]);

  const format = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    saveHistory();
  };

  const formatBlock = (block: string) => {
    document.execCommand('formatBlock', false, block);
    saveHistory();
  };

  const setFontSize = (size: string) => {
    document.execCommand('fontSize', false, size);
    saveHistory();
  };

  const setFontFamily = (font: string) => {
    const selection = window.getSelection();
    if (!selection) return;
    const span = document.createElement('span');
    span.style.fontFamily = font;
    span.innerHTML = selection.toString();
    replaceSelectionWithHtml(span.outerHTML);
    saveHistory();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      saveHistory();
    }
  };

  const removeLink = () => {
    document.execCommand('unlink', false);
    saveHistory();
  };

  const insertImage = () => {
    const url = prompt('Enter Image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
      saveHistory();
    }
  };

  const insertEmoji = () => {
    const emoji = prompt('Enter Emoji (😊, ❤️, 👍):');
    if (emoji) {
      document.execCommand('insertText', false, emoji);
      saveHistory();
    }
  };

  const insertCodeBlock = () => {
    const code = prompt('Enter Code:');
    if (code) {
      const codeHtml = `<pre><code>${code}</code></pre><br>`;
      replaceSelectionWithHtml(codeHtml);
      saveHistory();
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table border="1" style="width:100%; text-align:center; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid gray;">Column 1</th>
            <th style="border: 1px solid gray;">Column 2</th>
            <th style="border: 1px solid gray;">Column 3</th> <!-- Added column -->
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid gray;">Row 1 Col 1</td>
            <td style="border: 1px solid gray;">Row 1 Col 2</td>
            <td style="border: 1px solid gray;">Row 1 Col 3</td> <!-- Added row data -->
          </tr>
          <tr>
            <td style="border: 1px solid gray;">Row 2 Col 1</td>
            <td style="border: 1px solid gray;">Row 2 Col 2</td>
            <td style="border: 1px solid gray;">Row 2 Col 3</td> <!-- Added row data -->
          </tr>
        </tbody>
      </table><br>`;
  
    replaceSelectionWithHtml(tableHtml);
    saveHistory();
  };

  const insertUnorderedList = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    
    li.textContent = selection.toString() || 'New list item';
    ul.appendChild(li);

    range.deleteContents();
    range.insertNode(ul);

    saveHistory();
  };

  const insertOrderedList = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const ol = document.createElement('ol');
    const li = document.createElement('li');
    
    li.textContent = selection.toString() || 'New ordered item';
    ol.appendChild(li);

    range.deleteContents();
    range.insertNode(ol);

    saveHistory();
  };

  const replaceSelectionWithHtml = (html: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const div = document.createElement("div");
    div.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: ChildNode | null;
    while ((node = div.firstChild)) {
      frag.appendChild(node);
    }
    range.insertNode(frag);
  };

  const saveHistory = () => {
    if (!editorRef.current) return;
    const currentContent = editorRef.current.innerHTML;
    setHistory(prev => [...prev.slice(0, historyStep + 1), currentContent]);
    setHistoryStep(prev => prev + 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => {
        if (editorRef.current) {
          editorRef.current.innerHTML = history[prev - 1];
        }
        return prev - 1;
      });
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => {
        if (editorRef.current) {
          editorRef.current.innerHTML = history[prev + 1];
        }
        return prev + 1;
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target?.result as string;
          img.style.maxWidth = '100%'; 
          img.style.height = 'auto';
          insertImageToEditor(img);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const insertImageToEditor = (img: HTMLImageElement) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);
    saveHistory();
  };

  if (!isClient) return null; // Render nothing until mounted on the client-side

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button onClick={() => format('bold')}><b>B</b></button>
        <button onClick={() => format('italic')}><i>I</i></button>
        <button onClick={() => format('underline')}><u>U</u></button>
        <button onClick={() => format('strikeThrough')}><s>S</s></button>
        <button onClick={insertCodeBlock}>{"{}"}</button>
        <button onClick={() => format('superscript')}>x²</button>
        <button onClick={() => format('subscript')}>x₂</button>

        <select onChange={(e) => formatBlock(e.target.value)}>
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <select defaultValue="3" onChange={(e) => setFontSize(e.target.value)}>
          <option value="2">12px</option>
          <option value="3">16px</option>
          <option value="4">18px</option>
          <option value="5">24px</option>
          <option value="6">32px</option>
        </select>

        <select onChange={(e) => setFontFamily(e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>

        <button onClick={insertUnorderedList}>• List</button>
        <button onClick={insertOrderedList}>1. List</button>

        <button onClick={() => format('justifyLeft')}>⇤</button>
        <button onClick={() => format('justifyCenter')}>☰</button>
        <button onClick={() => format('justifyRight')}>⇥</button>
        <button onClick={() => format('justifyFull')}>☰☰</button>

        <input type="color" onChange={(e) => format('foreColor', e.target.value)} />

        <button onClick={insertLink}>🔗</button>
        <button onClick={removeLink}>❌🔗</button>

        <button onClick={insertTable}>🧮</button>
        <button onClick={insertEmoji}>😊</button>
        <button onClick={insertImage}>🖼️</button>

        <button onClick={undo}>↩️</button>
        <button onClick={redo}>↪️</button>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        suppressContentEditableWarning
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Start typing here...</p>
      </div>
    </div>
  );
};

export default Editor2;
