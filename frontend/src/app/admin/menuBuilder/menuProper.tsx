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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🛠️ Admin Menu</h1>
  
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-8">
          {menu.map((menuItem) => (
            <div key={menuItem._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              {/* Columns Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {menuItem.columns.map((column) => (
                  <div key={column._id} className="bg-gray-50 rounded-lg p-5 border">
                    {/* Title Edit */}
                    {editing?.columnId === column._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editValue.title || column.title}
                          onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                          placeholder="Column title"
                          className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveColumnEdit(menuItem._id, column._id!)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h2
                        className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer mb-4"
                        onClick={() => handleEditColumn(column._id || "", column.title)}
                      >
                        {column.title}
                      </h2>
                    )}
  
                    {/* Links */}
                    {column.links && column.links.length > 0 ? (
                      <ul className="space-y-4">
                        {column.links.map((link) => (
                          <li key={link._id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            {editing?.linkId === link._id ? (
                              <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
                                <input
                                  type="text"
                                  value={editValue.label || link.label}
                                  onChange={(e) => setEditValue({ ...editValue, label: e.target.value })}
                                  placeholder="Label"
                                  className="w-full md:w-1/2 border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={editValue.url || link.url}
                                  onChange={(e) => setEditValue({ ...editValue, url: e.target.value })}
                                  placeholder="URL"
                                  className="w-full md:w-1/2 border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  onClick={() => handleSaveLinkEdit(menuItem._id, column._id!, link._id!)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center w-full">
                                <span className="truncate font-medium text-gray-700 w-2/3">{link.label}</span>
                                <button
                                  onClick={() => handleEditLink(link._id || "", link.label, link.url)}
                                  className="text-blue-500 hover:underline"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic text-gray-500">No links available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}
