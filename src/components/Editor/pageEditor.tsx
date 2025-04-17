"use client"

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Section, Widget as WidgetType } from '@/types/layout';
import { Widget } from './widget';
import { AddWidgetModal } from './addwidgetModel';
import { AddSectionModal } from './addSectionModel';

export function PageEditor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [activeColumn, setActiveColumn] = useState<{ sectionId: string; columnId: string } | null>(null);

  const handleAddSection = (columnCount: number) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      columns: Array.from({ length: columnCount }, () => ({
        id: crypto.randomUUID(),
        widgets: [],
      })),
    };
    setSections(prev => [...prev, newSection]);
    setShowSectionModal(false);
  };

  const handleAddWidget = (type: string) => {
    if (!activeColumn) return;

    const newWidget: WidgetType = {
      id: crypto.randomUUID(),
      type: type as WidgetType['type'],
      content: '',
    };

    setSections(prev =>
      prev.map(section =>
        section.id === activeColumn.sectionId
          ? {
              ...section,
              columns: section.columns.map(column =>
                column.id === activeColumn.columnId
                  ? { ...column, widgets: [...column.widgets, newWidget] }
                  : column
              ),
            }
          : section
      )
    );

    setActiveColumn(null);
  };

  const handleUpdateWidget = (sectionId: string, columnId: string, widgetId: string, content: any) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              columns: section.columns.map(column =>
                column.id === columnId
                  ? {
                      ...column,
                      widgets: column.widgets.map(widget =>
                        widget.id === widgetId ? { ...widget, content } : widget
                      ),
                    }
                  : column
              ),
            }
          : section
      )
    );
  };

  const handleRemoveWidget = (sectionId: string, columnId: string, widgetId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              columns: section.columns.map(column =>
                column.id === columnId
                  ? {
                      ...column,
                      widgets: column.widgets.filter(widget => widget.id !== widgetId),
                    }
                  : column
              ),
            }
          : section
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setShowSectionModal(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors mb-8 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Section
        </button>

        {sections.map(section => (
          <div key={section.id} className="mb-8">
            <div
              className="grid gap-8"
              style={{
                gridTemplateColumns: `repeat(${section.columns.length}, 1fr)`,
              }}
            >
              {section.columns.map(column => (
                <div key={column.id} className="bg-white rounded-lg p-6 shadow-sm">
                  {column.widgets.map(widget => (
                    <Widget
                      key={widget.id}
                      widget={widget}
                      onUpdate={(content) => handleUpdateWidget(section.id, column.id, widget.id, content)}
                      onRemove={() => handleRemoveWidget(section.id, column.id, widget.id)}
                    />
                  ))}
                  <button
                    onClick={() => setActiveColumn({ sectionId: section.id, columnId: column.id })}
                    className="w-full mt-4 p-3 border border-gray-200 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Widget
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showSectionModal && (
        <AddSectionModal
          onClose={() => setShowSectionModal(false)}
          onSelect={handleAddSection}
        />
      )}

      {activeColumn && (
        <AddWidgetModal
          onClose={() => setActiveColumn(null)}
          onSelect={handleAddWidget}
        />
      )}
    </div>
  );
}
