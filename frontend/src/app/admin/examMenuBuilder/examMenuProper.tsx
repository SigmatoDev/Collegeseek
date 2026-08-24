"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import EditableLinkItem from "../menuBuilder/EditableLinkItem";

type Link = {
  _id?: string;
  label: string;
  url: string;
  tempId?: string;
};

type Column = {
  _id?: string;
  title: string;
  links?: Link[];
};

type Menu = {
  _id: string;
  columns: Column[];
};

function NativeDraggableItem({
  link, index, onDragStart, onDrop, onDragOver,
  editing, editValue, setEditValue, onEditClick, onSaveClick, onDeleteClick,
}: any) {
  const dragId = link._id || link.tempId;
  return (
    <li
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white rounded px-3 py-2 shadow"
    >
      <span className="cursor-move text-gray-500 select-none">≡</span>
      <EditableLinkItem
        id={dragId}
        link={link}
        editing={editing}
        editValue={editValue}
        setEditValue={setEditValue}
        onEditClick={onEditClick}
        onSaveClick={onSaveClick}
      />
      <button onClick={onDeleteClick} className="text-red-600 hover:text-red-800 text-sm">
        Delete
      </button>
    </li>
  );
}

export default function AdminExamMenuProper() {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ columnId?: string; linkId?: string } | null>(null);
  const [editValue, setEditValue] = useState<{ title?: string; label: string; url: string }>({ label: "", url: "" });
  const [newLinkInputs, setNewLinkInputs] = useState<Record<string, { label: string; url: string }>>({});
  const [newColumnInputs, setNewColumnInputs] = useState<Record<string, string>>({}); // menuId -> title
  const [showAddColumn, setShowAddColumn] = useState<Record<string, boolean>>({}); // menuId -> bool
  const tempIdCounter = useRef(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => { fetchMenu(); }, []);

  const assignTempIdsToLinks = (menus: Menu[]): Menu[] => {
    return menus.map((menuItem) => ({
      ...menuItem,
      columns: menuItem.columns.map((column) => ({
        ...column,
        links: (column.links || []).map((link) => {
          if (!link._id && !link.tempId) {
            tempIdCounter.current++;
            return { ...link, tempId: `temp-link-${tempIdCounter.current}` };
          }
          return link;
        }),
      })),
    }));
  };

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api_url}exam-menus`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setMenu(assignTempIdsToLinks(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching exam menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditColumn = (columnId: string, title: string) => {
    setEditing({ columnId });
    setEditValue({ title, label: "", url: "" });
  };

  const handleEditLink = (linkId: string, label: string, url: string) => {
    setEditing({ linkId });
    setEditValue({ label, url });
  };

  const handleSaveColumnEdit = async (menuItemId: string, columnId: string) => {
    if (!columnId || !editValue.title) return;
    try {
      await axios.put(`${api_url}exam-menus/${menuItemId}/column/${columnId}`, { title: editValue.title });
      fetchMenu();
      setEditing(null);
      setEditValue({ label: "", url: "" });
    } catch (error) {
      console.error("Error saving exam column edit:", error);
    }
  };

  const handleSaveLinkEdit = async (menuItemId: string, columnId: string, linkId: string) => {
    if (!linkId || !editValue.label || !editValue.url) return;
    try {
      await axios.put(`${api_url}exam-menus/${menuItemId}/column/${columnId}/link/${linkId}`, {
        label: editValue.label,
        url: editValue.url,
      });
      fetchMenu();
      setEditing(null);
      setEditValue({ label: "", url: "" });
    } catch (error) {
      console.error("Error saving exam link edit:", error);
    }
  };

  const handleNewLinkChange = (columnId: string, field: "label" | "url", value: string) => {
    setNewLinkInputs((prev) => ({ ...prev, [columnId]: { ...prev[columnId], [field]: value } }));
  };

  const handleAddLink = async (menuId: string, columnId: string) => {
    const inputs = newLinkInputs[columnId];
    if (!inputs?.label || !inputs?.url) {
      alert("Please fill both Label and URL to add a link.");
      return;
    }
    try {
      await axios.post(`${api_url}exam-menus/${menuId}/columns/${columnId}/links`, inputs);
      setNewLinkInputs((prev) => ({ ...prev, [columnId]: { label: "", url: "" } }));
      fetchMenu();
    } catch (error) {
      console.error("Error adding exam link:", error);
    }
  };

  const handleDeleteLink = async (menuId: string, columnId: string, linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      await axios.delete(`${api_url}exam-menu/${menuId}/column/${columnId}/link/${linkId}`);
      fetchMenu();
    } catch (error) {
      console.error("Error deleting exam link:", error);
    }
  };

  // Add new column
  const handleAddColumn = async (menuId: string) => {
    const title = newColumnInputs[menuId]?.trim();
    if (!title) {
      alert("Please enter a column title.");
      return;
    }
    try {
      await axios.post(`${api_url}exam-menus/${menuId}/columns`, { title });
      setNewColumnInputs((prev) => ({ ...prev, [menuId]: "" }));
      setShowAddColumn((prev) => ({ ...prev, [menuId]: false }));
      fetchMenu();
    } catch (error) {
      console.error("Error adding exam column:", error);
    }
  };

  // Delete a column
  const handleDeleteColumn = async (menuId: string, columnId: string) => {
    if (!confirm("Are you sure you want to delete this entire column and all its links?")) return;
    try {
      await axios.delete(`${api_url}exam-menus/${menuId}/column/${columnId}`);
      fetchMenu();
    } catch (error) {
      console.error("Error deleting exam column:", error);
    }
  };

  return (
    <div className="p-6 max-w-[1500px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🛠️ Exam Menu Builder</h1>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-8">
          {menu.map((menuItem) => (
            <div key={menuItem._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <div className="grid gap-6 md:grid-cols-2">
                {menuItem.columns.map((column, columnIndex) => {
                  const safeColumnId = column._id || `column-${columnIndex}`;
                  return (
                    <div key={safeColumnId} className="bg-gray-50 rounded-lg p-5 border relative">

                      {/* Delete Column Button */}
                      <button
                        onClick={() => handleDeleteColumn(menuItem._id, column._id!)}
                        className="absolute top-3 right-3 text-xs text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 px-2 py-1 rounded"
                      >
                        Delete Column
                      </button>

                      {editing?.columnId === column._id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editValue.title ?? column.title}
                            onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                            placeholder="Column title"
                            className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleSaveColumnEdit(menuItem._id, column._id!)}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <h2
                          className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer mb-4 pr-24"
                          onClick={() => handleEditColumn(column._id || "", column.title)}
                        >
                          {column.title}
                        </h2>
                      )}

                      <ul className="space-y-4">
                        {column.links?.map((link, index) => {
                          const dragId = link._id || link.tempId;
                          if (!dragId) return null;
                          return (
                            <NativeDraggableItem
                              key={dragId}
                              link={link}
                              index={index}
                              onDragStart={(i: number) => setDraggingIndex(i)}
                              onDragOver={(e: React.DragEvent) => e.preventDefault()}
                              onDrop={(dropIndex: number) => {
                                if (draggingIndex === null || draggingIndex === dropIndex) return;
                                const updatedMenu = [...menu];
                                const colLinks =
                                  updatedMenu.find((m) => m._id === menuItem._id)!
                                    .columns.find((c) => c._id === column._id)!.links || [];
                                const movedLink = colLinks[draggingIndex];
                                colLinks.splice(draggingIndex, 1);
                                colLinks.splice(dropIndex, 0, movedLink);
                                setMenu(updatedMenu);
                                setDraggingIndex(null);
                                axios
                                  .put(`${api_url}exam-menus/${menuItem._id}/reorder`, {
                                    updatedColumns: updatedMenu.find((m) => m._id === menuItem._id)!.columns,
                                  })
                                  .catch((err) => {
                                    console.error("Failed to reorder exam menu", err);
                                    fetchMenu();
                                  });
                              }}
                              editing={editing}
                              editValue={editValue}
                              setEditValue={setEditValue}
                              onEditClick={() => handleEditLink(dragId, link.label, link.url)}
                              onSaveClick={() => handleSaveLinkEdit(menuItem._id, column._id!, dragId)}
                              onDeleteClick={() => handleDeleteLink(menuItem._id, column._id!, dragId)}
                            />
                          );
                        })}
                      </ul>

                      <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold mb-2">Add New Link</h3>
                        <input
                          type="text"
                          placeholder="Label"
                          value={newLinkInputs[column._id!]?.label || ""}
                          onChange={(e) => handleNewLinkChange(column._id!, "label", e.target.value)}
                          className="border px-3 py-1 rounded mr-2 mb-2 md:mb-0"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={newLinkInputs[column._id!]?.url || ""}
                          onChange={(e) => handleNewLinkChange(column._id!, "url", e.target.value)}
                          className="border px-3 py-1 rounded mr-2 mb-2 md:mb-0"
                        />
                        <button
                          onClick={() => handleAddLink(menuItem._id, column._id!)}
                          className="bg-blue-600 text-white px-4 py-1 mt-3 rounded"
                        >
                          Add Link
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Column Section */}
              <div className="mt-6 border-t pt-4">
                {showAddColumn[menuItem._id] ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="New column title"
                      value={newColumnInputs[menuItem._id] || ""}
                      onChange={(e) =>
                        setNewColumnInputs((prev) => ({ ...prev, [menuItem._id]: e.target.value }))
                      }
                      className="border px-3 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleAddColumn(menuItem._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Save Column
                    </button>
                    <button
                      onClick={() => setShowAddColumn((prev) => ({ ...prev, [menuItem._id]: false }))}
                      className="text-gray-500 hover:text-gray-700 px-3 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddColumn((prev) => ({ ...prev, [menuItem._id]: true }))}
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                  >
                    + Add Column
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

