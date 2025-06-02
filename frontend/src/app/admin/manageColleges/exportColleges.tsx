import { api_url } from '@/utils/apiCall';
import React from 'react';

const ExportCollegesButton = () => {
  const handleExport = async () => {
    try {
      const response = await fetch(`${api_url}export-colleges`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to export colleges');
      }

      // Get blob from response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'colleges.xlsx';
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export colleges.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Export to Excel
    </button>
  );
};

export default ExportCollegesButton;
