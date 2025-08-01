// src/pages/blog/components/BlogStats.jsx
import React from "react";

const BlogStats = ({ totalPosts, totalCategories, totalSubCategories }) => {
  return (
    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="text-center">
        <div className="text-3xl font-light text-[#3C493F] mb-2">
          {totalPosts}
        </div>
        <div className="text-sm text-gray-500">Bài Viết</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-light text-[#3C493F] mb-2">
          {totalCategories}
        </div>
        <div className="text-sm text-gray-500">Danh Mục Chính</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-light text-[#3C493F] mb-2">
          {totalSubCategories}
        </div>
        <div className="text-sm text-gray-500">Danh Mục Con</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-light text-[#3C493F] mb-2">24/7</div>
        <div className="text-sm text-gray-500">Hỗ Trợ</div>
      </div>
    </div>
  );
};

export default BlogStats;
