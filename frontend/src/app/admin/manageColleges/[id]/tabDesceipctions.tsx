import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const EditTabPage = () => {
  const router = useRouter();
  const { index } = router.query;

  const [tabData, setTabData] = useState({ title: '', description: '' });

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof index === 'string') {
      const storedTabs = JSON.parse(localStorage.getItem('collegeTabs') || '[]');
      const tabIndex = parseInt(index);
      if (!isNaN(tabIndex)) {
        setTabData(storedTabs[tabIndex]);
      }
    }
  }, [index]);

  const handleSave = () => {
    if (typeof index !== 'string') return;

    const tabIndex = parseInt(index);
    const storedTabs = JSON.parse(localStorage.getItem('collegeTabs') || '[]');
    storedTabs[tabIndex] = tabData;
    localStorage.setItem('collegeTabs', JSON.stringify(storedTabs));
    router.push('/');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Edit Tab Description</h1>
      <input
        type="text"
        value={tabData.title}
        onChange={(e) => setTabData({ ...tabData, title: e.target.value })}
        className="w-full p-2 border rounded"
        placeholder="Tab Title"
      />
      <textarea
        value={tabData.description}
        onChange={(e) => setTabData({ ...tabData, description: e.target.value })}
        className="w-full h-60 p-2 border rounded"
        placeholder="Tab Description"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
};

export default EditTabPage;
