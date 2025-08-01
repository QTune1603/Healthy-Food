// src/pages/blog/components/BlogHero.jsx
import React from "react";

const BlogHero = () => {
  return (
    <div className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extralight text-[#3C493F] mb-6">
            Khám Phá Ẩm Thực
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hành trình khám phá những món ăn lành mạnh và bổ dưỡng
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
};

export default BlogHero;
