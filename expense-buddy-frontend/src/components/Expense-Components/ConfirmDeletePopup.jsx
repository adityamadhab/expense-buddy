import React from 'react';

const ConfirmDeletePopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Are you sure you want to delete this item?</h2>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
            No
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
