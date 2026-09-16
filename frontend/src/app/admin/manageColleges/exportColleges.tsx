// import { api_url } from '@/utils/apiCall';
// import React from 'react';

// type Props = {
//   selectedCollegeIds: string[];
// };

// const ExportCollegesButton: React.FC<Props> = ({ selectedCollegeIds }) => {
//   const handleExport = async () => {
//     try {
//       const query = selectedCollegeIds.length
//         ? `?ids=${selectedCollegeIds.join(',')}`
//         : '';

//       const exportUrl = `${api_url}export-colleges${query}`;

//       // ✅ DEBUG LOGS
//       console.log('📤 Export Colleges Clicked');
//       console.log(
//         selectedCollegeIds.length > 0
//           ? '➡ Exporting SELECTED colleges'
//           : '➡ Exporting ALL colleges'
//       );
//       console.log('🆔 Selected IDs:', selectedCollegeIds);
//       console.log('🌐 API URL:', exportUrl);

//       const response = await fetch(exportUrl, {
//         method: 'GET',
//       });

//       console.log('✅ API Response Status:', response.status);

//       if (!response.ok) {
//         throw new Error('Failed to export colleges');
//       }

//       const blob = await response.blob();
//       console.log('📦 Excel Blob Size:', blob.size);

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'colleges.xlsx';
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);

//       console.log('⬇ Excel download triggered');
//     } catch (error) {
//       console.error('❌ Export failed:', error);
//       alert('Failed to export colleges.');
//     }
//   };

//   return (
//     <button
//       onClick={handleExport}
//       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//     >
//       Export {selectedCollegeIds.length > 0 ? 'Selected' : 'All'} to Excel
//     </button>
//   );
// };

// export default ExportCollegesButton;
import { api_url } from '@/utils/apiCall';
import React, { useState } from 'react';

type Props = {
  selectedCollegeIds: string[];
};

const ExportCollegesButton: React.FC<Props> = ({ selectedCollegeIds }) => {
  const [pageFrom, setPageFrom] = useState<number>(1);
  const [pageTo, setPageTo] = useState<number>(120);
  const [limit, setLimit] = useState<number>(10);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      let query = '';

      // If colleges are selected, export only selected colleges
      if (selectedCollegeIds.length > 0) {
        query = `?ids=${encodeURIComponent(selectedCollegeIds.join(','))}`;
      } else {
        // Otherwise export based on page range
        const params = new URLSearchParams({
          pageFrom: pageFrom.toString(),
          pageTo: pageTo.toString(),
          limit: limit.toString(),
        });

        query = `?${params.toString()}`;
      }

      const exportUrl = `${api_url}export-colleges${query}`;

      console.log('📤 Export Colleges Clicked');

      if (selectedCollegeIds.length > 0) {
        console.log('➡ Exporting SELECTED colleges');
        console.log('🆔 Selected IDs:', selectedCollegeIds);
      } else {
        console.log('➡ Exporting PAGE RANGE');
        console.log('📄 From Page:', pageFrom);
        console.log('📄 To Page:', pageTo);
        console.log('📦 Records Per Page:', limit);
      }

      console.log('🌐 API URL:', exportUrl);

      const response = await fetch(exportUrl, {
        method: 'GET',
      });

      console.log('✅ API Response Status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to export colleges';

        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorMessage;
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      console.log('📦 Excel Blob Size:', blob.size);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      // Different filename based on export type
      if (selectedCollegeIds.length > 0) {
        a.download = 'selected-colleges.xlsx';
      } else {
        a.download = `colleges-page-${pageFrom}-to-${pageTo}.xlsx`;
      }

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      console.log('⬇ Excel download triggered');
    } catch (error) {
      console.error('❌ Export failed:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to export colleges.'
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-end gap-3 flex-wrap">

      {/* Show page range only when nothing is selected */}
      {selectedCollegeIds.length === 0 && (
        <>
          <div className="flex flex-col">
            <label className="text-sm mb-1">From Page</label>

            <input
              type="number"
              min={1}
              value={pageFrom}
              onChange={(e) =>
                setPageFrom(Number(e.target.value))
              }
              className="border rounded px-3 py-2 w-28"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">To Page</label>

            <input
              type="number"
              min={pageFrom}
              value={pageTo}
              onChange={(e) =>
                setPageTo(Number(e.target.value))
              }
              className="border rounded px-3 py-2 w-28"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">
              Per Page
            </label>

            <input
              type="number"
              min={1}
              value={limit}
              onChange={(e) =>
                setLimit(Number(e.target.value))
              }
              className="border rounded px-3 py-2 w-28"
            />
          </div>
        </>
      )}

      <button
        onClick={handleExport}
        disabled={exporting}
        className={`px-4 py-2 text-white rounded ${
          exporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {exporting
          ? 'Exporting...'
          : selectedCollegeIds.length > 0
          ? `Export Selected (${selectedCollegeIds.length})`
          : `Export Page ${pageFrom} - ${pageTo}`}
      </button>
    </div>
  );
};

export default ExportCollegesButton;