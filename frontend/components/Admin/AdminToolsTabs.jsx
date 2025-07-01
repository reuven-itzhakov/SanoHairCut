import { useTranslation } from 'react-i18next';

function AdminToolsTabs({ activeTab, setActiveTab }) {
  const { t } = useTranslation();
  return (
    <div className="flex border-b border-gray-300 mb-6">
      <button
        className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${activeTab === 'times' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
        onClick={() => setActiveTab('times')}
      >
        {t('adminToolsTabs.setTimes')}
      </button>
      <button
        className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${activeTab === 'reserved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
        onClick={() => setActiveTab('reserved')}
      >
        {t('adminToolsTabs.reserved')}
      </button>
      <button
        className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
        onClick={() => setActiveTab('users')}
      >
        {t('adminToolsTabs.users')}
      </button>
    </div>
  );
}

export default AdminToolsTabs;
