import React from "react";

function AdminToolsTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-gray-300 mb-6">
      <button
        className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${activeTab === 'times' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
        onClick={() => setActiveTab('times')}
      >
        Set Available Times
      </button>
      <button
        className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${activeTab === 'reserved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
        onClick={() => setActiveTab('reserved')}
      >
        Reserved Appointments
      </button>
      <button
        className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
        onClick={() => setActiveTab('users')}
      >
        Users
      </button>
    </div>
  );
}

export default AdminToolsTabs;
