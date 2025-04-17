import React, { useState, useRef, useEffect } from 'react';
import { X, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { TableContent, Widget as WidgetType } from '@/types/layout';

interface WidgetProps {
  widget: WidgetType;
  onUpdate: (content: any) => void;
  onRemove: () => void;
}

export function Widget({ widget, onUpdate, onRemove }: WidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ url: event.target?.result, alt: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ url: event.target?.result, alt: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const initializeTable = (rows: number, cols: number): TableContent => ({
    rows,
    cols,
    data: Array(rows).fill(null).map(() => Array(cols).fill('')),
  });

  useEffect(() => {
    if (widget.type === 'table' && (!widget.content || !widget.content.data)) {
      const defaultTable = initializeTable(3, 3);
      onUpdate(defaultTable);
    }
  }, [widget, onUpdate]);

  const renderTableEditor = (content: TableContent) => {
    if (!content?.data) return null;
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {content.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-200 p-1">
                    <input
                      type="text"
                      value={cell || ''}
                      onChange={(e) => {
                        const newData = [...content.data];
                        newData[rowIndex][colIndex] = e.target.value;
                        onUpdate({ ...content, data: newData });
                      }}
                      className="w-full p-1 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTableView = (content: TableContent) => {
    if (!content?.data) return null;
    return (
      <div className="overflow-x-auto" onClick={() => setIsEditing(true)}>
        <table className="w-full border-collapse">
          <tbody>
            {content.data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-200 p-2">
                    {cell || 'Click to edit'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'heading':
        return isEditing ? (
          <input
            type="text"
            value={widget.content || ''}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full p-2 border rounded"
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <h2 className="text-2xl font-bold" onClick={() => setIsEditing(true)}>
            {widget.content || 'Click to edit heading'}
          </h2>
        );

      case 'text':
        return isEditing ? (
          <textarea
            value={widget.content || ''}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full p-2 border rounded"
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <p className="text-gray-600" onClick={() => setIsEditing(true)}>
            {widget.content || 'Click to edit text'}
          </p>
        );

      case 'button':
        return isEditing ? (
          <input
            type="text"
            value={widget.content || ''}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full p-2 border rounded"
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {widget.content || 'Click to edit button'}
          </button>
        );

      case 'table':
        return widget.content && isEditing
          ? renderTableEditor(widget.content)
          : renderTableView(widget.content);

      case 'accordion':
        const accordion = widget.content || { title: '', content: '', isOpen: false };
        return (
          <div className="border rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
              onClick={() => onUpdate({ ...accordion, isOpen: !accordion.isOpen })}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={accordion.title}
                  onChange={(e) => onUpdate({ ...accordion, title: e.target.value })}
                  className="flex-1 p-2 border rounded mr-2"
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Enter title"
                />
              ) : (
                <h3 className="font-medium">{accordion.title || 'Click to edit title'}</h3>
              )}
              {accordion.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {accordion.isOpen && (
              <div className="p-4 border-t">
                {isEditing ? (
                  <textarea
                    value={accordion.content}
                    onChange={(e) => onUpdate({ ...accordion, content: e.target.value })}
                    className="w-full p-2 border rounded"
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter content"
                  />
                ) : (
                  <p onClick={() => setIsEditing(true)} className="cursor-text">
                    {accordion.content || 'Click to edit content'}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'image':
        return isEditing ? (
          <div className="space-y-2">
            <div
              className={`border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-lg p-8 text-center transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
              >
                Choose Image
              </button>
              <p className="text-sm text-gray-500">or drag and drop an image here</p>
            </div>
            <input
              type="text"
              value={widget.content?.alt || ''}
              placeholder="Enter alt text"
              onChange={(e) => onUpdate({ ...widget.content, alt: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        ) : (
          <div onClick={() => setIsEditing(true)} className="cursor-pointer">
            {widget.content?.url ? (
              <img
                src={widget.content.url}
                alt={widget.content.alt || ''}
                className="max-w-full h-auto rounded"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                Click to add image
              </div>
            )}
          </div>
        );

      default:
        return <div>Unsupported widget type</div>;
    }
  };

  return (
    <div className="group relative border border-gray-200 rounded-lg p-4 mb-4 hover:border-blue-500">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onRemove} className="p-1 text-gray-500 hover:text-red-500">
          <X size={16} />
        </button>
      </div>
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <GripVertical size={16} className="text-gray-400" />
      </div>
      {renderContent()}
    </div>
  );
}
