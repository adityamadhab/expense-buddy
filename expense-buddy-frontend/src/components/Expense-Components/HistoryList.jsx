import React, { useState } from 'react';

export const HistoryList = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="overflow-y-auto max-h-[350px]">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Source/Category</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-200'}>
              <td className={`p-3 ${item.source ? 'text-green-500' : 'text-red-500'}`}>{item.source ? `+Rs. ${item.amount}` : `-Rs. ${item.amount}`}</td>
              <td className="p-3">{item.description}</td>
              <td className="p-3">{item.source ? `${item.source}` : `${item.category}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {history.length === 0 && <p>No history available.</p>}
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
    </div>
  );
};
