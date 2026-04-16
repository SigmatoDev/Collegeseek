"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import ConfirmDialog from "@/components/confirmDialog/confirmDialog";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";

interface SectionItem {
  _id?: string;
  name: string;
  collegeCount: number;
}

interface SectionType {
  key: "streams" | "exams" | "courses";
  title: string;
  icon: string;
  boxBg: string;
  boxColor: string;
  items: SectionItem[];
}

type SelectedItem = {
  name: string;
  _id?: string;
};

type SelectedType = {
  streams: SelectedItem[];
  exams: SelectedItem[];
  courses: SelectedItem[];
};

type SearchType = {
  streams: string;
  exams: string;
  courses: string;
};

const CategoryFilter: React.FC = () => {
  const [sections, setSections] = useState<SectionType[]>([
    {
      key: "streams",
      title: "Streams",
      icon: "S",
      boxBg: "bg-blue-100",
      boxColor: "text-blue-600",
      items: [],
    },
    {
      key: "exams",
      title: "Exams",
      icon: "E",
      boxBg: "bg-green-100",
      boxColor: "text-green-600",
      items: [],
    },
    {
      key: "courses",
      title: "Courses",
      icon: "C",
      boxBg: "bg-purple-100",
      boxColor: "text-purple-600",
      items: [],
    },
  ]);

  const [selected, setSelected] = useState<SelectedType>({
    streams: [],
    exams: [],
    courses: [],
  });
  const [search, setSearch] = useState<SearchType>({
    streams: "",
    exams: "",
    courses: "",
  });
  const [collegeCount, setCollegeCount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<{
    sectionKey: keyof SelectedType;
    index: number;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    sectionKey: keyof SelectedType;
    itemName: string;
  } | null>(null);

useEffect(() => {
  setMounted(true);

  type CategoryAPIItem = {
    _id: string;
    type: keyof SelectedType;
    name: string;
  };

  const fetchCategories = async () => {
    const start = performance.now();

    try {
      const [allRes, selectedRes] = await Promise.all([
        axios.get(`${api_url}allCategoriesFilter`),
        axios.get(`${api_url}getCategoriesFilter`),
      ]);

      const apiEnd = performance.now();
      console.log(
        `🌐 API Time: ${(apiEnd - start).toFixed(2)} ms`
      );

      const allData = allRes.data;

      const selectedData: CategoryAPIItem[] = selectedRes.data;

      /* ================= INITIAL STATE ================= */
      const initialSelected: SelectedType = {
        streams: [],
        exams: [],
        courses: [],
      };

      /* ================= O(1) LOOKUP MAP ================= */
      const selectedMap: Record<string, { _id: string }> = {};

      selectedData.forEach((cat) => {
        selectedMap[`${cat.type}_${cat.name}`] = { _id: cat._id };

        initialSelected[cat.type].push({
          name: cat.name,
          _id: cat._id,
        });
      });

      setSelected(initialSelected);

      /* ================= BUILD ITEMS ================= */
      const buildSectionItems = (
        type: keyof SelectedType,
        names: string[],
        counts: Record<string, number>
      ): SectionItem[] =>
        names.map((name) => {
          const selItem = selectedMap[`${type}_${name}`];

          return {
            name,
            _id: selItem?._id,
            collegeCount: counts?.[name] || 0,
          };
        });

      /* ================= SET SECTIONS ================= */
      setSections([
        {
          key: "streams",
          title: "Streams",
          icon: "S",
          boxBg: "bg-blue-100",
          boxColor: "text-blue-600",
          items: buildSectionItems(
            "streams",
            allData.streams || [],
            allData.streamCounts || {}
          ),
        },
        {
          key: "exams",
          title: "Exams",
          icon: "E",
          boxBg: "bg-green-100",
          boxColor: "text-green-600",
          items: buildSectionItems(
            "exams",
            allData.exams || [],
            allData.examCounts || {}
          ),
        },
        {
          key: "courses",
          title: "Courses",
          icon: "C",
          boxBg: "bg-purple-100",
          boxColor: "text-purple-600",
          items: buildSectionItems(
            "courses",
            allData.courses || [],
            allData.courseCounts || {}
          ),
        },
      ]);

      if (allData.collegeCount) {
        setCollegeCount(allData.collegeCount);
      }

      const end = performance.now();
      console.log(
        `⚡ Total Time (API + Processing): ${(end - start).toFixed(2)} ms`
      );
    } catch (error) {
      console.error("❌ Failed to fetch categories:", error);
    }
  };

  fetchCategories();
}, []);

  if (!mounted) return null;

  const handleDragStart = (sectionKey: keyof SelectedType, index: number) =>
    setDraggedIndex({ sectionKey, index });
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (
    sectionKey: keyof SelectedType,
    dropIndex: number,
  ) => {
    if (!draggedIndex || draggedIndex.sectionKey !== sectionKey) return;
    const items = Array.from(selected[sectionKey]);
    const [movedItem] = items.splice(draggedIndex.index, 1);
    items.splice(dropIndex, 0, movedItem);
    setSelected((prev) => ({ ...prev, [sectionKey]: items }));
    setDraggedIndex(null);

    try {
      const orderedIds = items.map((item) => item._id).filter(Boolean);
      console.log("Updated order:", orderedIds);
      await axios.post(`${api_url}updateCategoriesOrder`, {
        type: sectionKey,
        orderedIds,
      });
      console.log("Order updated successfully");
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };
  const handleAdd = async (
    sectionKey: keyof SelectedType,
    item: SectionItem,
  ) => {
    try {
      const res = await axios.post(`${api_url}addCategoriesFilter`, {
        type: sectionKey,
        name: item.name,
      });

      const newId = res.data?._id;

      // Update selected list
      setSelected((prev) => ({
        ...prev,
        [sectionKey]: [...prev[sectionKey], { name: item.name, _id: newId }],
      }));

      // Inject _id into section items list
      setSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                items: s.items.map((i) =>
                  i.name === item.name ? { ...i, _id: newId } : i,
                ),
              }
            : s,
        ),
      );

      // Clear search for better UX
      setSearch((prev) => ({ ...prev, [sectionKey]: "" }));
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleRemove = (sectionKey: keyof SelectedType, itemName: string) => {
    setPendingRemove({ sectionKey, itemName });
    setConfirmOpen(true);
  };

  const handleRemoveConfirmed = async () => {
    if (!pendingRemove) return;

    const { sectionKey, itemName } = pendingRemove;

    try {
      // ✅ Get item directly from selected (reliable)
      const selectedItem = selected[sectionKey].find(
        (i) => i.name === itemName,
      );

      console.log("🎯 Selected Item:", selectedItem);

      if (!selectedItem?._id) {
        console.error("❌ No _id found for delete");
        return;
      }

      // ✅ API call
      await axios.delete(
        `${api_url}/deleteCategoriesFilter/${selectedItem._id}`,
      );

      // ✅ Correct removal (object-based)
      setSelected((prev) => ({
        ...prev,
        [sectionKey]: prev[sectionKey].filter((i) => i.name !== itemName),
      }));

      console.log("✅ Deleted successfully");
    } catch (err) {
      console.error("💥 Failed to remove category:", err);
    } finally {
      setConfirmOpen(false);
      setPendingRemove(null);
    }
  };

return (
  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
    {/* Header */}
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Category Filters
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Total Colleges:{" "}
          <span className="font-semibold text-gray-700">
            {collegeCount}
          </span>
        </p>
      </div>
    </div>

    {/* ================= Selected Filters ================= */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {sections.map((section) => (
        <div
          key={section.key}
          className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {section.title}
            </h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {selected[section.key].length}
            </span>
          </div>

          {/* Selected Items */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {selected[section.key].length > 0 ? (
              selected[section.key].map((item, index) => {
                const itemName = item.name;

                const count =
                  sections
                    .find((s) => s.key === section.key)
                    ?.items.find((i) => i.name === item.name)
                    ?.collegeCount ?? 0;

                return (
                  <div
                    key={itemName}
                    draggable
                    onDragStart={() =>
                      handleDragStart(section.key, index)
                    }
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(section.key, index)}
                    className="flex items-center justify-between px-4 py-2 rounded-xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md transition cursor-move group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold ${section.boxBg} ${section.boxColor}`}
                      >
                        {itemName.substring(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {itemName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {count} colleges
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleRemove(section.key, itemName)
                      }
                      className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm italic">
                No filters selected
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* ================= Add Filters ================= */}
    <div>
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Add Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const filteredItems = section.items.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(search[section.key].toLowerCase()) &&
              !selected[section.key].some(
                (s) => s.name === item.name
              )
          );

          return (
            <div
              key={section.key}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl ${section.boxBg} ${section.boxColor} font-bold`}
                >
                  {section.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {section.title}
                </h4>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder={`Search ${section.title}`}
                  value={search[section.key]}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      [section.key]: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
              </div>

              {/* Items */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.name}
                      onClick={() =>
                        handleAdd(section.key, item)
                      }
                      className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition group"
                    >
                      <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                        {item.name}
                      </p>

                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                        {item.collegeCount}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4 italic">
                    No results
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Confirm Dialog */}
    <ConfirmDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleRemoveConfirmed}
    />
  </div>
);
};

export default CategoryFilter;
