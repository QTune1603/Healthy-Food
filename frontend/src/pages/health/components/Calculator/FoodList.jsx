import React, { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
// import List from 'react-virtualized';

const FoodList = React.memo(({ 
  loading, 
  filteredFoods, 
  foodGroups, 
  selectedGroup, 
  setSelectedGroup, 
  searchTerm, 
  setSearchTerm, 
  error, 
  openAddModal 
}) => {
  // 🔹 State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // mỗi trang 20 món

  // 🔹 Tính tổng số trang
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

  // 🔹 Lấy dữ liệu cho trang hiện tại
  const currentFoods = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredFoods.slice(start, end);
  }, [filteredFoods, currentPage]);

  //Render mỗi item trong danh sách
  

  // 🔹 Hàm chuyển trang
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  //Xử lý debounce tìm kiếm
  const [debouncedSearchTerm, setDebounceSearchTerm] = useState(searchTerm);
  const debouncedSearch = useMemo(() => debounce((term) => setSearchTerm(term), 1000), [setSearchTerm]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setDebounceSearchTerm(term);
    debouncedSearch(term); //gọi debounce
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Danh sách thực phẩm theo nhóm
        </h3>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm thực phẩm..."
              value={debouncedSearchTerm}
              onChange={handleSearchChange}  // Gọi handleSearchChange
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setCurrentPage(1); // reset về trang 1 khi đổi nhóm
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="all">Tất cả nhóm</option>
              {foodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Food List Table */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tên món</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Nhóm thực phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Calories/100g</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Đơn vị tính</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentFoods.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Không tìm thấy thực phẩm nào
                </td>
              </tr>
            ) : (
              currentFoods.map((food, index) => (
                <tr key={food._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{food.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {food.category || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{food.caloriesPer100g || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{food.unit || 'g'}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openAddModal(food)}
                      className="px-3 py-1 bg-[#3C493F] text-white rounded text-xs hover:bg-[#2a3329]"
                    >
                      Thêm vào bảng
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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

export default FoodList;