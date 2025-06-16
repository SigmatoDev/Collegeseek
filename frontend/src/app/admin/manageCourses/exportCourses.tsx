'use client';

import { api_url } from '@/utils/apiCall';
import React from 'react';

type Props = {
  selectedCourseIds: string[];
};

const ExportCoursesButton: React.FC<Props> = ({ selectedCourseIds }) => {
  const handleExport = async () => {
    try {
      const query = selectedCourseIds.length
        ? `?ids=${selectedCourseIds.join(',')}`
        : '';

      const response = await fetch(`${api_url}export-courses${query}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to export courses');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'courses.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export courses.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Export {selectedCourseIds.length > 0 ? 'Selected' : 'All'} Courses
    </button>
  );
};

export default ExportCoursesButton;
