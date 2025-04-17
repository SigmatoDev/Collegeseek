"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

type Link = {
  _id?: string;
  label: string;
  url: string;
};

type Column = {
  _id?: string;
  title: string;
  links?: Link[];
};

export default function AdminMenuProper() {
  const [menu, setMenu] = useState<{ _id: string; columns: Column[] }[]>([]); // Initialize as an array
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<{ columnId?: string; linkId?: string } | null>(null);
  const [editValue, setEditValue] = useState<{ title?: string; label?: string; url?: string }>({});

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api_url}menus`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setMenu(response.data.data); // Set menu as an array
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditColumn = (columnId: string, title: string) => {
    if (columnId) {
      setEditing({ columnId });
      setEditValue({ title });
    }
  };

  const handleEditLink = (linkId: string, label: string, url: string) => {
    if (linkId) {
      setEditing({ linkId });
      setEditValue({ label, url });
    }
  };

  const handleSaveColumnEdit = async (menuItemId: string, columnId: string) => {
    if (!columnId || !editValue.title) {
      console.error("Column ID or Title is missing, cannot update the column.");
      return; // Exit if column ID or title is missing
    }

    const updateColumnUrl = `${api_url}menus/${menuItemId}/column/${columnId}`;
    const requestBody = { title: editValue.title };

    try {
      const response = await axios.put(updateColumnUrl, requestBody);
      fetchMenu(); // Refresh the menu after update
      setEditing(null); // Clear the editing state
    } catch (error) {
      console.error("Error saving column edit:", error);
    }
  };

  const handleSaveLinkEdit = async (menuItemId: string, columnId: string, linkId: string) => {
    if (!linkId || !editValue.label || !editValue.url) {
      console.error("Link ID, Label, or URL is missing, cannot update the link.");
      return; // Exit if link ID, label, or URL is missing
    }

    const updateLinkUrl = `${api_url}menus/${menuItemId}/column/${columnId}/link/${linkId}`;
    const requestBody = { label: editValue.label, url: editValue.url };

    try {
      const response = await axios.put(updateLinkUrl, requestBody);
      fetchMenu(); // Refresh the menu after update
      setEditing(null); // Clear the editing state
    } catch (error) {
      console.error("Error saving link edit:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Menu</h1>

      {loading ? (
        <div className="text-center mb-4">Loading...</div>
      ) : (
        <div className="gap-6">
          {/* Iterate over each menu */}
          {menu.map((menuItem) => (
            <div key={menuItem._id} className="border p-4 rounded-lg shadow-md bg-white">
              {/* Iterate over each column in this menu */}
              {menuItem.columns.map((column) => (
                <div key={column._id}>
                  {/* Column Title */}
                  {editing?.columnId === column._id ? (
                    <div className="mb-3">
                      <input
                        type="text"
                        value={editValue.title || column.title}
                        onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                        className="border px-3 py-1 rounded w-full"
                      />
                      <button
                        onClick={() => handleSaveColumnEdit(menuItem._id, column._id!)} // Save column title edit
                        className="bg-green-500 text-white px-4 py-1 rounded mt-2"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <h3
                      className="text-xl font-semibold mb-3 cursor-pointer"
                      onClick={() => handleEditColumn(column._id || "", column.title)}
                    >
                      {column.title}
                    </h3>
                  )}

                  {/* Links */}
                  {column.links && column.links.length > 0 ? (
                    <ul className="space-y-2">
                      {column.links.map((link) => (
                        <li key={link._id} className="flex items-center gap-2">
                          {editing?.linkId === link._id ? (
                            <>
                              <input
                                type="text"
                                value={editValue.label || link.label}
                                onChange={(e) => setEditValue({ ...editValue, label: e.target.value })}
                                className="border px-2 py-1 rounded w-[45%]"
                              />
                              <input
                                type="text"
                                value={editValue.url || link.url}
                                onChange={(e) => setEditValue({ ...editValue, url: e.target.value })}
                                className="border px-2 py-1 rounded w-[45%]"
                              />
                              <button
                                onClick={() => handleSaveLinkEdit(menuItem._id, column._id!, link._id!)} // Save link edit
                                className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                              >
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="w-[45%] truncate">{link.label}</span>
                              <button
                                onClick={() => handleEditLink(link._id || "", link.label, link.url)}
                                className="text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No links available</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
