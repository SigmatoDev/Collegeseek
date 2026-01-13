import { api_url } from '@/utils/apiCall';
import React from 'react';

type Props = {
  selectedCollegeIds: string[];
};

const ExportCollegesButton: React.FC<Props> = ({ selectedCollegeIds }) => {
  const handleExport = async () => {
    try {
      const query = selectedCollegeIds.length
        ? `?ids=${selectedCollegeIds.join(',')}`
        : '';

      const exportUrl = `${api_url}export-colleges${query}`;

      // ✅ DEBUG LOGS
      console.log('📤 Export Colleges Clicked');
      console.log(
        selectedCollegeIds.length > 0
          ? '➡ Exporting SELECTED colleges'
          : '➡ Exporting ALL colleges'
      );
      console.log('🆔 Selected IDs:', selectedCollegeIds);
      console.log('🌐 API URL:', exportUrl);

      const response = await fetch(exportUrl, {
        method: 'GET',
      });

      console.log('✅ API Response Status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to export colleges');
      }

      const blob = await response.blob();
      console.log('📦 Excel Blob Size:', blob.size);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'colleges.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log('⬇ Excel download triggered');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Failed to export colleges.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Export {selectedCollegeIds.length > 0 ? 'Selected' : 'All'} to Excel
    </button>
  );
};

export default ExportCollegesButton;
