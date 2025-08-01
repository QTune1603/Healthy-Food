// src/pages/blog/components/BlogCategoryDescription.jsx
import React from "react";

const BlogCategoryDescription = ({ categoryInfo }) => {
  if (!categoryInfo) return null;

  return (
    <div className="mb-12 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light text-[#3C493F] mb-4">
          {categoryInfo.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {categoryInfo.description}
        </p>
      </div>
    </div>
  );
};

export default BlogCategoryDescription;
