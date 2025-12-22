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

type SelectedType = {
  streams: string[];
  exams: string[];
  courses: string[];
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

    const fetchCategories = async () => {
      try {
        const [allRes, selectedRes] = await Promise.all([
          axios.get(`${api_url}allCategoriesFilter`),
          axios.get(`${api_url}getCategoriesFilter`),
        ]);

        const allData = allRes.data;
        const selectedData: {
          _id: string;
          type: keyof SelectedType;
          name: string;
        }[] = selectedRes.data;

        const initialSelected: SelectedType = {
          streams: [],
          exams: [],
          courses: [],
        };
        selectedData.forEach((cat) => initialSelected[cat.type].push(cat.name));
        setSelected(initialSelected);

        const buildSectionItems = (
          type: keyof SelectedType,
          names: string[],
          counts: any
        ) =>
          names.map((name) => {
            const selItem = selectedData.find(
              (s) => s.type === type && s.name === name
            );
            return {
              name,
              _id: selItem?._id,
              collegeCount: counts?.[name] || 0,
            };
          });

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
              allData.streamCounts
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
              allData.examCounts
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
              allData.courseCounts
            ),
          },
        ]);

        if (allData.collegeCount) setCollegeCount(allData.collegeCount);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
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
    dropIndex: number
  ) => {
    if (!draggedIndex || draggedIndex.sectionKey !== sectionKey) return;
    const items = Array.from(selected[sectionKey]);
    const [movedItem] = items.splice(draggedIndex.index, 1);
    items.splice(dropIndex, 0, movedItem);
    setSelected((prev) => ({ ...prev, [sectionKey]: items }));
    setDraggedIndex(null);

    try {
      const orderedIds = items
        .map(
          (name) =>
            sections
              .find((s) => s.key === sectionKey)
              ?.items.find((i) => i.name === name)?._id
        )
        .filter(Boolean);
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
    item: SectionItem
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
        [sectionKey]: [...prev[sectionKey], item.name],
      }));

      // Inject _id into section items list
      setSections((prev) =>
        prev.map((s) =>
          s.key === sectionKey
            ? {
                ...s,
                items: s.items.map((i) =>
                  i.name === item.name ? { ...i, _id: newId } : i
                ),
              }
            : s
        )
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
      const category = sections
        .find((s) => s.key === sectionKey)
        ?.items.find((i) => i.name === itemName);
      if (!category?._id) return;
      await axios.delete(`${api_url}/deleteCategoriesFilter/${category._id}`);
      setSelected((prev) => ({
        ...prev,
        [sectionKey]: prev[sectionKey].filter((i) => i !== itemName),
      }));
    } catch (err) {
      console.error("Failed to remove category:", err);
    } finally {
      setConfirmOpen(false);
      setPendingRemove(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">
        Category Filters
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Total Colleges: {collegeCount}
      </p>

      {/* --- Selected Filters Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sections.map((section) => (
          <div
            key={section.key}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 max-h-[500px] overflow-y-auto"
          >
            <h3 className="font-semibold text-xl sticky top-0 bg-white py-3 border-b mb-3">
              {section.title} (Selected)
            </h3>

            {/* Selected Filters */}
            <div className="mb-4">
              {selected[section.key].length > 0 ? (
                selected[section.key].map((itemName, index) => {
                  const item = section.items.find((i) => i.name === itemName);
                  return (
                    <div
                      key={itemName}
                      draggable
                      onDragStart={() => handleDragStart(section.key, index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(section.key, index)}
                      className="flex items-center justify-between p-3 mb-2 rounded-lg border bg-gray-50 shadow hover:bg-gray-100 cursor-move transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-xl 
        ${section.boxBg} ${section.boxColor} font-bold text-sm`}
                        >
                          {itemName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {itemName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item?.collegeCount} colleges
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(section.key, itemName)}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No filters selected
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- Global Search & Add Filters --- */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Add Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const filteredItems = section.items.filter(
              (item) =>
                item.name
                  .toLowerCase()
                  .includes(search[section.key].toLowerCase()) &&
                !selected[section.key].includes(item.name)
            );

            return (
              <div
                key={section.key}
                className="bg-white/80 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition"
              >
                {/* Section Title */}
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

                {/* Search Box */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder={`Search ${section.title}`}
                    value={search[section.key]}
                    onChange={(e) =>
                      setSearch({ ...search, [section.key]: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
                </div>

                {/* Item List */}
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scroll">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => handleAdd(section.key, item)}
                        className="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-50 hover:bg-white border hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-full bg-blue-400 rounded-full group-hover:bg-blue-600 transition"></div>
                          <p className="font-medium text-gray-800 group-hover:text-blue-600">
                            {item.name}
                          </p>
                        </div>

                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {item.collegeCount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic text-center py-4">
                      No items found
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleRemoveConfirmed}
      />
    </div>
  );
};

export default CategoryFilter;
