"use client";

import React, { useEffect, useRef } from "react";

type EditValueType = {
  label: string;
  url: string;
};

type EditableLinkItemProps = {
  id: string;
  link: {
    _id?: string;
    tempId?: string;
    label: string;
    url: string;
  };
  editing?: { linkId?: string; columnId?: string } | null;
  editValue: EditValueType;
  setEditValue: React.Dispatch<React.SetStateAction<EditValueType>>;
  onEditClick: (id: string) => void;
  onSaveClick: (id: string) => void;
};

export default function EditableLinkItem({
  id,
  link,
  editing,
  editValue,
  setEditValue,
  onEditClick,
  onSaveClick,
}: EditableLinkItemProps) {
  const currentLinkId = link._id || link.tempId;
  const isEditing = editing?.linkId === currentLinkId;

  const labelInputRef = useRef<HTMLInputElement>(null);

  // Log to debug issues
  useEffect(() => {
    console.log("currentLinkId:", currentLinkId);
    console.log("editing.linkId:", editing?.linkId);
    console.log("isEditing:", isEditing);
  }, [editing, currentLinkId]);

  // Autofill fields and focus input when editing
  useEffect(() => {
    if (isEditing) {
      setEditValue({ label: link.label, url: link.url });
      if (labelInputRef.current) {
        labelInputRef.current.focus();
      }
    }
  }, [isEditing, link.label, link.url, setEditValue]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditValue((prev) => ({ ...prev, label: value }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditValue((prev) => ({ ...prev, url: value }));
  };

  const handleSave = () => {
    onSaveClick(id);
  };

 const handleEdit = () => {
  console.log("Clicked Edit for:", id);
  setEditValue({ label: link.label, url: link.url });
  onEditClick(id); // Make sure this sets editing to correct { linkId }
};

  if (isEditing) {
    return (
<div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
        <input
          ref={labelInputRef}
          type="text"
          value={editValue.label}
          onChange={handleLabelChange}
          placeholder="Label"
          className="w-full md:w-1/2 border px-4 py-2 rounded"
        />
        <input
          type="text"
          value={editValue.url}
          onChange={handleUrlChange}
          placeholder="URL"
          className="w-full md:w-1/2 border px-4 py-2 rounded"
        />
        <button
          type="button"
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center w-full">
      <span className="truncate font-medium text-gray-700 w-2/3">
        {link.label}
      </span>
      <button
        type="button"
        onClick={handleEdit}
        className="text-blue-500 hover:underline"
      >
        Edit
      </button>
      
    </div>
  );
}
