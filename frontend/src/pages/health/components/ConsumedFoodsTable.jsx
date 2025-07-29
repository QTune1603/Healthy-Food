import React, { useMemo, useState } from 'react';

const ConsumedFoodsTable = React.memo(({
  consumedFoods,
  editingEntry,
  selectedDate,
  setEditingEntry,
  handleEditEntry,
  handleSaveEdit,
  handleDeleteEntry
}) => {
  // 🔹 State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // số dòng mỗi trang

  // 🔹 Tổng số trang
  const totalPages = Math.ceil(consumedFoods.length / itemsPerPage);

  // 🔹 Dữ liệu trang hiện tại
  const currentFoods = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return consumedFoods.slice(start, end);
  }, [consumedFoods, currentPage]);

  // 🔹 Hàm chuyển trang
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          Thống kê thực phẩm đã tiêu thụ - {selectedDate.toLocaleDateString('vi-VN')}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tên thực phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Bữa ăn</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Số lượng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Calo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Ngày</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Chỉnh sửa</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentFoods.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  Chưa có thực phẩm nào được thêm vào ngày này
                </td>
              </tr>
            ) : (
              currentFoods.map((entry, index) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.foodName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {editingEntry?._id === entry._id ? (
                      <select
                        value={editingEntry.mealType}
                        onChange={(e) => setEditingEntry({ ...editingEntry, mealType: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="breakfast">Sáng</option>
                        <option value="lunch">Trưa</option>
                        <option value="dinner">Tối</option>
                        <option value="snack">Snack</option>
                      </select>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {entry.mealType === 'breakfast' ? 'Sáng' :
                        entry.mealType === 'lunch' ? 'Trưa' :
                        entry.mealType === 'dinner' ? 'Tối' : 'Snack'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {editingEntry?._id === entry._id ? (
                      <input
                        type="number"
                        value={editingEntry.quantity}
                        onChange={(e) => setEditingEntry({ ...editingEntry, quantity: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-16"
                      />
                    ) : (
                      `${entry.quantity}${entry.unit}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#3C493F]">
                    {Math.round(entry.calories || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {entry.diaryDate
                      ? new Date(entry.diaryDate).toLocaleDateString('vi-VN')
                      : entry.createdAt
                      ? new Date(entry.createdAt).toLocaleDateString('vi-VN')
                      : selectedDate.toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingEntry?._id === entry._id ? (
                      <div className="flex space-x-1">
                        <button
                          onClick={handleSaveEdit}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingEntry(null)}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditEntry(entry)}  
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteEntry(entry._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-3 border-t">
          <button 
            onClick={() => goToPage(currentPage - 1)} 
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => goToPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

export default ConsumedFoodsTable;
