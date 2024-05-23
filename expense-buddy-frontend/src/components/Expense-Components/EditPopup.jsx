import React, { useState } from 'react';

const EditPopup = ({ item, onSave, onCancel, isIncome }) => {
  const [amount, setAmount] = useState(item.amount);
  const [description, setDescription] = useState(item.description);
  const [sourceOrCategory, setSourceOrCategory] = useState(isIncome ? item.source : item.category);

  const handleSave = () => {
    const updatedItem = {
      amount,
      description,
      ...(isIncome ? { source: sourceOrCategory } : { category: sourceOrCategory })
    };
    onSave(updatedItem);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit {isIncome ? 'Income' : 'Expense'}</h2>
        <div className="mb-4">
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{isIncome ? 'Source' : 'Category'}</label>
          <input
            type="text"
            value={sourceOrCategory}
            onChange={(e) => setSourceOrCategory(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
