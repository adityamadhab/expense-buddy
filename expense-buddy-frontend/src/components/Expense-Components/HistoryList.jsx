import React, { useState } from 'react';
import axios from 'axios';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import EditPopup from './EditPopup';

export const HistoryList = ({ history, fetchHistory, isIncome }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async () => {
    if (itemToDelete) {
      const endpoint = isIncome ? `/income/${itemToDelete._id}` : `/expense/${itemToDelete._id}`;
      try {
        await axios.delete(endpoint, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setShowConfirmDelete(false);
        fetchHistory();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEdit = async (updatedItem) => {
    if (itemToEdit) {
      const endpoint = isIncome ? `/income/${itemToEdit._id}` : `/expense/${itemToEdit._id}`;
      try {
        await axios.put(endpoint, updatedItem, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setShowEditPopup(false);
        fetchHistory();
      } catch (error) {
        console.error('Error editing item:', error);
      }
    }
  };

  return (
    <div className="overflow-y-auto max-h-[350px]">
      <table className="w-full border-collapse border table-fixed">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left w-1/4">Amount</th>
            <th className="p-3 text-left w-1/3">Description</th>
            <th className="p-3 text-left w-1/4">Source/Category</th>
            <th className="p-3 text-left w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-200'}>
              <td className={`p-3 ${isIncome ? 'text-green-500' : 'text-red-500'}`}>{isIncome ? `+Rs. ${item.amount}` : `-Rs. ${item.amount}`}</td>
              <td className="p-3">{item.description}</td>
              <td className="p-3">{isIncome ? item.source : item.category}</td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => {
                    setItemToDelete(item);
                    setShowConfirmDelete(true);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setItemToEdit(item);
                    setShowEditPopup(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {history.length === 0 && <p className="text-center py-4">No history available.</p>}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 bg-gray-200 rounded-lg"
        >
          {`< Previous`}
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= history.length}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          {`Next >`}
        </button>
      </div>
      {showConfirmDelete && (
        <ConfirmDeletePopup
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
      {showEditPopup && (
        <EditPopup
          item={itemToEdit}
          onSave={handleEdit}
          onCancel={() => setShowEditPopup(false)}
          isIncome={isIncome}
        />
      )}
    </div>
  );
};
